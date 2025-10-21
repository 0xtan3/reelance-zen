import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProjectProvider } from "./contexts/ProjectContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectKanban from "./pages/ProjectKanban";
import Finances from "./pages/Finances";
import Time from "./pages/Time";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ProjectProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/projects" element={<Layout><Projects /></Layout>} />
            <Route path="/projects/:projectId/kanban" element={<Layout><ProjectKanban /></Layout>} />
            <Route path="/finances" element={<Layout><Finances /></Layout>} />
            <Route path="/time" element={<Layout><Time /></Layout>} />
            <Route path="/settings" element={<Layout><Settings /></Layout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ProjectProvider>
  </QueryClientProvider>
);

export default App;
