import { createContext, useContext, useState, useEffect } from 'react';
import { router, useSegments } from 'expo-router';
import { supabase } from '../services/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { fetchRemoteData } from '../services/syncService';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'worker' | 'inspector';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const segments = useSegments();

  useEffect(() => {
    // Supabase oturumunu kontrol et
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setUser(mapSupabaseUserToAppUser(session.user));
        fetchRemoteData();
      }
      setIsLoading(false);
    });

    // Oturum değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setUser(mapSupabaseUserToAppUser(session.user));
        fetchRemoteData();
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const mapSupabaseUserToAppUser = (sbUser: SupabaseUser): User => {
    const isAdmin = sbUser.email?.toLowerCase() === 'patron@telisg.com';
    return {
      id: sbUser.id,
      name: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'Kullanıcı',
      email: sbUser.email || '',
      role: isAdmin ? 'admin' : (sbUser.user_metadata?.role || 'worker')
    };
  };

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inRoot = segments.length === 0 || (segments.length === 1 && segments[0] === 'index');

    if (!session && !inAuthGroup && !inRoot) {
      router.replace('/auth/signin');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)/dashboard');
    }
  }, [session, segments, isLoading]);

  const signIn = async (email: string, pass: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) throw error;
    } catch (error: any) {
      alert('Giriş hatası: ' + error.message);
    }
  };

  const signUp = async (email: string, pass: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: name,
            role: 'worker'
          }
        }
      });
      if (error) throw error;
      alert('Kayıt başarılı! Lütfen e-postanızı doğrulayın.');
    } catch (error: any) {
      alert('Kayıt hatası: ' + error.message);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
