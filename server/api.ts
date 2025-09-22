export async function askCoachAPI(payload: {
  context?: { topic?: string; ageRange?: string };
  messages: { role: 'user' | 'assistant'; content: string }[];
}) {
  const base = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:3000';
  const res = await fetch(`${base}/coach`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Coach API error');
  return res.json() as Promise<{ content: string }>; 
}

import { filterContent } from '../lib/validation';

export interface CoachRequest {
  sessionId: string;
  context: {
    ageRange?: string;
    situationType?: string;
    attempted?: string;
    urgency?: boolean;
    userNotes?: string;
  };
  messages: {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }[];
}

export interface CoachResponse {
  success: boolean;
  message?: string;
  content?: string;
  isCrisis?: boolean;
  isMedical?: boolean;
  error?: string;
}

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'https://your-api-domain.com';

export async function askCoach(payload: CoachRequest): Promise<CoachResponse> {
  try {
    // Content safety filtering
    const lastMessage = payload.messages[payload.messages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
      const filterResult = filterContent(lastMessage.content);
      
      if (!filterResult.isSafe) {
        return {
          success: true,
          message: filterResult.response,
          isCrisis: filterResult.response?.includes('emergency'),
          isMedical: filterResult.response?.includes('medical'),
        };
      }
    }

    const response = await fetch(`${API_BASE}/coach`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling coach API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function summarizeSession(sessionId: string, messages: any[]): Promise<CoachResponse> {
  try {
    const response = await fetch(`${API_BASE}/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify({ sessionId, messages }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling summarize API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Helper function to get auth token
async function getAuthToken(): Promise<string> {
  // This would typically get the token from your auth system
  // For now, return a placeholder
  return 'placeholder-token';
}

// Rate limiting helper
const rateLimiter = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(userId: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const userLimit = rateLimiter.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimiter.set(userId, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userLimit.count >= maxRequests) {
    return false;
  }
  
  userLimit.count++;
  return true;
}
