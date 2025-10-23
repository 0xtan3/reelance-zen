import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProjects, Task } from "@/contexts/ProjectContext";
import { NewTaskDialog } from "@/components/NewTaskDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const columns = [
  { id: "todo", title: "To Do", color: "from-slate-500 to-gray-500" },
  { id: "inprogress", title: "In Progress", color: "from-blue-500 to-cyan-500" },
  { id: "review", title: "Review", color: "from-purple-500 to-pink-500" },
  { id: "done", title: "Done", color: "from-emerald-500 to-teal-500" },
];

export default function ProjectKanban() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, tasks, updateTask, deleteTask } = useProjects();
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Task["status"]>("todo");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const project = projects.find(p => p.id === projectId);
  const projectTasks = tasks.filter(t => t.projectId === projectId);

  const handleDragStart = (event: DragStartEvent) => {
    const task = projectTasks.find(t => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as string;
    const newStatus = over.id as Task["status"];
    
    const task = projectTasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      updateTask(taskId, { status: newStatus });
    }

    setActiveTask(null);
  };

  const handleDeleteTask = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      toast.success("Task deleted successfully!");
      setTaskToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

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
        onOpenChange={(open) => {
          setNewTaskOpen(open);
          if (!open) setEditingTask(null);
        }} 
        projectId={projectId!}
        defaultStatus={selectedStatus}
        task={editingTask || undefined}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="glass-strong">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DndContext 
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
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
                  {project.actualHours.toFixed(2)} / {project.estimatedHours.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tasks</p>
                <p className="text-2xl font-bold">{projectTasks.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Profit</p>
                <p className="text-2xl font-bold text-accent">
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
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={projectTasks.filter((t) => t.status === column.id)}
                  onAddTask={() => {
                    setSelectedStatus(column.id as Task["status"]);
                    setEditingTask(null);
                    setNewTaskOpen(true);
                  }}
                  onEditTask={(task) => {
                    setEditingTask(task);
                    setNewTaskOpen(true);
                  }}
                  onDeleteTask={(task) => {
                    setTaskToDelete(task);
                    setDeleteDialogOpen(true);
                  }}
                  colIndex={colIndex}
                />
              ))}
            </div>
          )}
        </div>

        <DragOverlay>
          {activeTask && (
            <TaskCard task={activeTask} isDragging onEdit={() => {}} onDelete={() => {}} />
          )}
        </DragOverlay>
      </DndContext>
    </>
  );
}

// Separate component for droppable column
function KanbanColumn({ 
  column, 
  tasks, 
  onAddTask,
  onEditTask,
  onDeleteTask,
  colIndex 
}: { 
  column: typeof columns[0]; 
  tasks: Task[]; 
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  colIndex: number;
}) {
  return (
    <div
      id={column.id}
      className="space-y-4 animate-in slide-in-from-top"
      style={{ animationDelay: `${colIndex * 100}ms` }}
    >
      {/* Column Header */}
      <div className="glass-strong rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg">{column.title}</h3>
          <span className="text-sm px-2 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
            {tasks.length}
          </span>
        </div>
        <div className={`h-1 rounded-full bg-gradient-to-r ${column.color}`} />
      </div>

      {/* Tasks - Drop zone */}
      <div 
        className="space-y-3 min-h-[200px] rounded-xl border-2 border-dashed border-transparent hover:border-primary/30 transition-colors p-2"
        data-column={column.id}
      >
        {tasks.map((task, taskIndex) => (
          <DraggableTask 
            key={task.id} 
            task={task} 
            taskIndex={taskIndex}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}

        {/* Add Task Button */}
        <button 
          onClick={onAddTask}
          className="w-full glass rounded-xl p-4 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>
    </div>
  );
}

// Draggable task component
function DraggableTask({ 
  task, 
  taskIndex, 
  onEdit, 
  onDelete 
}: { 
  task: Task; 
  taskIndex: number;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const { updateTask } = useProjects();

  return (
    <div
      id={task.id}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", task.id);
        setIsDragging(true);
      }}
      onDragEnd={() => setIsDragging(false)}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDrop={(e) => {
        e.preventDefault();
        const draggedTaskId = e.dataTransfer.getData("text/plain");
        const dropTarget = e.currentTarget.closest('[data-column]');
        if (dropTarget) {
          const newStatus = dropTarget.getAttribute('data-column') as Task["status"];
          updateTask(draggedTaskId, { status: newStatus });
        }
      }}
      className={`transition-opacity ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <TaskCard 
        task={task} 
        isDragging={isDragging}
        onEdit={() => onEdit(task)}
        onDelete={() => onDelete(task)}
      />
    </div>
  );
}

// Task card component
function TaskCard({ 
  task, 
  isDragging = false,
  onEdit,
  onDelete
}: { 
  task: Task; 
  isDragging?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const column = columns.find(c => c.id === task.status);
  
  return (
    <Card
      className={`glass-strong p-4 hover:shadow-glow transition-all duration-300 cursor-grab active:cursor-grabbing group ${
        isDragging ? 'opacity-50 rotate-3 scale-105' : ''
      }`}
    >
      {/* Task Header with Actions */}
      <div className="mb-3">
        <div className="flex items-start justify-between mb-1">
          <h4 className="font-semibold group-hover:text-primary transition-colors flex-1">
            {task.title}
          </h4>
          <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1 hover:bg-secondary rounded transition-colors"
              title="Edit task"
            >
              <Pencil className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 hover:bg-destructive/20 text-destructive rounded transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {task.description}
        </p>
      </div>

      {/* Tags */}
      {task.tags.length > 0 && (
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
      )}

      {/* Task Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>⏱️ {task.actualHours.toFixed(1)} / {task.estimatedHours.toFixed(1)}h</span>
        </div>
        <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>
      </div>

      {/* Progress Bar */}
      {task.actualHours > 0 && column && (
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
  );
}
