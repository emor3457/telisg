import { createContext, useContext, useState, useEffect } from 'react';
import { router, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'worker' | 'inspector';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const segments = useSegments();

  useEffect(() => {
    // Uygulama açıldığında oturum kontrolü
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@auth_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Oturum yüklenemedi:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inRoot = segments.length === 0 || (segments.length === 1 && segments[0] === 'index');

    if (!user && !inAuthGroup && !inRoot) {
      // Kullanıcı giriş yapmamışsa ve korumalı bir sayfadaysa Login'e at
      router.replace('/auth/signin');
    } else if (user && inAuthGroup) {
      // Kullanıcı giriş yapmışsa ve Login sayfasındaysa Dashboard'a at
      router.replace('/(tabs)/dashboard');
    }
  }, [user, segments, isLoading]);

  const signIn = async (email: string, pass: string) => {
    // Kurucu (Yaratıcı) e-postası kontrolü
    // Patron/Yönetici hesabı için sadece bu e-postaya "admin" yetkisi verilecek
    const isAdmin = email.toLowerCase() === 'patron@telisg.com';

    const mockUser: User = {
      id: isAdmin ? 'usr_admin_1' : 'usr_' + Date.now(),
      name: isAdmin ? 'Sistem Yöneticisi' : 'Saha Personeli',
      email: email,
      role: isAdmin ? 'admin' : 'worker'
    };
    
    setUser(mockUser);
    await AsyncStorage.setItem('@auth_user', JSON.stringify(mockUser));
    router.replace('/(tabs)/dashboard');
  };

  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem('@auth_user');
    router.replace('/');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
