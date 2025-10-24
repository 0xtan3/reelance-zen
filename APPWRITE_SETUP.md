# Appwrite Setup Guide

This guide will help you set up your Appwrite instance for the Project Manager application.

## Prerequisites

- Self-hosted Appwrite instance running at `https://a.appwrite.com`
- Project ID: `dfjdfjfdkj`

## Database Setup

### 1. Create Database

1. Log in to your Appwrite console
2. Navigate to "Databases"
3. Create a new database with ID: `project-manager-db`

### 2. Create Collections

#### Messages Collection

1. Create a collection with ID: `messages`
2. Add the following attributes:
   - `content` (String, Required, Max: 5000)
   - `userId` (String, Required, Max: 255)
   - `userName` (String, Required, Max: 255)
   - `projectId` (String, Required, Max: 255)
   - `createdAt` (DateTime, Required)

3. Set up indexes:
   - Index on `projectId` (ASC)
   - Index on `createdAt` (DESC)

4. Configure permissions:
   - **Read access**: Any authenticated user
   - **Create access**: Any authenticated user
   - Go to Settings → Permissions
   - Add: `role:member` with Read and Create permissions

#### Workspaces Collection (Optional - for future use)

1. Create a collection with ID: `workspaces`
2. Add attributes:
   - `name` (String, Required, Max: 255)
   - `ownerId` (String, Required, Max: 255)
   - `members` (String[], Required)
   - `createdAt` (DateTime, Required)

3. Configure permissions:
   - **Read access**: Team members only
   - **Create access**: Any authenticated user

## Authentication Setup

### Enable Email/Password Authentication

1. Navigate to "Auth" in your Appwrite console
2. Enable "Email/Password" authentication method
3. Configure session settings:
   - Session length: 365 days (or your preference)
   - Security → Enable "Limit access to verified users": No (for development)

## Realtime Configuration

1. Navigate to your project settings
2. Under "Realtime" settings, ensure it's enabled
3. Configure allowed domains if needed

## Testing the Setup

After completing the setup:

1. Start your application
2. Navigate to `/auth`
3. Create a new account
4. Log in
5. Create a project
6. Go to the project's Kanban board
7. Switch to the "Team Chat" tab
8. Send a test message

## Security Recommendations

- Enable rate limiting on authentication endpoints
- Set up proper CORS policies for production
- Use environment variables for sensitive configuration
- Implement proper user roles and permissions
- Enable email verification for production use

## Troubleshooting

### Messages not appearing in chat

1. Check that the Messages collection has proper read/create permissions
2. Verify that realtime is enabled in project settings
3. Check browser console for any WebSocket connection errors

### Authentication issues

1. Verify Email/Password auth is enabled
2. Check that session settings are configured
3. Ensure your domain is whitelisted in Appwrite settings

### Permission errors

1. Make sure you've added `role:member` permissions to the Messages collection
2. Verify the user is authenticated (check browser dev tools → Application → Cookies)

## Next Steps

- Set up teams and workspace management
- Configure advanced permissions
- Add email notifications
- Implement file storage for attachments
- Add user profiles and avatars
