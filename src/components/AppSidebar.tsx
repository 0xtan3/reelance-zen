import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FolderKanban, 
  DollarSign,
  Clock,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useProjects } from "@/contexts/ProjectContext";
import { useAuthStore } from "@/stores/authStore";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: FolderKanban, label: "Projects", path: "/projects" },
  { icon: DollarSign, label: "Finances", path: "/finances" },
  { icon: Clock, label: "Time Tracker", path: "/time" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { tasks } = useProjects();
  const { user } = useAuthStore();

  const weeklyProgress = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const totalHoursThisWeek = tasks.reduce((sum, task) => {
      const weekHours = (task.workLogs || [])
        .filter(log => new Date(log.date) >= startOfWeek)
        .reduce((logSum, log) => logSum + log.hours, 0);
      return sum + weekHours;
    }, 0);

    const targetHours = 40;
    const percentage = Math.min((totalHoursThisWeek / targetHours) * 100, 100);

    return {
      hours: totalHoursThisWeek,
      target: targetHours,
      percentage,
    };
  }, [tasks]);

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Header */}
        <div className="p-6 border-b border-border/50">
          {!isCollapsed ? (
            <>
              <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                Propulze
              </h1>
              <p className="text-sm text-muted-foreground mt-1">a Tenazity product</p>
            </>
          ) : (
            <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              Propulze
            </h1>
          )}
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 transition-all duration-200",
                          isActive && "shadow-glow"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Weekly Progress - only show when expanded */}
        {!isCollapsed && (
          <div className="mt-auto p-4 border-t border-border/50">
            <div className="glass rounded-xl p-4">
              <p className="text-sm font-medium mb-3">Weekly Progress</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Hours logged</span>
                  <span className="font-medium">
                    {weeklyProgress.hours.toFixed(1)} / {weeklyProgress.target}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full gradient-primary rounded-full transition-all duration-500"
                    style={{ width: `${weeklyProgress.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Info */}
        {!isCollapsed && user && (
          <div className="p-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground px-2">
              {user.name}
            </p>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
