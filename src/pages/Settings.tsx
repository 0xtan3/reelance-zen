import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TeamManagement } from "@/components/TeamManagement";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { LogOut } from "lucide-react";

export default function Settings() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [hourlyRate, setHourlyRate] = useState(() => {
    return localStorage.getItem('hourlyRate') || '50';
  });
  const [workingHoursPerWeek, setWorkingHoursPerWeek] = useState(() => {
    return localStorage.getItem('workingHoursPerWeek') || '40';
  });
  const [emailNotifications, setEmailNotifications] = useState(() => {
    return localStorage.getItem('emailNotifications') === 'true';
  });
  const [desktopNotifications, setDesktopNotifications] = useState(() => {
    return localStorage.getItem('desktopNotifications') === 'true';
  });

  const handleSaveRates = () => {
    localStorage.setItem('hourlyRate', hourlyRate);
    localStorage.setItem('workingHoursPerWeek', workingHoursPerWeek);
    toast.success("Rates saved successfully");
  };

  const handleNotificationToggle = (type: 'email' | 'desktop', value: boolean) => {
    if (type === 'email') {
      setEmailNotifications(value);
      localStorage.setItem('emailNotifications', String(value));
    } else {
      setDesktopNotifications(value);
      localStorage.setItem('desktopNotifications', String(value));
    }
    toast.success("Notification preferences updated");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Settings */}
          <Card className="glass-strong p-6">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={user?.name || ''}
                  disabled
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="mt-2"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Profile information is managed through your authentication provider.
              </p>
              <Separator className="my-6" />
              <div>
                <Label>Account Actions</Label>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Sign out from your account
                </p>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    await logout();
                    navigate("/auth");
                    toast.success("Signed out successfully");
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <TeamManagement />
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          {/* Billing & Rates */}
          <Card className="glass-strong p-6">
            <h2 className="text-2xl font-bold mb-4">Billing & Rates</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="hourlyRate">Default Hourly Rate ($)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Used for calculating project costs and profits
                </p>
              </div>
              <div>
                <Label htmlFor="workingHours">Target Working Hours Per Week</Label>
                <Input
                  id="workingHours"
                  type="number"
                  value={workingHoursPerWeek}
                  onChange={(e) => setWorkingHoursPerWeek(e.target.value)}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Your weekly hour target for progress tracking
                </p>
              </div>
              <Button onClick={handleSaveRates} className="gradient-primary">
                Save Rates
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          {/* Notifications */}
          <Card className="glass-strong p-6">
            <h2 className="text-2xl font-bold mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotif">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your projects
                  </p>
                </div>
                <Switch
                  id="emailNotif"
                  checked={emailNotifications}
                  onCheckedChange={(checked) => handleNotificationToggle('email', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="desktopNotif">Desktop Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get browser notifications for important updates
                  </p>
                </div>
                <Switch
                  id="desktopNotif"
                  checked={desktopNotifications}
                  onCheckedChange={(checked) => handleNotificationToggle('desktop', checked)}
                />
              </div>
            </div>
          </Card>

          {/* Workspace Settings */}
          <Card className="glass-strong p-6">
            <h2 className="text-2xl font-bold mb-4">Data & Export</h2>
            <div className="space-y-4">
              <div>
                <Label>Data Storage</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Your data is securely stored and synced via your backend.
                </p>
              </div>
              <Separator />
              <div>
                <Label>Export Data</Label>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Download all your projects, tasks, and financial data
                </p>
                <Button variant="outline">
                  Export Data
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
