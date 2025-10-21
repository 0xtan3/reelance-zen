import { DollarSign, TrendingUp, TrendingDown, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/contexts/ProjectContext";

export default function Finances() {
  const { projects, expenses } = useProjects();

  const totalRevenue = projects.reduce((sum, p) => sum + p.estimatedCost, 0);
  const totalCosts = projects.reduce((sum, p) => sum + p.actualCost, 0);
  const totalProfit = projects.reduce((sum, p) => sum + p.profit, 0);
  const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : "0";

  const financialStats = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: `${projects.length} projects`,
      trend: "up",
      color: "from-emerald-500 to-teal-500",
    },
    {
      label: "Total Expenses",
      value: `$${totalCosts.toLocaleString()}`,
      change: `${expenses.length} expenses`,
      trend: "down",
      color: "from-red-500 to-orange-500",
    },
    {
      label: "Net Profit",
      value: `$${totalProfit.toLocaleString()}`,
      change: "From all projects",
      trend: "up",
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Profit Margin",
      value: `${profitMargin}%`,
      change: "Average margin",
      trend: "up",
      color: "from-purple-500 to-pink-500",
    },
  ];
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Finances</h1>
          <p className="text-muted-foreground">Track your revenue, expenses, and profitability</p>
        </div>
        <Button className="gradient-primary shadow-glow hover:shadow-glow hover:scale-105 transition-all duration-300">
          <Download className="w-5 h-5 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialStats.map((stat, index) => (
          <Card
            key={stat.label}
            className="glass-strong p-6 hover:shadow-glow transition-all duration-300 animate-in slide-in-from-top"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {stat.trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
              )}
              <span
                className={`text-sm font-medium ${
                  stat.trend === "up"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-muted-foreground">vs last month</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="glass-strong rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6">Recent Expenses</h2>
          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No expenses recorded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.slice(0, 5).map((expense, index) => {
                const project = expense.projectId
                  ? projects.find(p => p.id === expense.projectId)
                  : null;

                return (
                  <div
                    key={expense.id}
                    className="glass rounded-xl p-4 hover:shadow-glass-md transition-all duration-300 animate-in slide-in-from-left"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium mb-1">{expense.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(expense.date).toLocaleDateString()}
                          </span>
                          {project && (
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                              {project.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">
                          -${Math.abs(expense.amount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Project Finances */}
        <div className="glass-strong rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6">Project Breakdown</h2>
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No projects yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project, index) => {
                const margin = project.estimatedCost > 0
                  ? ((project.profit / project.estimatedCost) * 100).toFixed(1)
                  : "0";

                return (
                  <div
                    key={project.id}
                    className="glass rounded-xl p-4 animate-in slide-in-from-right"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{project.name}</h3>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        ${project.profit.toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                        <p className="font-medium">${project.estimatedCost.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Costs</p>
                        <p className="font-medium">${project.actualCost.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Margin</p>
                        <p className="font-medium">{margin}%</p>
                      </div>
                    </div>

                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full gradient-primary rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(Number(margin), 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
