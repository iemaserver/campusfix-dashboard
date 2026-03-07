import { MapPin, Calendar, ChevronRight, ThumbsUp } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useNavigate } from 'react-router-dom';
import { upvoteComplaint } from '@/services/api';
import { useState } from 'react';
import { toast } from 'sonner';

interface ComplaintCardProps {
  complaint: {
    _id: string;
    category: string;
    location: { building: string; floor: string; room: string };
    status: string;
    date: string;
    description: string;
    photo?: string | null;
    upvotes?: number;
  };
}

const categoryConfig: Record<string, { emoji: string; gradient: string }> = {
  Electricity: { emoji: '⚡', gradient: 'from-amber-500/20 to-yellow-500/10' },
  Furniture: { emoji: '🪑', gradient: 'from-orange-500/20 to-amber-500/10' },
  Water: { emoji: '💧', gradient: 'from-blue-500/20 to-cyan-500/10' },
  Internet: { emoji: '📡', gradient: 'from-violet-500/20 to-purple-500/10' },
  Cleanliness: { emoji: '🧹', gradient: 'from-emerald-500/20 to-green-500/10' },
  Infrastructure: { emoji: '🏗️', gradient: 'from-slate-500/20 to-gray-500/10' },
};

const ComplaintCard = ({ complaint }: ComplaintCardProps) => {
  const navigate = useNavigate();
  const config = categoryConfig[complaint.category] || categoryConfig['Infrastructure'];
  const [upvotes, setUpvotes] = useState(complaint.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(() => {
    const voted = JSON.parse(localStorage.getItem('upvoted_complaints') || '[]');
    return voted.includes(complaint._id);
  });

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasUpvoted) return;
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

  return (
    <div
      onClick={() => navigate(`/complaints/${complaint._id}`)}
      className="group relative bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-500 border border-border/40 cursor-pointer overflow-hidden hover:-translate-y-1"
    >
      {/* Photo or category gradient header */}
      {complaint.photo ? (
        <div className="h-36 overflow-hidden">
          <img src={complaint.photo} alt={complaint.category} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className={`h-2 bg-gradient-to-r ${config.gradient}`} />
      )}
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-xl shrink-0`}>
              {config.emoji}
            </div>
            <div>
              <h3 className="font-semibold font-display text-card-foreground">{complaint.category}</h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin className="h-3 w-3" />
                <span>{complaint.location.building}, {complaint.location.room}</span>
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300" />
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{complaint.description}</p>
        <div className="flex items-center justify-between">
          <StatusBadge status={complaint.status} />
          <div className="flex items-center gap-3">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all ${
                hasUpvoted
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
              }`}
              title={hasUpvoted ? 'Already upvoted' : 'Upvote this complaint'}
            >
              <ThumbsUp className={`h-3.5 w-3.5 ${hasUpvoted ? 'fill-primary' : ''}`} />
              {upvotes}
            </button>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{complaint.date}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
