import { create } from 'zustand';
import { account } from '@/lib/appwrite';
import { Models } from 'appwrite';

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  login: async (email: string, password: string) => {
    set({ loading: true });
    try {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      set({ user, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  signup: async (email: string, password: string, name: string) => {
    set({ loading: true });
    try {
      await account.create('unique()', email, password, name);
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      set({ user, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await account.deleteSession('current');
      set({ user: null });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  checkAuth: async () => {
    try {
      const user = await account.get();
      set({ user, initialized: true });
    } catch (error) {
      set({ user: null, initialized: true });
    }
  },
}));
