import { Plus, Search, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const projects = [
  {
    id: 1,
    name: "E-commerce Redesign",
    client: "TechCorp Inc.",
    estimatedHours: 80,
    actualHours: 60,
    estimatedCost: 4000,
    actualCost: 3000,
    profit: 3200,
    tags: ["Design", "Frontend"],
    status: "In Progress",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "Mobile App Development",
    client: "StartupXYZ",
    estimatedHours: 120,
    actualHours: 54,
    estimatedCost: 6000,
    actualCost: 2700,
    profit: 5800,
    tags: ["Development", "Mobile"],
    status: "In Progress",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    name: "Brand Identity Package",
    client: "Creative Studio",
    estimatedHours: 40,
    actualHours: 36,
    estimatedCost: 2000,
    actualCost: 1800,
    profit: 2100,
    tags: ["Design", "Branding"],
    status: "Review",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 4,
    name: "API Integration",
    client: "FinTech Solutions",
    estimatedHours: 60,
    actualHours: 15,
    estimatedCost: 3000,
    actualCost: 750,
    profit: 0,
    tags: ["Backend", "API"],
    status: "Planning",
    color: "from-orange-500 to-red-500",
  },
];

export default function Projects() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Projects</h1>
          <p className="text-muted-foreground">Manage and track all your client projects</p>
        </div>
        <Button className="gradient-primary shadow-glow hover:shadow-glow hover:scale-105 transition-all duration-300">
          <Plus className="w-5 h-5 mr-2" />
          New Project
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="glass-strong rounded-2xl p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-10 glass border-border/50 focus:border-primary transition-colors"
            />
          </div>
          <Button variant="outline" className="glass">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <Card
            key={project.id}
            className="glass-strong p-6 hover:shadow-glow transition-all duration-300 cursor-pointer group animate-in slide-in-from-bottom"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <p className="text-sm text-muted-foreground">{project.client}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <span className="text-white font-bold text-lg">
                  {project.name.charAt(0)}
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex gap-2 mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium"
                >
                  {tag}
                </span>
              ))}
              <span className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
                {project.status}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Hours</p>
                <p className="text-sm font-bold">
                  {project.actualHours} / {project.estimatedHours}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Cost</p>
                <p className="text-sm font-bold">
                  ${project.actualCost.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Profit</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  ${project.profit.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {Math.round((project.actualHours / project.estimatedHours) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${project.color} rounded-full transition-all duration-1000`}
                  style={{
                    width: `${Math.min((project.actualHours / project.estimatedHours) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
