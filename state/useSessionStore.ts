import { useState, useCallback } from 'react';
import { 
  createSession, 
  getSessions, 
  updateSession, 
  addMessage, 
  getMessages,
  addFavorite,
  getFavorites,
  removeFavorite,
  type Session,
  type Message,
  type Favorite
} from '../lib/supabase';
import { askCoach, summarizeSession } from '../server/api';
import { useAuth } from './useAuth';

interface CoachingContext {
  ageRange?: string;
  situationType?: string;
  attempted?: string;
  urgency?: boolean;
  userNotes?: string;
}

interface SessionState {
  currentSession: Session | null;
  sessions: Session[];
  messages: Message[];
  favorites: Favorite[];
  isLoading: boolean;
  error: string | null;
}

export const useSessionStore = () => {
  const { user, isPro } = useAuth();
  const [state, setState] = useState<SessionState>({
    currentSession: null,
    sessions: [],
    messages: [],
    favorites: [],
    isLoading: false,
    error: null,
  });

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  // Load user's sessions
  const loadSessions = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data: sessions, error } = await getSessions(user.id);
      if (error) throw error;

      setState(prev => ({ ...prev, sessions: sessions || [], error: null }));
    } catch (error) {
      console.error('Error loading sessions:', error);
      setError(error instanceof Error ? error.message : 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  }, [user, setLoading, setError]);

  // Load user's favorites
  const loadFavorites = useCallback(async () => {
    if (!user) return;

    try {
      const { data: favorites, error } = await getFavorites(user.id);
      if (error) throw error;

      setState(prev => ({ ...prev, favorites: favorites || [] }));
    } catch (error) {
      console.error('Error loading favorites:', error);
      setError(error instanceof Error ? error.message : 'Failed to load favorites');
    }
  }, [user, setError]);

  // Create a new session
  const createNewSession = useCallback(async (context: CoachingContext = {}) => {
    if (!user) return null;

    try {
      setLoading(true);
      const { data: session, error } = await createSession(user.id, context);
      if (error) throw error;

      setState(prev => ({ 
        ...prev, 
        currentSession: session,
        sessions: [session, ...prev.sessions],
        messages: [],
        error: null 
      }));

      return session;
    } catch (error) {
      console.error('Error creating session:', error);
      setError(error instanceof Error ? error.message : 'Failed to create session');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, setLoading, setError]);

  // Load messages for a session
  const loadMessages = useCallback(async (sessionId: string) => {
    try {
      setLoading(true);
      const { data: messages, error } = await getMessages(sessionId);
      if (error) throw error;

      setState(prev => ({ ...prev, messages: messages || [], error: null }));
    } catch (error) {
      console.error('Error loading messages:', error);
      setError(error instanceof Error ? error.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Start a coaching session
  const startCoachingSession = useCallback(async (context: CoachingContext) => {
    const session = await createNewSession(context);
    if (!session) return null;

    // Add initial system message
    await addMessage(session.id, 'system', 'You are a helpful grandparent coaching assistant.');
    
    return session;
  }, [createNewSession]);

  // Send a message to the coach
  const sendMessage = useCallback(async (content: string) => {
    if (!state.currentSession || !user) return;

    try {
      setLoading(true);

      // Add user message
      const { data: userMessage, error: userError } = await addMessage(
        state.currentSession.id, 
        'user', 
        content
      );
      if (userError) throw userError;

      // Update messages state
      setState(prev => ({ 
        ...prev, 
        messages: [...prev.messages, userMessage],
        error: null 
      }));

      // Call coach API
      const allMessages = [...state.messages, userMessage];
      const response = await askCoach({
        sessionId: state.currentSession.id,
        context: state.currentSession.context,
        messages: allMessages,
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to get coach response');
      }

      // Add assistant message
      const { data: assistantMessage, error: assistantError } = await addMessage(
        state.currentSession.id,
        'assistant',
        response.message || response.content || 'I apologize, but I encountered an error.'
      );
      if (assistantError) throw assistantError;

      // Update messages state
      setState(prev => ({ 
        ...prev, 
        messages: [...prev.messages, assistantMessage],
        error: null 
      }));

      // Update session timestamp
      await updateSession(state.currentSession.id, { 
        updated_at: new Date().toISOString() 
      });

    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  }, [state.currentSession, state.messages, user, setLoading, setError]);

  // Add to favorites
  const addToFavorites = useCallback(async (title: string, summary?: string) => {
    if (!state.currentSession || !user) return;

    try {
      const { data: favorite, error } = await addFavorite(
        user.id,
        state.currentSession.id,
        title,
        summary
      );
      if (error) throw error;

      setState(prev => ({ 
        ...prev, 
        favorites: [favorite, ...prev.favorites] 
      }));
    } catch (error) {
      console.error('Error adding to favorites:', error);
      setError(error instanceof Error ? error.message : 'Failed to add to favorites');
    }
  }, [state.currentSession, user, setError]);

  // Remove from favorites
  const removeFromFavorites = useCallback(async (favoriteId: string) => {
    try {
      const { error } = await removeFavorite(favoriteId);
      if (error) throw error;

      setState(prev => ({ 
        ...prev, 
        favorites: prev.favorites.filter(fav => fav.id !== favoriteId) 
      }));
    } catch (error) {
      console.error('Error removing from favorites:', error);
      setError(error instanceof Error ? error.message : 'Failed to remove from favorites');
    }
  }, [setError]);

  // Generate session summary
  const generateSummary = useCallback(async (sessionId: string) => {
    try {
      const { data: messages, error } = await getMessages(sessionId);
      if (error) throw error;

      const response = await summarizeSession(sessionId, messages || []);
      if (!response.success) {
        throw new Error(response.error || 'Failed to generate summary');
      }

      return response.content || response.message;
    } catch (error) {
      console.error('Error generating summary:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate summary');
      return null;
    }
  }, [setError]);

  // Set current session
  const setCurrentSession = useCallback((session: Session | null) => {
    setState(prev => ({ ...prev, currentSession: session }));
    if (session) {
      loadMessages(session.id);
    } else {
      setState(prev => ({ ...prev, messages: [] }));
    }
  }, [loadMessages]);

  return {
    ...state,
    loadSessions,
    loadFavorites,
    createNewSession,
    startCoachingSession,
    loadMessages,
    sendMessage,
    addToFavorites,
    removeFromFavorites,
    generateSummary,
    setCurrentSession,
    isPro,
  };
};
