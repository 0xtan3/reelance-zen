# Security Configuration Guide

This guide covers the security setup for the Project Manager application with focus on RBAC (Role-Based Access Control) and JWT authentication.

## Environment Configuration

### Required Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://your-appwrite-endpoint.com/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=project-manager-db
```

**Important:** Never commit the `.env` file to version control. Only commit `.env.example`.

## Database Setup

### 1. Collections

Create the following collections in your Appwrite database:

#### messages
- **Attributes:**
  - `content` (String, required)
  - `userId` (String, required)
  - `userName` (String, required)
  - `projectId` (String, required)
  - `createdAt` (String, required)

- **Permissions:**
  - Read: Any authenticated user
  - Create: Any authenticated user

#### projects
- **Attributes:**
  - `name` (String, required)
  - `client` (String, required)
  - `estimatedHours` (Float, required)
  - `actualHours` (Float, required)
  - `estimatedCost` (Float, required)
  - `actualCost` (Float, required)
  - `profit` (Float, required)
  - `tags` (String[], required)
  - `status` (String, required)
  - `color` (String, required)
  - `notes` (String, optional)
  - `createdBy` (String, required) - User ID who created the project
  - `teamId` (String, optional) - Team ID if project belongs to a team

- **Permissions:**
  - Read: Team members only (implement with custom logic)
  - Create: Any authenticated user
  - Update: Project creator or team admin
  - Delete: Project creator or team admin

#### tasks
- **Attributes:**
  - `projectId` (String, required)
  - `title` (String, required)
  - `description` (String, required)
  - `status` (String, required, enum: todo, inprogress, review, done)
  - `estimatedHours` (Float, required)
  - `actualHours` (Float, required)
  - `dueDate` (String, required)
  - `tags` (String[], required)
  - `assignedTo` (String, optional) - User ID

- **Permissions:**
  - Read: Team members only
  - Create: Team members
  - Update: Task assignee or team admin
  - Delete: Team admin only

#### user_roles
- **Attributes:**
  - `userId` (String, required)
  - `teamId` (String, required)
  - `role` (String, required, enum: admin, member, viewer)

- **Permissions:**
  - Read: Team members only
  - Create: Team admin only
  - Update: Team admin only
  - Delete: Team admin only

- **Indexes:**
  - `userId_teamId` (unique) on `userId` and `teamId`

#### team_members
- **Attributes:**
  - `userId` (String, required)
  - `teamId` (String, required)
  - `email` (String, required)
  - `name` (String, optional)
  - `role` (String, required, enum: admin, member, viewer)
  - `joinedAt` (String, required)

- **Permissions:**
  - Read: Team members only
  - Create: Team admin only
  - Update: Team admin only
  - Delete: Team admin only

## RBAC Implementation

### Role Hierarchy

1. **Admin**
   - Full access to all team resources
   - Can manage team members and roles
   - Can create, read, update, and delete all projects and tasks
   - Can manage team settings

2. **Member**
   - Can create projects and tasks
   - Can update projects/tasks they created or are assigned to
   - Can view all team projects and tasks
   - Cannot manage team members

3. **Viewer**
   - Read-only access to all team projects and tasks
   - Cannot create, update, or delete any resources
   - Cannot manage team members

### Security Best Practices

1. **JWT Authentication**
   - All API requests must include a valid JWT token
   - Tokens are automatically managed by the Appwrite SDK
   - Token expiration is handled by Appwrite

2. **Input Validation**
   - All user inputs are validated client-side before submission
   - Server-side validation is enforced by Appwrite collection schemas
   - Email validation for team invitations

3. **Access Control**
   - Role checks are performed before any sensitive operation
   - Team membership is verified before granting access to resources
   - Project ownership is validated for delete operations

4. **Data Privacy**
   - Users can only access data from teams they belong to
   - Project data is isolated by team
   - Personal information is protected

## Testing Security

### Checklist

- [ ] Users can only see projects from their team
- [ ] Only admins can invite new members
- [ ] Only admins can change user roles
- [ ] Users cannot delete projects they don't own (unless admin)
- [ ] Viewers cannot modify any data
- [ ] JWT tokens are properly validated
- [ ] Expired sessions redirect to login
- [ ] Team invitations require valid email addresses

## Support Tracking

### Project Support Configuration

Each project can track:
- **Maintenance Period:** Number of months of support
- **Maintenance End Date:** When maintenance expires
- **Hosting Period:** Number of years of hosting
- **Hosting End Date:** When hosting expires
- **SSL Status:** Whether SSL is included
- **Backup Status:** Whether automated backups are enabled

These fields help manage client commitments and track service delivery.

## Troubleshooting

### Common Issues

1. **Cannot see projects after login**
   - Verify team membership in the `team_members` collection
   - Check if user has the correct team ID in localStorage

2. **Permission denied errors**
   - Verify collection permissions in Appwrite console
   - Check user role in `user_roles` collection
   - Ensure JWT token is not expired

3. **Team invitations not working**
   - Verify email service is configured in Appwrite
   - Check that inviter has admin role
   - Ensure `team_members` collection has correct permissions

## Next Steps

1. Set up email templates for team invitations
2. Implement audit logging for security events
3. Add two-factor authentication
4. Set up automated backups
5. Configure rate limiting for API endpoints
