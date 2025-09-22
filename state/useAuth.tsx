import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase, getCurrentUser, signInWithEmail, signOut, getProfile } from '../lib/supabase';
import { isPro } from '../lib/revenuecat';
import type { Profile } from '../lib/supabase';

interface AuthState {
  user: any | null;
  profile: Profile | null;
  isPro: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  signIn: (email: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshProStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isPro: false,
    isLoading: true,
    error: null,
  });

  const refreshProfile = async () => {
    if (!state.user) return;

    try {
      const { data: profile, error } = await getProfile(state.user.id);
      if (error) throw error;

      setState(prev => ({ ...prev, profile, error: null }));
    } catch (error) {
      console.error('Error refreshing profile:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to load profile' 
      }));
    }
  };

  const refreshProStatus = async () => {
    try {
      const proStatus = await isPro();
      setState(prev => ({ ...prev, isPro: proStatus }));
    } catch (error) {
      console.error('Error checking pro status:', error);
    }
  };

  const signIn = async (email: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await signInWithEmail(email);
      if (error) throw error;

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  };

  const handleSignOut = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await signOut();
      setState({
        user: null,
        profile: null,
        isPro: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error signing out:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Sign out failed',
        isLoading: false 
      }));
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { user, error } = await getCurrentUser();
        if (error) throw error;

        if (user && mounted) {
          setState(prev => ({ ...prev, user, isLoading: false }));
          
          // Load profile and pro status
          const { data: profile } = await getProfile(user.id);
          const proStatus = await isPro();
          
          if (mounted) {
            setState(prev => ({ 
              ...prev, 
              profile, 
              isPro: proStatus,
              error: null 
            }));
          }
        } else if (mounted) {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setState(prev => ({ 
            ...prev, 
            error: 'Failed to initialize authentication',
            isLoading: false 
          }));
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          if (session?.user) {
            setState(prev => ({ ...prev, user: session.user }));
            await refreshProfile();
            await refreshProStatus();
          } else {
            setState({
              user: null,
              profile: null,
              isPro: false,
              isLoading: false,
              error: null,
            });
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    ...state,
    signIn,
    signOut: handleSignOut,
    refreshProfile,
    refreshProStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
