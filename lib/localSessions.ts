import AsyncStorage from '@react-native-async-storage/async-storage';

export type ChatRole = 'user' | 'assistant' | 'system';

export interface LocalMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
}

export interface LocalSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

const SESSIONS_KEY = 'gpc:sessions';
const MESSAGES_KEY = (sessionId: string) => `gpc:messages:${sessionId}`;
const FREE_COUNT_KEY = 'gpc:free_count';

export async function loadSessions(): Promise<LocalSession[]> {
  try {
    const raw = await AsyncStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveSessions(sessions: LocalSession[]): Promise<void> {
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export async function loadMessages(sessionId: string): Promise<LocalMessage[]> {
  try {
    const raw = await AsyncStorage.getItem(MESSAGES_KEY(sessionId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveMessages(sessionId: string, messages: LocalMessage[]): Promise<void> {
  await AsyncStorage.setItem(MESSAGES_KEY(sessionId), JSON.stringify(messages));
}

export async function createSession(initialTitle: string): Promise<LocalSession> {
  const now = new Date().toISOString();
  const session: LocalSession = {
    id: `${Date.now()}`,
    title: initialTitle,
    createdAt: now,
    updatedAt: now,
  };
  const sessions = await loadSessions();
  await saveSessions([session, ...sessions]);
  return session;
}

export async function updateSessionTitle(sessionId: string, title: string): Promise<void> {
  const sessions = await loadSessions();
  const updated = sessions.map(s => s.id === sessionId ? { ...s, title, updatedAt: new Date().toISOString() } : s);
  await saveSessions(updated);
}

export function generateTitleFromText(text: string, fallback = 'Conversation'): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return fallback;
  const words = cleaned.split(' ').slice(0, 6).join(' ');
  return words + (cleaned.split(' ').length > 6 ? '…' : '');
}

export async function touchSession(sessionId: string): Promise<void> {
  const sessions = await loadSessions();
  const updated = sessions.map(s => s.id === sessionId ? { ...s, updatedAt: new Date().toISOString() } : s);
  await saveSessions(updated);
}

export async function deleteSession(sessionId: string): Promise<void> {
  const sessions = await loadSessions();
  await saveSessions(sessions.filter(s => s.id !== sessionId));
  await AsyncStorage.removeItem(MESSAGES_KEY(sessionId));
}

export async function getFreeCount(): Promise<number> {
  const raw = await AsyncStorage.getItem(FREE_COUNT_KEY);
  return raw ? parseInt(raw, 10) || 0 : 0;
}

export async function incrementFreeCount(): Promise<number> {
  const current = await getFreeCount();
  const next = current + 1;
  await AsyncStorage.setItem(FREE_COUNT_KEY, String(next));
  return next;
}

export async function resetFreeCount(): Promise<void> {
  await AsyncStorage.removeItem(FREE_COUNT_KEY);
}


