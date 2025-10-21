import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const columns = [
  { id: "todo", title: "To Do", color: "from-slate-500 to-gray-500" },
  { id: "inprogress", title: "In Progress", color: "from-blue-500 to-cyan-500" },
  { id: "review", title: "Review", color: "from-purple-500 to-pink-500" },
  { id: "done", title: "Done", color: "from-emerald-500 to-teal-500" },
];

const tasks = [
  {
    id: 1,
    title: "Design landing page mockups",
    description: "Create high-fidelity mockups for the new landing page",
    project: "E-commerce Redesign",
    tags: ["Design", "High Priority"],
    estimatedHours: 8,
    actualHours: 6,
    dueDate: "2025-04-15",
    column: "inprogress",
  },
  {
    id: 2,
    title: "Implement authentication system",
    description: "Set up JWT-based authentication with refresh tokens",
    project: "Mobile App Development",
    tags: ["Backend", "Security"],
    estimatedHours: 12,
    actualHours: 0,
    dueDate: "2025-04-18",
    column: "todo",
  },
  {
    id: 3,
    title: "Code review for payment integration",
    description: "Review and test Stripe payment integration",
    project: "E-commerce Redesign",
    tags: ["Review", "High Priority"],
    estimatedHours: 4,
    actualHours: 4,
    dueDate: "2025-04-12",
    column: "review",
  },
  {
    id: 4,
    title: "Logo variations",
    description: "Create color and size variations of the main logo",
    project: "Brand Identity Package",
    tags: ["Design"],
    estimatedHours: 6,
    actualHours: 6,
    dueDate: "2025-04-10",
    column: "done",
  },
  {
    id: 5,
    title: "Database schema design",
    description: "Design PostgreSQL schema for user data",
    project: "Mobile App Development",
    tags: ["Backend", "Database"],
    estimatedHours: 6,
    actualHours: 2,
    dueDate: "2025-04-16",
    column: "inprogress",
  },
];

export default function Kanban() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Kanban Board</h1>
          <p className="text-muted-foreground">Visualize and manage your tasks across projects</p>
        </div>
        <Button className="gradient-primary shadow-glow hover:shadow-glow hover:scale-105 transition-all duration-300">
          <Plus className="w-5 h-5 mr-2" />
          New Task
        </Button>
      </div>

      {/* Kanban Columns */}
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
                  {tasks.filter((t) => t.column === column.id).length}
                </span>
              </div>
              <div className={`h-1 rounded-full bg-gradient-to-r ${column.color}`} />
            </div>

            {/* Tasks */}
            <div className="space-y-3">
              {tasks
                .filter((task) => task.column === column.id)
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

                    {/* Project Badge */}
                    <div className="mb-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        {task.project}
                      </span>
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
              <button className="w-full glass rounded-xl p-4 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-300 flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
