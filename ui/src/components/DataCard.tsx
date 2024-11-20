import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LucideIcon } from "lucide-react";
import { Badge } from "./ui/badge";

interface DataCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  encrypted?: boolean;
  description?: string;
}

export const DataCard = ({ title, value, icon: Icon, trend, encrypted = true, description }: DataCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          {encrypted && (
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              🔒 Encrypted
            </Badge>
          )}
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">{trend}</p>
        )}
      </CardContent>
    </Card>
  );
};
