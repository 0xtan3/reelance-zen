import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTeamStore, UserRole } from "@/stores/teamStore";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { UserPlus, Trash2, Shield } from "lucide-react";

export function TeamManagement() {
  const { user } = useAuthStore();
  const { members, userRole, loading, fetchMembers, inviteMember, updateMemberRole, removeMember } = useTeamStore();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("member");

  useEffect(() => {
    const teamId = localStorage.getItem('currentTeamId');
    if (teamId) {
      fetchMembers(teamId);
    }
  }, [fetchMembers]);

  const handleInvite = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      await inviteMember(email, role);
      toast.success("Invitation sent successfully");
      setEmail("");
      setRole("member");
    } catch (error) {
      toast.error("Failed to send invitation");
      console.error(error);
    }
  };

  const handleRoleUpdate = async (memberId: string, newRole: UserRole) => {
    try {
      await updateMemberRole(memberId, newRole);
      toast.success("Role updated successfully");
    } catch (error) {
      toast.error("Failed to update role");
      console.error(error);
    }
  };

  const handleRemove = async (memberId: string) => {
    try {
      await removeMember(memberId);
      toast.success("Member removed successfully");
    } catch (error) {
      toast.error("Failed to remove member");
      console.error(error);
    }
  };

  const isAdmin = userRole === 'admin';

  return (
    <div className="space-y-6">
      {isAdmin && (
        <Card className="glass-strong p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Invite Team Member
          </h3>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button 
              onClick={handleInvite} 
              disabled={loading}
              className="w-full md:w-auto"
            >
              Send Invitation
            </Button>
          </div>
        </Card>
      )}

      <Card className="glass-strong p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Team Members ({members.length})
        </h3>
        
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.$id}>
                  <TableCell className="font-medium">{member.name || 'Pending'}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    {isAdmin && member.userId !== user?.$id ? (
                      <Select
                        value={member.role}
                        onValueChange={(value) => handleRoleUpdate(member.$id, value as UserRole)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                        {member.role}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      {member.userId !== user?.$id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(member.$id)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {members.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No team members yet. Invite your first team member to get started.
          </div>
        )}
      </Card>
    </div>
  );
}
