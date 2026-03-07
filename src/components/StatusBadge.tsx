import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  'Submitted': { bg: 'bg-status-submitted/15', text: 'text-status-submitted', dot: 'bg-status-submitted' },
  'Assigned': { bg: 'bg-status-assigned/15', text: 'text-status-assigned', dot: 'bg-status-assigned' },
  'In Progress': { bg: 'bg-status-progress/15', text: 'text-status-progress', dot: 'bg-status-progress' },
  'Completed': { bg: 'bg-status-completed/15', text: 'text-status-completed', dot: 'bg-status-completed' },
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig['Submitted'];

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold', config.bg, config.text, className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {status}
    </span>
  );
};

export default StatusBadge;
