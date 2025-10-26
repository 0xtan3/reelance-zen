import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectSupport } from "@/contexts/ProjectContext";
import { Calendar, Shield, Server, HardDrive } from "lucide-react";

interface ProjectSupportCardProps {
  support?: ProjectSupport;
}

export function ProjectSupportCard({ support }: ProjectSupportCardProps) {
  if (!support) {
    return (
      <Card className="glass p-6">
        <p className="text-sm text-muted-foreground">No support plan configured</p>
      </Card>
    );
  }

  const isMaintenanceActive = new Date(support.maintenanceEndDate) > new Date();
  const isHostingActive = new Date(support.hostingEndDate) > new Date();

  return (
    <Card className="glass p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Support & Maintenance
        </h3>
        <Badge variant={isMaintenanceActive ? "default" : "secondary"}>
          {isMaintenanceActive ? "Active" : "Expired"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Maintenance Period
          </p>
          <p className="text-sm font-medium">{support.maintenanceMonths} Months</p>
          <p className="text-xs text-muted-foreground">
            Until {new Date(support.maintenanceEndDate).toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Server className="w-3 h-3" />
            Hosting Period
          </p>
          <p className="text-sm font-medium">{support.hostingYears} Year(s)</p>
          <p className="text-xs text-muted-foreground">
            Until {new Date(support.hostingEndDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex gap-2 pt-2 border-t">
        {support.sslIncluded && (
          <Badge variant="outline" className="text-xs">
            <Shield className="w-3 h-3 mr-1" />
            SSL Included
          </Badge>
        )}
        {support.backupsEnabled && (
          <Badge variant="outline" className="text-xs">
            <HardDrive className="w-3 h-3 mr-1" />
            Backups Enabled
          </Badge>
        )}
        {isHostingActive && (
          <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
            Hosting Active
          </Badge>
        )}
      </div>
    </Card>
  );
}
