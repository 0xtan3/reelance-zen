# ProjectFlow - Secure Team Project Manager

A secure, collaborative project management application built with React, TypeScript, and Appwrite. Designed for small teams with enterprise-grade security and RBAC.

## 🌟 Features

### 🔐 Security First
- JWT-based authentication
- Role-based access control (RBAC)
- Secure team collaboration
- Environment-based configuration
- Encrypted communication

### 👥 Team Management
- Multi-user support
- Three role types: Admin, Member, Viewer
- Team invitations and member management
- Isolated team workspaces

### 📊 Project Management
- Create and track projects
- Task management with Kanban boards
- Time tracking and work logs
- Financial tracking (costs, revenue, profit)

### 💬 Real-time Collaboration
- Team chat per project
- Real-time message updates
- User presence indicators

### 🛠️ Support Tracking
- Track 6-month maintenance periods
- Monitor 1-year hosting commitments
- SSL certificate tracking
- Backup status monitoring

## Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Self-hosted Appwrite instance
- Appwrite Project ID and API Endpoint

### Installation

1. **Clone and install**
```bash
git clone <repository-url>
cd projectflow
npm install  # or: bun install
```

2. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` with your Appwrite configuration:
```env
VITE_APPWRITE_ENDPOINT=https://your-appwrite-endpoint.com/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=project-manager-db
```

3. **Set up Appwrite**
- Follow `APPWRITE_SETUP.md` for database collections
- Follow `SECURITY_SETUP.md` for RBAC configuration

4. **Start development**
```bash
npm run dev  # or: bun dev
```

Visit `http://localhost:8080`

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # Shadcn UI components
│   ├── TeamManagement.tsx
│   └── ProjectSupportCard.tsx
├── contexts/        # React contexts
├── lib/             # Configurations (Appwrite)
├── pages/           # Page components
├── stores/          # Zustand state management
│   ├── authStore.ts
│   ├── chatStore.ts
│   └── teamStore.ts
└── main.tsx         # Entry point
```

## 🔒 Security Architecture

### Authentication
- JWT tokens via Appwrite
- Automatic token refresh
- Secure session management
- Protected routes

### Authorization (RBAC)

| Role | Permissions |
|------|------------|
| **Admin** | Full access, team management, all CRUD operations |
| **Member** | Create/edit own content, view team data |
| **Viewer** | Read-only access |

### Data Protection
- Environment-based secrets (never hardcoded)
- Team-isolated data
- Input validation and sanitization
- Secure API communication

## 🚀 Usage Guide

### Getting Started

1. **Sign Up/Login**
   - Navigate to `/auth`
   - Create account or sign in

2. **Create Your Team**
   - First login creates your workspace automatically
   - Go to Settings > Team to manage

3. **Invite Team Members** (Admin only)
   - Settings > Team > Invite Team Member
   - Enter email and assign role
   - Team member receives invitation

### Managing Projects

1. **Create Project**
   - Navigate to Projects
   - Click "New Project"
   - Fill in details:
     - Name, Client, Estimated Hours/Cost
     - Tags, Notes
     - Support configuration (optional)

2. **Track Support Commitments**
   - Maintenance period (default: 6 months)
   - Hosting period (default: 1 year)
   - SSL status
   - Backup status

3. **Manage Tasks**
   - Open project Kanban board
   - Drag tasks between columns
   - Log work hours
   - Track progress

4. **Team Collaboration**
   - Use project chat for communication
   - Real-time message updates
   - @mention team members

## 🛠️ Development

### Tech Stack
- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Shadcn UI
- **State:** Zustand
- **Backend:** Appwrite (self-hosted)
- **Auth:** JWT via Appwrite
- **Real-time:** Appwrite Realtime

### Scripts
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Environment Variables

**Required:**
- `VITE_APPWRITE_ENDPOINT` - Your Appwrite API endpoint
- `VITE_APPWRITE_PROJECT_ID` - Your Appwrite project ID
- `VITE_APPWRITE_DATABASE_ID` - Database ID (default: project-manager-db)

## 📦 Deployment

### Build for Production
```bash
npm run build
```

Output in `dist/` directory.

### Hosting Options
- Vercel
- Netlify
- Cloudflare Pages
- Any static hosting

### Important Notes
1. Set environment variables in hosting platform
2. Ensure Appwrite endpoint is accessible
3. Configure CORS in Appwrite console
4. Use HTTPS in production

## 🐛 Troubleshooting

### Cannot Connect to Appwrite
- Verify `VITE_APPWRITE_ENDPOINT` is correct
- Check Appwrite instance is running
- Configure CORS in Appwrite console

### Permission Denied
- Check user role in Settings > Team
- Verify collection permissions in Appwrite
- Ensure JWT token is valid

### Real-time Not Working
- Enable Realtime in Appwrite
- Check WebSocket connection
- Verify collection permissions

### See `SECURITY_SETUP.md` for more troubleshooting

## 📚 Documentation

- `APPWRITE_SETUP.md` - Database setup guide
- `SECURITY_SETUP.md` - Security configuration
- `.env.example` - Environment variable template

## 🗺️ Roadmap

- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Data export functionality
- [ ] Mobile app (React Native)
- [ ] Audit logging
- [ ] Two-factor authentication
- [ ] File attachments
- [ ] Calendar integration
- [ ] Advanced reporting
- [ ] Gantt charts

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file

## 💬 Support

For issues and questions:
1. Check documentation files
2. Review troubleshooting sections
3. Open GitHub issue

---

## Lovable Project Info

**Project URL**: https://lovable.dev/projects/069911a0-af84-4cb9-83fb-ee28f4e4ed66

### Editing Options

**Use Lovable** - Visit the project and start prompting. Changes commit automatically.

**Use Your IDE** - Clone, edit locally, and push. Changes reflect in Lovable.

**GitHub Direct Edit** - Edit files directly in GitHub interface.

**GitHub Codespaces** - Full cloud development environment.

### Deployment

Open [Lovable](https://lovable.dev/projects/069911a0-af84-4cb9-83fb-ee28f4e4ed66) → Share → Publish

### Custom Domain

Project > Settings > Domains → Connect Domain

[Read more about custom domains](https://docs.lovable.dev/features/custom-domain)
