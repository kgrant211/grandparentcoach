/* Simple local proxy for calling OpenAI-compatible chat completions */
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_API_TOKEN || '';
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const MODEL = process.env.MODEL || 'gpt-4o-mini';

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
      temperature: 0.7,
      max_tokens: 600,
    };

    const r = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
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

app.listen(PORT, () => {
  console.log(`Coach proxy listening on http://localhost:${PORT}`);
});


