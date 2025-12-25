import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LucideIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";

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
    <motion.div
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="hover:shadow-2xl transition-all duration-500 border-border/40 bg-card/60 backdrop-blur-md overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-6 px-6">
          <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            {title}
          </CardTitle>
          <div className="flex items-center gap-3">
            {encrypted && (
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-semibold px-2 py-0">
                🔒 Encrypted
              </Badge>
            )}
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="text-3xl font-black text-foreground mb-2">{value}</div>
          <div className="space-y-1">
            {description && (
              <p className="text-sm text-muted-foreground/80 leading-relaxed">{description}</p>
            )}
            {trend && (
              <p className="text-sm font-medium text-primary mt-2 flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-primary" />
                {trend}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

