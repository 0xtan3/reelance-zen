import { DollarSign, TrendingUp, TrendingDown, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const financialStats = [
  {
    label: "Total Revenue",
    value: "$18,750",
    change: "+12.5%",
    trend: "up",
    color: "from-emerald-500 to-teal-500",
  },
  {
    label: "Total Expenses",
    value: "$6,300",
    change: "-3.2%",
    trend: "down",
    color: "from-red-500 to-orange-500",
  },
  {
    label: "Net Profit",
    value: "$12,450",
    change: "+18.7%",
    trend: "up",
    color: "from-blue-500 to-cyan-500",
  },
  {
    label: "Profit Margin",
    value: "66.4%",
    change: "+4.1%",
    trend: "up",
    color: "from-purple-500 to-pink-500",
  },
];

const recentTransactions = [
  {
    id: 1,
    type: "income",
    description: "E-commerce Redesign - Milestone 3",
    amount: 3200,
    date: "2025-04-10",
    project: "E-commerce Redesign",
  },
  {
    id: 2,
    type: "expense",
    description: "Adobe Creative Cloud Subscription",
    amount: -52.99,
    date: "2025-04-09",
    project: null,
  },
  {
    id: 3,
    type: "income",
    description: "Mobile App Development - Initial Payment",
    amount: 5800,
    date: "2025-04-08",
    project: "Mobile App Development",
  },
  {
    id: 4,
    type: "expense",
    description: "Figma Pro Subscription",
    amount: -12,
    date: "2025-04-07",
    project: null,
  },
  {
    id: 5,
    type: "income",
    description: "Brand Identity Package - Final Payment",
    amount: 2100,
    date: "2025-04-05",
    project: "Brand Identity Package",
  },
];

const projectFinances = [
  {
    project: "E-commerce Redesign",
    revenue: 4000,
    costs: 800,
    profit: 3200,
    margin: 80,
  },
  {
    project: "Mobile App Development",
    revenue: 6000,
    costs: 200,
    profit: 5800,
    margin: 96.7,
  },
  {
    project: "Brand Identity Package",
    revenue: 2000,
    costs: -100,
    profit: 2100,
    margin: 105,
  },
];

export default function Finances() {
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
          <h2 className="text-2xl font-bold mb-6">Recent Transactions</h2>
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="glass rounded-xl p-4 hover:shadow-glass-md transition-all duration-300 animate-in slide-in-from-left"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium mb-1">{transaction.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </span>
                      {transaction.project && (
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {transaction.project}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
                        transaction.type === "income"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : ""}$
                      {Math.abs(transaction.amount).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Finances */}
        <div className="glass-strong rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6">Project Breakdown</h2>
          <div className="space-y-4">
            {projectFinances.map((project, index) => (
              <div
                key={project.project}
                className="glass rounded-xl p-4 animate-in slide-in-from-right"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{project.project}</h3>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    ${project.profit.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="font-medium">${project.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Costs</p>
                    <p className="font-medium">${Math.abs(project.costs).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Margin</p>
                    <p className="font-medium">{project.margin.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-primary rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(project.margin, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
