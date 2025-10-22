import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useProjects } from "@/contexts/ProjectContext";

export function WeeklyProgress() {
  const { tasks } = useProjects();

  const weeklyData = useMemo(() => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split("T")[0];
    });

    return last7Days.map(date => {
      const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "short" });
      const hoursWorked = tasks.reduce((sum, task) => {
        const logForDate = task.workLogs?.find(log => log.date === date);
        return sum + (logForDate?.hours || 0);
      }, 0);

      return {
        day: dayName,
        hours: hoursWorked,
      };
    });
  }, [tasks]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={weeklyData}>
        <XAxis
          dataKey="day"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "hsl(var(--foreground))" }}
        />
        <Bar
          dataKey="hours"
          fill="hsl(var(--primary))"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
