import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Upload, QrCode } from 'lucide-react';
import { createComplaint } from '@/services/api';
import { toast } from 'sonner';

const categories = ['Electricity', 'Furniture', 'Water', 'Internet', 'Cleanliness', 'Infrastructure'];

const ReportComplaint = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ category: '', building: '', floor: '', room: '', description: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      await createComplaint(fd);
      toast.success('Complaint submitted successfully!');
      navigate('/track');
    } catch {
      toast.error('Failed to submit complaint.');
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Report an Issue</h1>
        <p className="text-sm text-muted-foreground mt-1">Fill in the details below to submit a complaint</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-card border border-border/50 p-6 space-y-5">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Category</label>
          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            required
          >
            <option value="">Select a category</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Building</label>
            <input
              type="text"
              placeholder="e.g. Block A"
              value={form.building}
              onChange={(e) => update('building', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Floor</label>
            <input
              type="text"
              placeholder="e.g. 2nd Floor"
              value={form.floor}
              onChange={(e) => update('floor', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Room</label>
            <input
              type="text"
              placeholder="e.g. 201"
              value={form.room}
              onChange={(e) => update('room', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Description</label>
          <textarea
            rows={4}
            placeholder="Describe the issue in detail..."
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            required
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-input bg-background text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <Upload className="h-4 w-4" />
            Upload Photo
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-input bg-background text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <QrCode className="h-4 w-4" />
            Scan QR
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full gradient-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm shadow-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
};

export default ReportComplaint;
