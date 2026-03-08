import { useEffect, useState } from 'react';
import { getComplaints, updateComplaintStatus } from '@/services/api';
import StatusBadge from '@/components/StatusBadge';
import { CheckCircle, Play, Upload, ThumbsUp, MapPin, Wrench } from 'lucide-react';
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
    <div>
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-status-progress/10 text-status-progress text-xs font-semibold mb-3">
          <Wrench className="h-3 w-3" />
          Clerk Panel
        </div>
        <h1 className="text-2xl font-bold font-display text-foreground">My Tasks</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your assigned maintenance tasks</p>
      </div>

      <div className="space-y-4">
        {tasks.map((task, i) => (
          <div
            key={task._id}
            className="bg-card rounded-2xl shadow-card hover:shadow-card-hover border border-border/40 overflow-hidden transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${100 + i * 80}ms` }}
          >
            {/* Status stripe */}
            <div className={`h-1 ${
              task.status === 'Assigned' ? 'bg-status-assigned' :
              task.status === 'In Progress' ? 'bg-status-progress' :
              'bg-status-completed'
            }`} />
            
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{task.category === 'Electricity' ? '⚡' : task.category === 'Water' ? '💧' : task.category === 'Internet' ? '📡' : task.category === 'Furniture' ? '🪑' : task.category === 'Cleanliness' ? '🧹' : '🏗️'}</span>
                    <h3 className="font-semibold font-display text-foreground">{task.category}</h3>
                    <StatusBadge status={task.status} />
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-3.5 w-3.5 text-primary/50" />
                    {task.location.building}, {task.location.floor}, {task.location.room}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{task.description}</p>
                </div>

                <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                  {task.status === 'Assigned' && (
                    <button
                      onClick={() => handleAction(task._id, 'In Progress', 'Task accepted & marked in progress')}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-status-progress text-white text-xs font-bold hover:opacity-90 transition-all shadow-sm"
                    >
                      <Play className="h-3.5 w-3.5" /> Accept Task
                    </button>
                  )}
                  {task.status === 'In Progress' && (
                    <>
                      <button
                        onClick={() => handleAction(task._id, 'Completed', 'Task marked as completed')}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-status-completed text-white text-xs font-bold hover:opacity-90 transition-all shadow-sm"
                      >
                        <CheckCircle className="h-3.5 w-3.5" /> Complete
                      </button>
                      <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border-2 border-dashed border-border text-xs font-bold text-muted-foreground hover:border-primary/40 hover:text-primary transition-all">
                        <Upload className="h-3.5 w-3.5" /> Upload Proof
                      </button>
                    </>
                  )}
                  {task.status === 'Completed' && (
                    <span className="flex items-center gap-1.5 text-sm text-status-completed font-bold">
                      <ThumbsUp className="h-4 w-4" /> Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Wrench className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold font-display text-foreground">No tasks assigned</p>
            <p className="text-sm text-muted-foreground mt-1">Tasks will appear here once admin assigns complaints to you</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClerkTasks;
