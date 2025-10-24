import { Client, Account, Databases, Teams } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://a.appwrite.com/v1')
  .setProject('dfjdfjfdkj');

export const account = new Account(client);
export const databases = new Databases(client);
export const teams = new Teams(client);

export { client };

export const DATABASE_ID = 'project-manager-db';
export const COLLECTIONS = {
  MESSAGES: 'messages',
  WORKSPACES: 'workspaces',
  PROJECTS: 'projects',
  TASKS: 'tasks',
};
