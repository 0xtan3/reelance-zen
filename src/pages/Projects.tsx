import { Plus, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/contexts/ProjectContext";

export default function Projects() {
  const navigate = useNavigate();
  const { projects } = useProjects();
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
      {projects.length === 0 ? (
        <div className="glass-strong rounded-2xl p-12 text-center">
          <h3 className="text-2xl font-bold mb-2">No Projects Yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first project to start tracking tasks, time, and profit
          </p>
          <Button className="gradient-primary shadow-glow">
            <Plus className="w-5 h-5 mr-2" />
            Create First Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project, index) => {
            const progress = project.estimatedHours > 0
              ? Math.round((project.actualHours / project.estimatedHours) * 100)
              : 0;

            return (
              <Card
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}/kanban`)}
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
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${project.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
