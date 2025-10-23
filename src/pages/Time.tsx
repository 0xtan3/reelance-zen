import { useState, useEffect, useMemo } from "react";
import { Play, Pause, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useProjects } from "@/contexts/ProjectContext";
import { toast } from "sonner";

export default function Time() {
  const { projects, tasks, updateTask } = useProjects();
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  const selectedTask = useMemo(() => 
    tasks.find(t => t.id === selectedTaskId),
    [tasks, selectedTaskId]
  );

  const selectedProject = useMemo(() => 
    selectedTask ? projects.find(p => p.id === selectedTask.projectId) : null,
    [selectedTask, projects]
  );

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const handleSaveTime = () => {
    if (!selectedTask) {
      toast.error("Please select a task first");
      return;
    }

    if (time === 0) {
      toast.error("No time to log");
      return;
    }

    const hoursToAdd = time / 3600;
    const today = new Date().toISOString().split("T")[0];
    
    // Update work logs
    const existingLogs = selectedTask.workLogs || [];
    const todayLog = existingLogs.find(log => log.date === today);
    
    const updatedLogs = todayLog
      ? existingLogs.map(log => 
          log.date === today 
            ? { ...log, hours: log.hours + hoursToAdd }
            : log
        )
      : [...existingLogs, { date: today, hours: hoursToAdd }];
    
    updateTask(selectedTask.id, {
      actualHours: selectedTask.actualHours + hoursToAdd,
      workLogs: updatedLogs,
    });

    toast.success(`Logged ${formatTime(time)} to ${selectedTask.title}`);
    setTime(0);
    setIsRunning(false);
  };

  const recentEntries = useMemo(() => {
    return tasks
      .filter(t => t.actualHours > 0)
      .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
      .slice(0, 10)
      .map(task => {
        const project = projects.find(p => p.id === task.projectId);
        return {
          id: task.id,
          task: task.title,
          project: project?.name || "Unknown",
          duration: `${task.actualHours.toFixed(2)}h`,
          date: task.dueDate,
        };
      });
  }, [tasks, projects]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold mb-2">Time Tracker</h1>
        <p className="text-muted-foreground">Track your time across projects and tasks</p>
      </div>

      {/* Task Selection */}
      <div className="glass-strong rounded-2xl p-6">
        <Label htmlFor="task-select" className="text-base mb-3 block">Select Task to Track</Label>
        <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
          <SelectTrigger id="task-select" className="glass">
            <SelectValue placeholder="Choose a task..." />
          </SelectTrigger>
          <SelectContent>
            {tasks.length === 0 ? (
              <SelectItem value="none" disabled>No tasks available</SelectItem>
            ) : (
              tasks.map(task => {
                const project = projects.find(p => p.id === task.projectId);
                return (
                  <SelectItem key={task.id} value={task.id}>
                    {task.title} ({project?.name})
                  </SelectItem>
                );
              })
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Timer */}
      <div className="glass-strong rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Current Session</p>
              <p className="text-xs text-muted-foreground">
                {selectedProject?.name || "No task selected"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-5xl font-bold font-mono tracking-tight">{formatTime(time)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="lg"
            className={`flex-1 ${
              isRunning
                ? "bg-destructive hover:bg-destructive/90"
                : "gradient-primary"
            } transition-all duration-300`}
            onClick={() => {
              if (!selectedTaskId && !isRunning) {
                toast.error("Please select a task first");
                return;
              }
              setIsRunning(!isRunning);
            }}
            disabled={!selectedTaskId && !isRunning}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause Timer
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start Timer
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleSaveTime}
            disabled={time === 0}
          >
            Save Time
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setTime(0)}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="glass-strong rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6">Recent Time Entries</h2>
        {recentEntries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No time entries yet. Start tracking time to see your history.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentEntries.map((entry, index) => (
              <Card
                key={entry.id}
                className="glass p-4 hover:shadow-glass-md transition-all duration-300 animate-in slide-in-from-bottom"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold mb-1">{entry.task}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {entry.project}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{entry.duration}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
