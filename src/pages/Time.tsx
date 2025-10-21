import { useState } from "react";
import { Play, Pause, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Time() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  const timeEntries = [
    {
      id: 1,
      project: "E-commerce Redesign",
      task: "Design landing page mockups",
      duration: "2h 30m",
      date: "2025-04-10",
    },
    {
      id: 2,
      project: "Mobile App Development",
      task: "Database schema design",
      duration: "1h 45m",
      date: "2025-04-10",
    },
    {
      id: 3,
      project: "E-commerce Redesign",
      task: "Frontend development",
      duration: "4h 15m",
      date: "2025-04-09",
    },
  ];

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold mb-2">Time Tracker</h1>
        <p className="text-muted-foreground">Track your time across projects and tasks</p>
      </div>

      {/* Timer */}
      <div className="glass-strong rounded-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-64 h-64 rounded-full glass mb-8 relative">
          <div className="absolute inset-0 gradient-primary rounded-full opacity-20 animate-pulse" />
          <div className="relative z-10">
            <Clock className="w-12 h-12 mx-auto mb-4 text-primary" />
            <p className="text-6xl font-bold font-mono">{formatTime(time)}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            size="lg"
            className={`${
              isRunning
                ? "bg-red-500 hover:bg-red-600"
                : "gradient-primary"
            } shadow-glow hover:shadow-glow hover:scale-105 transition-all duration-300`}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="glass"
            onClick={() => setTime(0)}
          >
            Reset
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-4">
          Working on: <span className="font-medium text-foreground">E-commerce Redesign</span>
        </p>
      </div>

      {/* Recent Entries */}
      <div className="glass-strong rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6">Recent Time Entries</h2>
        <div className="space-y-3">
          {timeEntries.map((entry, index) => (
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
      </div>
    </div>
  );
}
