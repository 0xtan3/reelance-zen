import { create } from 'zustand';
import { databases, client, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

export interface Message {
  $id: string;
  content: string;
  userId: string;
  userName: string;
  projectId: string;
  createdAt: string;
}

interface ChatState {
  messages: Message[];
  loading: boolean;
  subscribed: boolean;
  fetchMessages: (projectId: string) => Promise<void>;
  sendMessage: (projectId: string, content: string, userId: string, userName: string) => Promise<void>;
  subscribeToMessages: (projectId: string) => () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  loading: false,
  subscribed: false,

  fetchMessages: async (projectId: string) => {
    set({ loading: true });
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.MESSAGES,
        [
          Query.equal('projectId', projectId),
          Query.orderDesc('createdAt'),
          Query.limit(100),
        ]
      );
      const messages = response.documents.map(doc => ({
        $id: doc.$id,
        content: doc.content as string,
        userId: doc.userId as string,
        userName: doc.userName as string,
        projectId: doc.projectId as string,
        createdAt: doc.createdAt as string,
      }));
      set({ messages: messages.reverse(), loading: false });
    } catch (error) {
      console.error('Error fetching messages:', error);
      set({ loading: false, messages: [] });
    }
  },

  sendMessage: async (projectId: string, content: string, userId: string, userName: string) => {
    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.MESSAGES,
        ID.unique(),
        {
          content,
          userId,
          userName,
          projectId,
          createdAt: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  subscribeToMessages: (projectId: string) => {
    if (get().subscribed) return () => {};

    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTIONS.MESSAGES}.documents`,
      (response: any) => {
        const doc = response.payload;
        if (doc.projectId === projectId) {
          if (response.events.includes('databases.*.collections.*.documents.*.create')) {
            const message: Message = {
              $id: doc.$id,
              content: doc.content,
              userId: doc.userId,
              userName: doc.userName,
              projectId: doc.projectId,
              createdAt: doc.createdAt,
            };
            set((state) => ({
              messages: [...state.messages, message],
            }));
          }
        }
      }
    );

    set({ subscribed: true });

    return () => {
      unsubscribe();
      set({ subscribed: false });
    };
  },
}));
