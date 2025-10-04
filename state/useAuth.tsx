import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Platform } from 'react-native';
import { supabase, getCurrentUser, signInWithEmail, signUpWithEmail, signOut, getProfile } from '../lib/supabase';
import { isPro, initRevenueCat } from '../lib/revenuecat';
import type { Profile } from '../lib/supabase';

interface AuthState {
  user: any | null;
  profile: Profile | null;
  isPro: boolean;
  isLoading: boolean;
  error: string | null;
  isEmailConfirmed: boolean;
  needsEmailConfirmation: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshProStatus: () => Promise<void>;
  resendConfirmationEmail: () => Promise<{ success: boolean; error?: string }>;
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
    isEmailConfirmed: false,
    needsEmailConfirmation: false,
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

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await signInWithEmail(email, password);
      if (error) throw error;

      // Auth state will be updated by the onAuthStateChange listener
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await signUpWithEmail(email, password);
      if (error) throw error;

      // Check if email confirmation is required
      const isConfirmed = data.user?.email_confirmed_at != null;
      
      // Auth state will be updated by the onAuthStateChange listener
      return { 
        success: true,
        emailConfirmationRequired: !isConfirmed
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  };

  const resendConfirmationEmail = async () => {
    try {
      if (!state.user?.email) {
        return { success: false, error: 'No email address found' };
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: state.user.email,
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend email';
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
        isEmailConfirmed: false,
        needsEmailConfirmation: false,
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
          // Check email confirmation status
          const isConfirmed = user.email_confirmed_at != null;
          const createdAt = new Date(user.created_at);
          const daysSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
          const needsConfirmation = !isConfirmed && daysSinceCreation > 30;
          
          setState(prev => ({ 
            ...prev, 
            user, 
            isLoading: false,
            isEmailConfirmed: isConfirmed,
            needsEmailConfirmation: needsConfirmation,
          }));
          
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
            // Check email confirmation status
            const isConfirmed = session.user.email_confirmed_at != null;
            const createdAt = new Date(session.user.created_at);
            const daysSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
            const needsConfirmation = !isConfirmed && daysSinceCreation > 30;
            
            setState(prev => ({ 
              ...prev, 
              user: session.user,
              isEmailConfirmed: isConfirmed,
              needsEmailConfirmation: needsConfirmation,
            }));
            
            // Initialize RevenueCat with user ID
            const key = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;
            if (key && Platform.OS !== 'web') {
              try {
                await initRevenueCat(key, session.user.id);
              } catch (error) {
                console.error('Error initializing RevenueCat:', error);
              }
            }
            
            await refreshProfile();
            await refreshProStatus();
          } else {
            setState({
              user: null,
              profile: null,
              isPro: false,
              isLoading: false,
              error: null,
              isEmailConfirmed: false,
              needsEmailConfirmation: false,
            });
            
            // Re-initialize RevenueCat without user ID
            const key = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;
            if (key && Platform.OS !== 'web') {
              try {
                await initRevenueCat(key);
              } catch (error) {
                console.error('Error initializing RevenueCat:', error);
              }
            }
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
    signUp,
    signOut: handleSignOut,
    refreshProfile,
    refreshProStatus,
    resendConfirmationEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
