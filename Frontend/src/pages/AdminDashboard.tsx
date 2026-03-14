import { useEffect, useState } from 'react';
import { AlertCircle, Clock, CheckCircle2, Eye, Shield, RefreshCw } from 'lucide-react';
import DashboardCard from '@/components/DashboardCard';
import StatusBadge from '@/components/StatusBadge';
import { getAdminComplaints, updateComplaintStatus, getRecurringComplaints } from '@/services/api';
import { toast } from 'sonner';
import { useNavigate, Navigate } from 'react-router-dom';

const SESSION_KEY = 'admin_session';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [recurring, setRecurring] = useState<any[]>([]);
  const navigate = useNavigate();

  const isLoggedIn = (() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      const expiry = Number(session);
      if (Date.now() < expiry) return true;
      localStorage.removeItem(SESSION_KEY);
    }
    return false;
  })();

  useEffect(() => {
    if (isLoggedIn) {
      getAdminComplaints().then(setComplaints);
      getRecurringComplaints().then(setRecurring).catch(() => {});
    }
  }, [isLoggedIn]);

  // Redirect to manager login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/manager-login" replace />;
  }

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Submitted').length;
  const resolved = complaints.filter(c => c.status === 'Completed').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <Shield className="h-3 w-3" />
            Admin Panel
          </div>
          <h1 className="text-2xl font-bold font-display text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and assign campus complaints</p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem(SESSION_KEY);
            navigate('/manager-login');
          }}
          className="text-sm text-muted-foreground hover:text-destructive transition-colors font-medium"
        >
          Sign out
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <DashboardCard title="Total Complaints" value={total} icon={AlertCircle} iconBg="bg-primary/10" />
        <DashboardCard title="Pending" value={pending} icon={Clock} iconBg="bg-status-submitted/10" />
        <DashboardCard title="Resolved" value={resolved} icon={CheckCircle2} iconBg="bg-status-completed/10" />
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl shadow-card border border-border/40 overflow-hidden animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                <th className="text-left px-6 py-4 font-bold font-display text-foreground text-xs uppercase tracking-wider">Category</th>
                <th className="text-left px-6 py-4 font-bold font-display text-foreground text-xs uppercase tracking-wider hidden sm:table-cell">Location</th>
                <th className="text-left px-6 py-4 font-bold font-display text-foreground text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 font-bold font-display text-foreground text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-right px-6 py-4 font-bold font-display text-foreground text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c, i) => (
                <tr key={c._id} className="border-b border-border/20 hover:bg-muted/20 transition-colors animate-slide-in-right" style={{ animationDelay: `${300 + i * 60}ms` }}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {c.photo ? (
                        <img src={c.photo} alt={c.category} className="w-9 h-9 rounded-lg object-cover border border-border/40" />
                      ) : (
                        <span className="text-lg">{c.category === 'Electricity' ? '⚡' : c.category === 'Water' ? '💧' : c.category === 'Internet' ? '📡' : c.category === 'Furniture' ? '🪑' : c.category === 'Cleanliness' ? '🧹' : '🏗️'}</span>
                      )}
                      <span className="font-medium text-foreground">{c.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">{c.location.building}, {c.location.room}</td>
                  <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                  <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">{c.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigate(`/complaints/${c._id}`)}
                        className="p-2.5 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <select
                        value={c.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            await updateComplaintStatus(c._id, newStatus);
                            setComplaints(prev => prev.map(x => x._id === c._id ? { ...x, status: newStatus } : x));
                            toast.success(`Status updated to ${newStatus}`);
                          } catch {
                            toast.error('Failed to update status');
                          }
                        }}
                        className="text-xs font-medium rounded-xl border border-border/40 bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 cursor-pointer"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recurring Complaints */}
      {recurring.length > 0 && (
        <div className="bg-card rounded-2xl shadow-card border border-border/40 overflow-hidden animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-destructive" />
            <h2 className="text-sm font-bold font-display text-foreground uppercase tracking-wider">Recurring Issues</h2>
            <span className="ml-auto text-xs text-muted-foreground">{recurring.length} patterns detected</span>
          </div>
          <div className="divide-y divide-border/20">
            {recurring.map((r, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-foreground">{r._id.category} — {r._id.building}, Room {r._id.room}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Reported {r.count} times</p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-destructive/10 text-destructive">Recurring</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
