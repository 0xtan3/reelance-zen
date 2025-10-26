import { Client, Account, Databases, Teams } from 'appwrite';

// Get environment variables with fallback for development
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://a.appwrite.com/v1';
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || 'dfjdfjfdkj';
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'project-manager-db';

// Validate required environment variables
if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID) {
  console.error('Missing required Appwrite configuration. Please check your environment variables.');
}

const client = new Client();

client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const teams = new Teams(client);

export { client };

export { DATABASE_ID };
export const COLLECTIONS = {
  MESSAGES: 'messages',
  WORKSPACES: 'workspaces',
  PROJECTS: 'projects',
  TASKS: 'tasks',
  USER_ROLES: 'user_roles',
  TEAM_MEMBERS: 'team_members',
};
