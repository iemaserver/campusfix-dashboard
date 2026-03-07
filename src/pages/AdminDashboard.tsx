import { useEffect, useState } from 'react';
import { AlertCircle, Clock, CheckCircle2, Eye, UserPlus, Shield, Lock, Mail } from 'lucide-react';
import DashboardCard from '@/components/DashboardCard';
import StatusBadge from '@/components/StatusBadge';
import { getAdminComplaints, login } from '@/services/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      getAdminComplaints().then(setComplaints);
    }
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      setIsLoggedIn(true);
      toast.success('Admin access granted');
    } catch {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // Admin login gate
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-md animate-slide-up">
          <div className="bg-card rounded-3xl shadow-card-hover border border-border/40 overflow-hidden">
            {/* Header */}
            <div className="gradient-hero p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 border border-white/20">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-xl font-bold font-display text-white">Admin Access</h1>
                <p className="text-sm text-white/60 mt-1">Sign in to manage complaints</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="p-8 space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary text-sm transition-all"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary text-sm transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-primary text-primary-foreground py-3.5 rounded-xl font-bold text-sm shadow-button hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <Lock className="h-4 w-4" />
                {loading ? 'Verifying...' : 'Sign In as Admin'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
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
          onClick={() => setIsLoggedIn(false)}
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
                      <span className="text-lg">{c.category === 'Electricity' ? '⚡' : c.category === 'Water' ? '💧' : c.category === 'Internet' ? '📡' : c.category === 'Furniture' ? '🪑' : c.category === 'Cleanliness' ? '🧹' : '🏗️'}</span>
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
                      <button
                        onClick={() => toast.success(`Clerk assigned to ${c.category} complaint`)}
                        className="p-2.5 rounded-xl text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-all"
                        title="Assign Clerk"
                      >
                        <UserPlus className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
