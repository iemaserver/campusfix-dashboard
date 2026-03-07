import { useEffect, useState } from 'react';
import { AlertCircle, Clock, CheckCircle2, Eye, UserPlus } from 'lucide-react';
import DashboardCard from '@/components/DashboardCard';
import StatusBadge from '@/components/StatusBadge';
import { getAdminComplaints } from '@/services/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAdminComplaints().then(setComplaints);
  }, []);

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Submitted').length;
  const resolved = complaints.filter(c => c.status === 'Completed').length;

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage and assign complaints</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DashboardCard title="Total Complaints" value={total} icon={AlertCircle} iconBg="bg-primary/10" />
        <DashboardCard title="Pending" value={pending} icon={Clock} iconBg="bg-status-submitted/10" />
        <DashboardCard title="Resolved" value={resolved} icon={CheckCircle2} iconBg="bg-status-completed/10" />
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-6 py-4 font-semibold text-foreground">Category</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground hidden sm:table-cell">Location</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground hidden md:table-cell">Date</th>
                <th className="text-right px-6 py-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c._id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{c.category}</td>
                  <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">{c.location.building}, {c.location.room}</td>
                  <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                  <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">{c.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/complaints/${c._id}`)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toast.success(`Clerk assigned to ${c.category} complaint`)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-colors"
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
