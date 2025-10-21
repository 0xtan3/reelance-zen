import { DollarSign, TrendingUp, Clock, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";

const stats = [
  {
    label: "Total Profit",
    value: "$12,450",
    change: "+18% from last month",
    icon: DollarSign,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    label: "Active Projects",
    value: "8",
    change: "3 due this week",
    icon: Briefcase,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    label: "Hours This Week",
    value: "32",
    change: "80% of target",
    icon: Clock,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    label: "Revenue Growth",
    value: "+24%",
    change: "Compared to last quarter",
    icon: TrendingUp,
    gradient: "from-orange-500 to-red-500",
  },
];

const recentProjects = [
  {
    name: "E-commerce Redesign",
    client: "TechCorp Inc.",
    progress: 75,
    profit: "$3,200",
    status: "on-track",
  },
  {
    name: "Mobile App Development",
    client: "StartupXYZ",
    progress: 45,
    profit: "$5,800",
    status: "on-track",
  },
  {
    name: "Brand Identity Package",
    client: "Creative Studio",
    progress: 90,
    profit: "$2,100",
    status: "ahead",
  },
];

export default function Dashboard() {
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
          <button className="text-sm text-primary hover:text-primary-glow transition-colors">
            View All →
          </button>
        </div>

        <div className="space-y-4">
          {recentProjects.map((project, index) => (
            <div
              key={project.name}
              className="glass rounded-xl p-5 hover:shadow-glass-md transition-all duration-300 animate-in slide-in-from-left"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">{project.client}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{project.profit}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      project.status === "ahead"
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    {project.status === "ahead" ? "Ahead" : "On Track"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-primary rounded-full transition-all duration-1000"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="glass-strong rounded-2xl p-6 text-left hover:shadow-glow transition-all duration-300 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-lg mb-1">New Project</h3>
          <p className="text-sm text-muted-foreground">Create a new project and start tracking</p>
        </button>

        <button className="glass-strong rounded-2xl p-6 text-left hover:shadow-glow transition-all duration-300 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-lg mb-1">Log Time</h3>
          <p className="text-sm text-muted-foreground">Track your working hours</p>
        </button>

        <button className="glass-strong rounded-2xl p-6 text-left hover:shadow-glow transition-all duration-300 group">
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
