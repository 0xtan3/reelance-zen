import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Calendar, Clock, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/contexts/ProjectContext";
import { NewProjectDialog } from "@/components/NewProjectDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function Projects() {
  const navigate = useNavigate();
  const { projects, deleteProject } = useProjects();
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete);
      toast.success("Project deleted successfully");
      setProjectToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <NewProjectDialog open={newProjectOpen} onOpenChange={setNewProjectOpen} />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
              All tasks and data associated with this project will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Projects</h1>
            <p className="text-muted-foreground">Manage all your projects in one place</p>
          </div>
          <Button 
            onClick={() => setNewProjectOpen(true)}
            className="gradient-primary shadow-glow hover:shadow-glow hover:scale-105 transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </Button>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="glass-strong rounded-2xl p-12 text-center">
            <h3 className="text-2xl font-bold mb-2">No Projects Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first project to start tracking tasks, time, and profit
            </p>
            <Button 
              onClick={() => setNewProjectOpen(true)}
              className="gradient-primary shadow-glow"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create First Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project, index) => {
              const progress = project.estimatedHours > 0
                ? Math.round((project.actualHours / project.estimatedHours) * 100)
                : 0;

              return (
                <Card
                  key={project.id}
                  className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer animate-in fade-in slide-in-from-bottom"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => navigate(`/projects/${project.id}/kanban`)}
                >
                  {/* Header with gradient */}
                  <div className={`h-24 bg-gradient-to-br ${project.color} relative`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDeleteClick(e, project.id)}
                      className="absolute top-2 right-2 h-8 w-8 bg-background/80 hover:bg-destructive hover:text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="absolute -bottom-8 left-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${project.color} shadow-xl flex items-center justify-center border-4 border-background`}>
                        <span className="text-white font-bold text-2xl">
                          {project.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="pt-12 pb-6 px-6 space-y-4">
                    {/* Title and Client */}
                    <div>
                      <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors line-clamp-1">
                        {project.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{project.client}</p>
                    </div>

                    {/* Tags and Status */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {project.status}
                      </Badge>
                      {project.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.tags.length - 2}
                        </Badge>
                      )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Hours</p>
                          <p className="text-sm font-semibold">{project.actualHours.toFixed(0)}h</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Cost</p>
                          <p className="text-sm font-semibold">${(project.actualCost / 1000).toFixed(1)}k</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <p className="text-xs text-muted-foreground">Profit</p>
                          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            ${(project.profit / 1000).toFixed(1)}k
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Progress</p>
                          <p className="text-sm font-semibold">{progress}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-2">
                      <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${project.color} transition-all duration-1000`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
