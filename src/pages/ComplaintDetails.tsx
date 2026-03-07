import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Tag, Calendar, CheckCircle2, Clock, UserCheck, Loader2 } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { getComplaintById } from '@/services/api';

const timelineSteps = [
  { label: 'Submitted', icon: Clock },
  { label: 'Assigned', icon: UserCheck },
  { label: 'In Progress', icon: Loader2 },
  { label: 'Completed', icon: CheckCircle2 },
];

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<any>(null);

  useEffect(() => {
    if (id) getComplaintById(id).then(setComplaint);
  }, [id]);

  if (!complaint) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;

  const statusIndex = timelineSteps.findIndex(s => s.label === complaint.status);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden">
        {/* Photo placeholder */}
        <div className="h-48 bg-muted flex items-center justify-center">
          <span className="text-4xl">{complaint.category === 'Electricity' ? '⚡' : complaint.category === 'Water' ? '💧' : complaint.category === 'Internet' ? '📡' : complaint.category === 'Furniture' ? '🪑' : complaint.category === 'Cleanliness' ? '🧹' : '🏗️'}</span>
        </div>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">{complaint.category} Issue</h1>
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{complaint.location.building}, {complaint.location.floor}, {complaint.location.room}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{complaint.date}</span>
                <span className="flex items-center gap-1"><Tag className="h-3.5 w-3.5" />{complaint.category}</span>
              </div>
            </div>
            <StatusBadge status={complaint.status} />
          </div>

          {/* Description */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-2">Description</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{complaint.description}</p>
          </div>

          {/* Timeline */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-4">Status Timeline</h2>
            <div className="space-y-0">
              {timelineSteps.map((step, i) => {
                const isActive = i <= statusIndex;
                const isCurrent = i === statusIndex;
                return (
                  <div key={step.label} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} ${isCurrent ? 'ring-2 ring-secondary ring-offset-2 ring-offset-card' : ''}`}>
                        <step.icon className="h-4 w-4" />
                      </div>
                      {i < timelineSteps.length - 1 && (
                        <div className={`w-0.5 h-8 ${isActive ? 'bg-primary' : 'bg-border'}`} />
                      )}
                    </div>
                    <div className="pt-1">
                      <p className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</p>
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
