/* Simple local proxy for calling OpenAI-compatible chat completions */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
// CORS allowlist for dev: allow both Expo web and other local apps
const ALLOW_ORIGINS = (process.env.ALLOW_ORIGINS || [
  'http://localhost:8081',
  'http://127.0.0.1:8081',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].join(',')).split(',');

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOW_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 3010;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_API_TOKEN || '';
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const MODEL = process.env.MODEL || 'gpt-4o-mini';
const OPENAI_ORG = process.env.OPENAI_ORG || process.env.OPENAI_ORGANIZATION || '';
const OPENAI_PROJECT = process.env.OPENAI_PROJECT || '';

let systemPrompt = 'You are a warm, practical parenting coach for grandparents.';
try {
  const p = require('path').join(__dirname, '..', 'prompts', 'coach-system-prompt.txt');
  if (fs.existsSync(p)) systemPrompt = fs.readFileSync(p, 'utf8');
} catch {}

app.get('/health', (_, res) => res.json({ ok: true }));

app.post('/coach', async (req, res) => {
  try {
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Missing OPENAI_API_KEY' });
    }
    const { messages = [], context = {} } = req.body || {};

    // Minimal server-side safety checks
    const userText = (messages || [])
      .filter(m => m && m.role === 'user')
      .map(m => m.content || '')
      .join(' \n ');
    const lower = userText.toLowerCase();
    const crisisKeywords = /(suicide|self-harm|kill myself|immediate danger|violence|abuse|overdose)/i;
    const medicalKeywords = /(fever|rash|injury|medicine|dosage|diagnos|doctor|pediatrician|allergy|asthma|seizure|concussion|covid|antibiotic)/i;
    if (crisisKeywords.test(lower)) {
      return res.json({
        content:
          "I'm really glad you reached out. For any safety concern or immediate danger, please contact local emergency services or a trusted professional now. In the U.S., you can call or text 988 for the Suicide & Crisis Lifeline. I'm here with gentle guidance once everyone is safe."
      });
    }
    if (medicalKeywords.test(lower)) {
      return res.json({
        content:
          "I can’t provide medical advice. For medical questions or symptoms, please contact a licensed healthcare professional. I can help with communication, boundaries, and connection once medical concerns are addressed."
      });
    }

    // Build prompt with light context
    const ctxPrefix = [];
    if (context?.topic) ctxPrefix.push(`Topic: ${context.topic}`);
    if (context?.ageRange) ctxPrefix.push(`Age range: ${context.ageRange}`);
    const sys = ctxPrefix.length ? `${systemPrompt}\n\nContext:\n${ctxPrefix.join('\n')}` : systemPrompt;

    const body = {
      model: MODEL,
      messages: [
        { role: 'system', content: sys },
        ...messages.map(m => ({ role: m.role, content: m.content }))
      ],
      temperature: 0.9,
      max_tokens: 900,
    };

    const r = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        ...(OPENAI_ORG ? { 'OpenAI-Organization': OPENAI_ORG } : {}),
        ...(OPENAI_PROJECT ? { 'OpenAI-Project': OPENAI_PROJECT } : {}),
      },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      const txt = await r.text();
      return res.status(500).json({ error: 'LLM error', detail: txt });
    }
    const data = await r.json();
    const content = data?.choices?.[0]?.message?.content || '';
    return res.json({ content });
  } catch (e) {
    console.error('coach error', e);
    return res.status(500).json({ error: 'server_error' });
  }
});

// Summarize a conversation into a short, friendly, plain-language one-pager
app.post('/summarize', async (req, res) => {
  try {
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Missing OPENAI_API_KEY' });
    }
    const { transcript = '', messages = [], audience = 'grandparent' } = req.body || {};
    let text = transcript;
    if (!text && Array.isArray(messages) && messages.length) {
      text = messages
        .map((m) => `${m.role || 'user'}: ${m.content || ''}`)
        .join('\n');
    }
    const prompt = [
      { role: 'system', content: 'You create short, warm, plain-language summaries for grandparents. No medical or legal advice.' },
      { role: 'user', content: `Please summarize this coaching conversation for a ${audience} in one page. Use:\n- Situation (2 sentences)\n- What matters (3 bullet points, plain language)\n- Try this (3-5 simple steps)\n- Gentle scripts (2-3 short examples)\n- Encouragement (1 sentence)\n\nConversation:\n${text}` }
    ];

    const r = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        ...(OPENAI_ORG ? { 'OpenAI-Organization': OPENAI_ORG } : {}),
        ...(OPENAI_PROJECT ? { 'OpenAI-Project': OPENAI_PROJECT } : {}),
      },
      body: JSON.stringify({ model: MODEL, messages: prompt, temperature: 0.7, max_tokens: 700 })
    });
    if (!r.ok) {
      const txt = await r.text();
      return res.status(500).json({ error: 'LLM error', detail: txt });
    }
    const data = await r.json();
    const content = data?.choices?.[0]?.message?.content || '';
    return res.json({ content });
  } catch (e) {
    console.error('summarize error', e);
    return res.status(500).json({ error: 'server_error' });
  }
});

app.listen(PORT, () => {
  console.log(`Coach proxy listening on http://localhost:${PORT}`);
  if (OPENAI_ORG) console.log(`Using OpenAI Organization: ${OPENAI_ORG}`);
  if (OPENAI_PROJECT) console.log(`Using OpenAI Project: ${OPENAI_PROJECT}`);
});


