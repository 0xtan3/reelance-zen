import { create } from 'zustand';
import { teams, databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

export type UserRole = 'admin' | 'member' | 'viewer';

export interface TeamMember {
  $id: string;
  userId: string;
  teamId: string;
  role: UserRole;
  email: string;
  name: string;
  joinedAt: string;
}

export interface Team {
  $id: string;
  name: string;
  ownerId: string;
  createdAt: string;
}

interface TeamState {
  currentTeam: Team | null;
  members: TeamMember[];
  userRole: UserRole | null;
  loading: boolean;
  createTeam: (name: string) => Promise<void>;
  fetchTeam: (teamId: string) => Promise<void>;
  fetchMembers: (teamId: string) => Promise<void>;
  inviteMember: (email: string, role: UserRole) => Promise<void>;
  updateMemberRole: (memberId: string, role: UserRole) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  checkUserRole: (userId: string, teamId: string) => Promise<UserRole | null>;
}

export const useTeamStore = create<TeamState>((set, get) => ({
  currentTeam: null,
  members: [],
  userRole: null,
  loading: false,

  createTeam: async (name: string) => {
    set({ loading: true });
    try {
      const team = await teams.create(ID.unique(), name);
      set({ currentTeam: team as unknown as Team, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchTeam: async (teamId: string) => {
    set({ loading: true });
    try {
      const team = await teams.get(teamId);
      set({ currentTeam: team as unknown as Team, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchMembers: async (teamId: string) => {
    set({ loading: true });
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.TEAM_MEMBERS,
        [Query.equal('teamId', teamId)]
      );
      set({ members: response.documents as unknown as TeamMember[], loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  inviteMember: async (email: string, role: UserRole) => {
    const { currentTeam } = get();
    if (!currentTeam) throw new Error('No team selected');

    set({ loading: true });
    try {
      // Create membership invitation
      await teams.createMembership(
        currentTeam.$id,
        ['member'],
        email
      );
      
      // Store role information
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.TEAM_MEMBERS,
        ID.unique(),
        {
          teamId: currentTeam.$id,
          email,
          role,
          joinedAt: new Date().toISOString(),
        }
      );

      await get().fetchMembers(currentTeam.$id);
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  updateMemberRole: async (memberId: string, role: UserRole) => {
    set({ loading: true });
    try {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.TEAM_MEMBERS,
        memberId,
        { role }
      );

      const { currentTeam } = get();
      if (currentTeam) {
        await get().fetchMembers(currentTeam.$id);
      }
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  removeMember: async (memberId: string) => {
    set({ loading: true });
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.TEAM_MEMBERS,
        memberId
      );

      const { currentTeam } = get();
      if (currentTeam) {
        await get().fetchMembers(currentTeam.$id);
      }
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  checkUserRole: async (userId: string, teamId: string) => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.TEAM_MEMBERS,
        [
          Query.equal('userId', userId),
          Query.equal('teamId', teamId)
        ]
      );

      if (response.documents.length > 0) {
        const member = response.documents[0] as unknown as TeamMember;
        set({ userRole: member.role });
        return member.role;
      }

      // Check if user is team owner
      const team = await teams.get(teamId);
      if ((team as any).$createdBy === userId) {
        set({ userRole: 'admin' });
        return 'admin';
      }

      set({ userRole: null });
      return null;
    } catch (error) {
      console.error('Error checking user role:', error);
      return null;
    }
  },
}));
