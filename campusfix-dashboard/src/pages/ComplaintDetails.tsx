import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Tag, Calendar, CheckCircle2, Clock, UserCheck, Loader2, Info, ThumbsUp } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { getComplaintById, upvoteComplaint } from '@/services/api';
import { toast } from 'sonner';

const timelineSteps = [
  { label: 'Submitted', desc: 'Complaint registered', icon: Clock },
  { label: 'Assigned', desc: 'Clerk assigned to resolve', icon: UserCheck },
  { label: 'In Progress', desc: 'Work has started', icon: Loader2 },
  { label: 'Completed', desc: 'Issue resolved', icon: CheckCircle2 },
];

const categoryConfig: Record<string, { emoji: string; gradient: string }> = {
  Electricity: { emoji: '⚡', gradient: 'from-amber-500 to-yellow-500' },
  Water: { emoji: '💧', gradient: 'from-blue-500 to-cyan-500' },
  Internet: { emoji: '📡', gradient: 'from-violet-500 to-purple-500' },
  Furniture: { emoji: '🪑', gradient: 'from-orange-500 to-amber-500' },
  Cleanliness: { emoji: '🧹', gradient: 'from-emerald-500 to-green-500' },
  Infrastructure: { emoji: '🏗️', gradient: 'from-slate-500 to-gray-500' },
};

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<any>(null);
  const [upvotes, setUpvotes] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  useEffect(() => {
    if (id) getComplaintById(id).then((c: any) => {
      setComplaint(c);
      setUpvotes(c.upvotes || 0);
      const voted = JSON.parse(localStorage.getItem('upvoted_complaints') || '[]');
      setHasUpvoted(voted.includes(c._id));
    });
  }, [id]);

  const handleUpvote = async () => {
    if (hasUpvoted || !complaint) return;
    try {
      const res = await upvoteComplaint(complaint._id);
      setUpvotes(res.upvotes);
      setHasUpvoted(true);
      const voted = JSON.parse(localStorage.getItem('upvoted_complaints') || '[]');
      voted.push(complaint._id);
      localStorage.setItem('upvoted_complaints', JSON.stringify(voted));
      toast.success('Upvoted!');
    } catch {
      toast.error('Failed to upvote');
    }
  };

  if (!complaint) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const config = categoryConfig[complaint.category] || categoryConfig['Infrastructure'];
  const statusIndex = timelineSteps.findIndex(s => s.label === complaint.status);

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" /> Back to complaints
      </button>

      <div className="bg-card rounded-3xl shadow-card-hover border border-border/40 overflow-hidden animate-slide-up">
        {/* Hero banner */}
        {complaint.photo ? (
          <div className="relative h-56 overflow-hidden">
            <img src={complaint.photo} alt={complaint.category} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        ) : (
          <div className={`relative h-40 bg-gradient-to-r ${config.gradient} flex items-center justify-center overflow-hidden`}>
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full" />
            <div className="absolute bottom-4 left-8 w-20 h-20 bg-white/5 rounded-full" />
            <span className="text-6xl relative z-10 drop-shadow-lg">{config.emoji}</span>
          </div>
        )}

        <div className="p-6 md:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-display text-foreground">{complaint.category} Issue</h1>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary/60" />{complaint.location.building}, {complaint.location.floor}, {complaint.location.room}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary/60" />{complaint.date}</span>
                <span className="flex items-center gap-1.5"><Tag className="h-4 w-4 text-primary/60" />{complaint.category}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleUpvote}
                disabled={hasUpvoted}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  hasUpvoted
                    ? 'bg-primary/10 text-primary cursor-default'
                    : 'bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground'
                }`}
              >
                <ThumbsUp className={`h-4 w-4 ${hasUpvoted ? 'fill-primary' : ''}`} />
                {complaint.upvotes || 0}
              </button>
              <StatusBadge status={complaint.status} />
            </div>
          </div>

          {/* Description */}
          <div className="bg-muted/30 rounded-2xl p-5 border border-border/30">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold font-display text-foreground">Description</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{complaint.description}</p>
          </div>

          {/* Timeline */}
          <div>
            <h2 className="text-sm font-bold font-display text-foreground mb-6">Status Timeline</h2>
            <div className="space-y-0">
              {timelineSteps.map((step, i) => {
                const isActive = i <= statusIndex;
                const isCurrent = i === statusIndex;
                return (
                  <div key={step.label} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        isActive ? 'gradient-primary text-primary-foreground shadow-button' : 'bg-muted text-muted-foreground'
                      } ${isCurrent ? 'ring-4 ring-secondary/20 scale-110' : ''}`}>
                        <step.icon className="h-4 w-4" />
                      </div>
                      {i < timelineSteps.length - 1 && (
                        <div className={`w-0.5 h-10 transition-colors ${isActive ? 'bg-primary/40' : 'bg-border'}`} />
                      )}
                    </div>
                    <div className="pt-2">
                      <p className={`text-sm font-semibold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
