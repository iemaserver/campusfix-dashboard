import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  className?: string;
  iconBg?: string;
  delay?: number;
}

const DashboardCard = ({ title, value, icon: Icon, trend, className, iconBg, delay = 0 }: DashboardCardProps) => {
  return (
    <div
      className={cn(
        'group relative bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-500 border border-border/40 overflow-hidden',
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Decorative gradient blob */}
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500 gradient-primary" />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">{title}</p>
          <p className="text-4xl font-bold font-display text-card-foreground tracking-tight">{value}</p>
          <p className="text-xs text-status-completed font-semibold flex items-center gap-1 min-h-[1rem]">
            {trend && (
              <>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-status-completed" />
                {trend}
              </>
            )}
          </p>
        </div>
        <div className={cn(
          'p-3.5 rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3',
          iconBg || 'bg-primary/10'
        )}>
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
