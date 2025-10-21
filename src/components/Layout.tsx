import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  DollarSign,
  Clock,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: FolderKanban, label: "Projects", path: "/projects" },
  { icon: CheckSquare, label: "Kanban", path: "/kanban" },
  { icon: DollarSign, label: "Finances", path: "/finances" },
  { icon: Clock, label: "Time Tracker", path: "/time" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="w-64 glass-strong border-r border-border/50 flex flex-col">
        <div className="p-6 border-b border-border/50">
          <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
            ProjectFlow
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Freelance Manager</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  "hover:bg-secondary/50 hover:shadow-glass-sm",
                  isActive && "bg-primary text-primary-foreground shadow-glow"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="glass rounded-xl p-4">
            <p className="text-sm font-medium">Weekly Progress</p>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Hours logged</span>
                <span className="font-medium">32 / 40</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full gradient-primary rounded-full transition-all duration-500"
                  style={{ width: "80%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="gradient-glow fixed top-0 left-64 right-0 h-48 pointer-events-none" />
        <div className="relative z-10 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
