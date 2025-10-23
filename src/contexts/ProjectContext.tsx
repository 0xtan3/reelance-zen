import { createContext, useContext, useState, ReactNode } from "react";

export interface Project {
  id: string;
  name: string;
  client: string;
  estimatedHours: number;
  actualHours: number;
  estimatedCost: number;
  actualCost: number;
  profit: number;
  tags: string[];
  status: string;
  color: string;
  notes?: string;
}

export interface WorkLog {
  date: string;
  hours: number;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: "todo" | "inprogress" | "review" | "done";
  estimatedHours: number;
  actualHours: number;
  dueDate: string;
  tags: string[];
  workLogs: WorkLog[];
}

export interface Expense {
  id: string;
  projectId: string | null;
  description: string;
  amount: number;
  date: string;
}

interface ProjectContextType {
  projects: Project[];
  tasks: Task[];
  expenses: Expense[];
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  // Load initial state from localStorage
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('projectflow-projects');
    return saved ? JSON.parse(saved) : [];
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('projectflow-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('projectflow-expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const addProject = (project: Omit<Project, "id">) => {
    const newProject = {
      ...project,
      id: Date.now().toString(),
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('projectflow-projects', JSON.stringify(updatedProjects));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map(p => p.id === id ? { ...p, ...updates } : p);
    setProjects(updatedProjects);
    localStorage.setItem('projectflow-projects', JSON.stringify(updatedProjects));
  };

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    const updatedTasks = tasks.filter(t => t.projectId !== id);
    setProjects(updatedProjects);
    setTasks(updatedTasks);
    localStorage.setItem('projectflow-projects', JSON.stringify(updatedProjects));
    localStorage.setItem('projectflow-tasks', JSON.stringify(updatedTasks));
  };

  const addTask = (task: Omit<Task, "id">) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      workLogs: task.workLogs || [],
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('projectflow-tasks', JSON.stringify(updatedTasks));
    
    // Update project actual hours
    const project = projects.find(p => p.id === task.projectId);
    if (project) {
      updateProject(project.id, {
        actualHours: project.actualHours + task.actualHours,
      });
    }
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const oldTask = tasks.find(t => t.id === id);
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, ...updates } : t);
    setTasks(updatedTasks);
    localStorage.setItem('projectflow-tasks', JSON.stringify(updatedTasks));
    
    // Update project hours if actualHours changed
    if (oldTask && updates.actualHours !== undefined) {
      const project = projects.find(p => p.id === oldTask.projectId);
      if (project) {
        const hoursDiff = updates.actualHours - oldTask.actualHours;
        updateProject(project.id, {
          actualHours: project.actualHours + hoursDiff,
        });
      }
    }
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem('projectflow-tasks', JSON.stringify(updatedTasks));
  };

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
    };
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    localStorage.setItem('projectflow-expenses', JSON.stringify(updatedExpenses));
    
    // Update project costs if expense is linked to a project
    if (expense.projectId) {
      const project = projects.find(p => p.id === expense.projectId);
      if (project) {
        updateProject(project.id, {
          actualCost: project.actualCost + Math.abs(expense.amount),
        });
      }
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        tasks,
        expenses,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        addExpense,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within ProjectProvider");
  }
  return context;
}
