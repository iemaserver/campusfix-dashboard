import { useEffect, useState } from 'react';
import { getComplaints, updateComplaintStatus } from '@/services/api';
import StatusBadge from '@/components/StatusBadge';
import { CheckCircle, Play, Upload, ThumbsUp, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const ClerkTasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    getComplaints().then(data => {
      setTasks(data.filter((c: any) => c.assignedTo));
    });
  }, []);

  const handleAction = async (id: string, status: string, label: string) => {
    await updateComplaintStatus(id, status);
    toast.success(label);
    setTasks(prev => prev.map(t => t._id === id ? { ...t, status } : t));
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Tasks</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your assigned complaints</p>
      </div>

      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task._id} className="bg-card rounded-2xl shadow-card border border-border/50 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-foreground">{task.category}</h3>
                  <StatusBadge status={task.status} />
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {task.location.building}, {task.location.floor}, {task.location.room}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {task.status === 'Assigned' && (
                  <button
                    onClick={() => handleAction(task._id, 'In Progress', 'Task accepted & marked in progress')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-status-progress/10 text-status-progress text-xs font-semibold hover:bg-status-progress/20 transition-colors"
                  >
                    <Play className="h-3.5 w-3.5" /> Accept
                  </button>
                )}
                {task.status === 'In Progress' && (
                  <>
                    <button
                      onClick={() => handleAction(task._id, 'Completed', 'Task marked as completed')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-status-completed/10 text-status-completed text-xs font-semibold hover:bg-status-completed/20 transition-colors"
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> Complete
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-input text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors">
                      <Upload className="h-3.5 w-3.5" /> Upload Proof
                    </button>
                  </>
                )}
                {task.status === 'Completed' && (
                  <span className="flex items-center gap-1.5 text-xs text-status-completed font-semibold">
                    <ThumbsUp className="h-3.5 w-3.5" /> Done
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium">No tasks assigned</p>
            <p className="text-sm mt-1">You'll see tasks here once the admin assigns complaints to you</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClerkTasks;
