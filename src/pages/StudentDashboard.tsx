import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileWarning, ListChecks, History, AlertCircle, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import DashboardCard from '@/components/DashboardCard';
import { getDashboardStats } from '@/services/api';

const StudentDashboard = () => {
  const [stats, setStats] = useState({ totalComplaints: 0, pendingIssues: 0, resolvedIssues: 0, inProgress: 0 });

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  const quickActions = [
    { title: 'Report Issue', desc: 'Submit a new complaint', icon: FileWarning, path: '/report', color: 'bg-destructive/10' },
    { title: 'Track Complaints', desc: 'View complaint status', icon: ListChecks, path: '/track', color: 'bg-secondary/10' },
    { title: 'Complaint History', desc: 'View past complaints', icon: History, path: '/track', color: 'bg-status-completed/10' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome, Student 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's an overview of your complaint activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Complaints" value={stats.totalComplaints} icon={AlertCircle} iconBg="bg-primary/10" />
        <DashboardCard title="Pending Issues" value={stats.pendingIssues} icon={Clock} iconBg="bg-status-submitted/10" />
        <DashboardCard title="In Progress" value={stats.inProgress} icon={TrendingUp} iconBg="bg-status-progress/10" />
        <DashboardCard title="Resolved Issues" value={stats.resolvedIssues} icon={CheckCircle2} iconBg="bg-status-completed/10" />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.path}
              className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 group"
            >
              <div className={`p-3 rounded-xl w-fit ${action.color} mb-4`}>
                <action.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">{action.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
