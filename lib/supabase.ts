import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl,
    key: supabaseAnonKey ? 'present' : 'missing'
  });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  display_name: string | null;
  email: string | null;
  subscription_status: string;
  trial_ends_at: string | null;
  free_sessions_used: number;
}

export interface Session {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  title: string | null;
  context: Record<string, any>;
}

export interface Message {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  metadata: Record<string, any>;
}

export interface Favorite {
  id: string;
  user_id: string;
  session_id: string;
  title: string;
  summary: string | null;
  created_at: string;
}

// Auth helpers
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // This allows users to sign in immediately without email confirmation
      emailRedirectTo: undefined,
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Profile helpers
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

// Session helpers
export const createSession = async (userId: string, context: Record<string, any> = {}) => {
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      user_id: userId,
      context,
    })
    .select()
    .single();
  return { data, error };
};

export const getSessions = async (userId: string) => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  return { data, error };
};

export const updateSession = async (sessionId: string, updates: Partial<Session>) => {
  const { data, error } = await supabase
    .from('sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single();
  return { data, error };
};

// Message helpers
export const addMessage = async (sessionId: string, role: 'user' | 'assistant' | 'system', content: string, metadata: Record<string, any> = {}) => {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      session_id: sessionId,
      role,
      content,
      metadata,
    })
    .select()
    .single();
  return { data, error };
};

export const getMessages = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
  return { data, error };
};

// Favorites helpers
export const addFavorite = async (userId: string, sessionId: string, title: string, summary?: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .insert({
      user_id: userId,
      session_id,
      title,
      summary,
    })
    .select()
    .single();
  return { data, error };
};

export const getFavorites = async (userId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const removeFavorite = async (favoriteId: string) => {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('id', favoriteId);
  return { error };
};
