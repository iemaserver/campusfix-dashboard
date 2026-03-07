import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  className?: string;
  iconBg?: string;
}

const DashboardCard = ({ title, value, icon: Icon, trend, className, iconBg }: DashboardCardProps) => {
  return (
    <div className={cn(
      'bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-card-foreground">{value}</p>
          {trend && <p className="text-xs text-status-completed font-medium">{trend}</p>}
        </div>
        <div className={cn('p-3 rounded-xl', iconBg || 'bg-primary/10')}>
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
