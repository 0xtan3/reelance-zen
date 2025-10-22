import { DollarSign, TrendingUp, Clock, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useProjects } from "@/contexts/ProjectContext";
import { WeeklyProgress } from "@/components/WeeklyProgress";

export default function Dashboard() {
  const navigate = useNavigate();
  const { projects, tasks } = useProjects();

  const totalProfit = projects.reduce((sum, p) => sum + p.profit, 0);
  const totalHours = projects.reduce((sum, p) => sum + p.actualHours, 0);
  const activeProjects = projects.filter(p => p.status !== "Completed").length;

  const stats = [
    {
      label: "Total Profit",
      value: `$${totalProfit.toLocaleString()}`,
      change: activeProjects > 0 ? `${activeProjects} active projects` : "No active projects",
      icon: DollarSign,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      label: "Active Projects",
      value: activeProjects.toString(),
      change: `${projects.length} total`,
      icon: Briefcase,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      label: "Total Hours",
      value: totalHours.toString(),
      change: `${tasks.length} tasks`,
      icon: Clock,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      label: "Tasks",
      value: tasks.length.toString(),
      change: `Across ${projects.length} projects`,
      icon: TrendingUp,
      gradient: "from-orange-500 to-red-500",
    },
  ];
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your project overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={stat.label}
            className="glass-strong p-6 hover:shadow-glow transition-all duration-300 cursor-pointer group animate-in slide-in-from-bottom"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold mb-2">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Active Projects */}
      <div className="glass-strong rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Active Projects</h2>
          <button 
            onClick={() => navigate("/projects")}
            className="text-sm text-primary hover:text-primary-glow transition-colors"
          >
            View All →
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No projects yet</p>
            <button
              onClick={() => navigate("/projects")}
              className="text-primary hover:text-primary-glow transition-colors"
            >
              Create your first project →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.slice(0, 3).map((project, index) => {
              const progress = project.estimatedHours > 0
                ? Math.round((project.actualHours / project.estimatedHours) * 100)
                : 0;

              return (
                <div
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}/kanban`)}
                  className="glass rounded-xl p-5 hover:shadow-glass-md transition-all duration-300 cursor-pointer animate-in slide-in-from-left"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.client}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        ${project.profit.toLocaleString()}
                      </p>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400">
                        {project.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full gradient-primary rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Weekly Progress */}
      <div className="glass-strong rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6">Weekly Progress</h2>
        <WeeklyProgress />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => navigate("/projects")}
          className="glass-strong rounded-2xl p-6 text-left hover:shadow-glow transition-all duration-300 group"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-lg mb-1">New Project</h3>
          <p className="text-sm text-muted-foreground">Create a new project and start tracking</p>
        </button>

        <button 
          onClick={() => navigate("/time")}
          className="glass-strong rounded-2xl p-6 text-left hover:shadow-glow transition-all duration-300 group"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-lg mb-1">Log Time</h3>
          <p className="text-sm text-muted-foreground">Track your working hours</p>
        </button>

        <button 
          onClick={() => navigate("/finances")}
          className="glass-strong rounded-2xl p-6 text-left hover:shadow-glow transition-all duration-300 group"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-lg mb-1">View Finances</h3>
          <p className="text-sm text-muted-foreground">Check your earnings and expenses</p>
        </button>
      </div>
    </div>
  );
}
