import { Card } from "@/components/ui/card";

export default function Settings() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Card className="glass-strong p-6">
        <p className="text-muted-foreground text-center py-12">
          Settings page coming soon...
        </p>
      </Card>
    </div>
  );
}
