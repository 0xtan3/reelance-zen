import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProjects } from "@/contexts/ProjectContext";
import { toast } from "sonner";

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewProjectDialog({ open, onOpenChange }: NewProjectDialogProps) {
  const { addProject } = useProjects();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    estimatedHours: "",
    estimatedCost: "",
    tags: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.client) {
      toast.error("Please fill in all required fields");
      return;
    }

    const estimatedHours = parseFloat(formData.estimatedHours) || 0;
    const estimatedCost = parseFloat(formData.estimatedCost) || 0;

    addProject({
      name: formData.name,
      client: formData.client,
      estimatedHours,
      actualHours: 0,
      estimatedCost,
      actualCost: 0,
      profit: estimatedCost,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
      status: "Active",
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      notes: formData.notes,
      createdBy: user?.$id || 'anonymous',
      teamId: localStorage.getItem('currentTeamId') || undefined,
    });

    toast.success("Project created successfully!");
    onOpenChange(false);
    setFormData({
      name: "",
      client: "",
      estimatedHours: "",
      estimatedCost: "",
      tags: "",
      notes: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="E-commerce Website"
                className="glass"
              />
            </div>
            <div>
              <Label htmlFor="client">Client *</Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="Acme Corp"
                className="glass"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimatedHours">Estimated Hours</Label>
              <Input
                id="estimatedHours"
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                placeholder="40"
                className="glass"
              />
            </div>
            <div>
              <Label htmlFor="estimatedCost">Estimated Revenue ($)</Label>
              <Input
                id="estimatedCost"
                type="number"
                value={formData.estimatedCost}
                onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                placeholder="5000"
                className="glass"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="web, design, frontend"
              className="glass"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Project details and requirements..."
              className="glass min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary">
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
