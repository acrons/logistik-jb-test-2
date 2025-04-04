import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type UserRow = Database['public']['Tables']['users']['Row'];

interface AuthState {
  isAuthenticated: boolean;
  user: UserRow | null;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  setUser: (user: UserRow | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();
      
      if (error || !data) {
        throw new Error('Credenciales inválidas');
      }
      
      set({ user: data, isAuthenticated: true });
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },
  logout: async () => {
    set({ user: null, isAuthenticated: false });
  },
}));
