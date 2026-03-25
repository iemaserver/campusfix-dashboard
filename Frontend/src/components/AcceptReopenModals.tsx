/**
 * Shared modals used in StudentDashboard, TrackComplaints, and ComplaintDetails.
 */
import { useState } from 'react';
import { X, CheckCircle2, RotateCcw, Loader2, Star } from 'lucide-react';
import { acceptFix, reopenComplaint } from '@/services/api';
import { toast } from 'sonner';

// ── AcceptFeedbackModal ───────────────────────────────────────────────────────
export const AcceptFeedbackModal = ({
  complaint,
  studentName,
  onClose,
  onDone,
}: {
  complaint: any;
  studentName: string;
  onClose: () => void;
  onDone: (id: string) => void;
}) => {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await acceptFix(complaint._id, feedback, studentName, complaint.student_email);
      toast.success('Fix accepted! Complaint closed.');
      onDone(complaint._id);
      onClose();
    } catch {
      toast.error('Failed to accept fix. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card rounded-3xl shadow-card-hover border border-border/40 w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <div>
            <h2 className="text-base font-bold font-display text-foreground">Accept Fix</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{complaint.ticket_number} · {complaint.category}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              You're confirming that the <strong>{complaint.category}</strong> issue at{' '}
              <strong>{complaint.location?.building}, Room {complaint.location?.room}</strong> has been resolved.
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5" /> Feedback on the fix (optional)
            </label>
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              rows={3}
              placeholder="How was the resolution? Was it handled properly?"
              className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary transition-all resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border/40 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 gradient-primary text-primary-foreground py-2.5 rounded-xl font-bold text-sm shadow-button hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Accept & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── ReopenModal ───────────────────────────────────────────────────────────────
export const ReopenModal = ({
  complaint,
  studentName,
  onClose,
  onDone,
}: {
  complaint: any;
  studentName: string;
  onClose: () => void;
  onDone: (id: string) => void;
}) => {
  const [reason, setReason]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for reopening.');
      return;
    }
    setLoading(true);
    try {
      await reopenComplaint(complaint._id, reason, studentName, complaint.student_email);
      toast.success('Complaint reopened. Admin has been notified.');
      onDone(complaint._id);
      onClose();
    } catch {
      toast.error('Failed to reopen. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card rounded-3xl shadow-card-hover border border-border/40 w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <div>
            <h2 className="text-base font-bold font-display text-foreground">Reopen Complaint</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{complaint.ticket_number} · {complaint.category}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
            <RotateCcw className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              The issue will be marked as <strong>Reopened</strong> and the admin will be notified to re-assign it.
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Reason for reopening <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={3}
              placeholder="What is still unresolved? Describe the issue clearly..."
              className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary transition-all resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border/40 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !reason.trim()}
              className="flex-1 bg-amber-500 text-white py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
              Reopen Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
