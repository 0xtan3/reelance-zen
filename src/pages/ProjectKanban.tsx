import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProjects, Task } from "@/contexts/ProjectContext";
import { NewTaskDialog } from "@/components/NewTaskDialog";

const columns = [
  { id: "todo", title: "To Do", color: "from-slate-500 to-gray-500" },
  { id: "inprogress", title: "In Progress", color: "from-blue-500 to-cyan-500" },
  { id: "review", title: "Review", color: "from-purple-500 to-pink-500" },
  { id: "done", title: "Done", color: "from-emerald-500 to-teal-500" },
];

export default function ProjectKanban() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, tasks } = useProjects();
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Task["status"]>("todo");

  const project = projects.find(p => p.id === projectId);
  const projectTasks = tasks.filter(t => t.projectId === projectId);

  if (!project) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Button onClick={() => navigate("/projects")}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <NewTaskDialog 
        open={newTaskOpen} 
        onOpenChange={setNewTaskOpen} 
        projectId={projectId!}
        defaultStatus={selectedStatus}
      />
      <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate("/projects")}
          className="mb-4 hover:bg-secondary/50"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Projects
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
            <p className="text-muted-foreground">{project.client} - Kanban Board</p>
          </div>
          <Button 
            onClick={() => {
              setSelectedStatus("todo");
              setNewTaskOpen(true);
            }}
            className="gradient-primary shadow-glow hover:shadow-glow hover:scale-105 transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="glass-strong rounded-2xl p-6">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Progress</p>
            <p className="text-2xl font-bold">
              {project.estimatedHours > 0
                ? Math.round((project.actualHours / project.estimatedHours) * 100)
                : 0}%
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Hours</p>
            <p className="text-2xl font-bold">
              {project.actualHours} / {project.estimatedHours}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Tasks</p>
            <p className="text-2xl font-bold">{projectTasks.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Profit</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ${project.profit.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Kanban Columns */}
      {projectTasks.length === 0 ? (
        <div className="glass-strong rounded-2xl p-12 text-center">
          <h3 className="text-2xl font-bold mb-2">No Tasks Yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first task to get started with this project
          </p>
          <Button 
            onClick={() => {
              setSelectedStatus("todo");
              setNewTaskOpen(true);
            }}
            className="gradient-primary shadow-glow"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create First Task
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {columns.map((column, colIndex) => (
            <div
              key={column.id}
              className="space-y-4 animate-in slide-in-from-top"
              style={{ animationDelay: `${colIndex * 100}ms` }}
            >
              {/* Column Header */}
              <div className="glass-strong rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">{column.title}</h3>
                  <span className="text-sm px-2 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
                    {projectTasks.filter((t) => t.status === column.id).length}
                  </span>
                </div>
                <div className={`h-1 rounded-full bg-gradient-to-r ${column.color}`} />
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                {projectTasks
                  .filter((task) => task.status === column.id)
                  .map((task, taskIndex) => (
                    <Card
                      key={task.id}
                      className="glass-strong p-4 hover:shadow-glow transition-all duration-300 cursor-grab active:cursor-grabbing group animate-in zoom-in"
                      style={{ animationDelay: `${taskIndex * 50}ms` }}
                    >
                      {/* Task Header */}
                      <div className="mb-3">
                        <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                          {task.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {task.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Task Footer */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span>⏱️ {task.actualHours}h / {task.estimatedHours}h</span>
                        </div>
                        <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>

                      {/* Progress Bar */}
                      {task.actualHours > 0 && (
                        <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${column.color} rounded-full transition-all duration-500`}
                            style={{
                              width: `${Math.min((task.actualHours / task.estimatedHours) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      )}
                    </Card>
                  ))}

                {/* Add Task Button */}
                <button 
                  onClick={() => {
                    setSelectedStatus(column.id as Task["status"]);
                    setNewTaskOpen(true);
                  }}
                  className="w-full glass rounded-xl p-4 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </>
  );
}
