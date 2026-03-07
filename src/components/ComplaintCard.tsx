import { MapPin, Calendar, ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useNavigate } from 'react-router-dom';

interface ComplaintCardProps {
  complaint: {
    _id: string;
    category: string;
    location: { building: string; floor: string; room: string };
    status: string;
    date: string;
    description: string;
  };
}

const categoryIcons: Record<string, string> = {
  Electricity: '⚡',
  Furniture: '🪑',
  Water: '💧',
  Internet: '📡',
  Cleanliness: '🧹',
  Infrastructure: '🏗️',
};

const ComplaintCard = ({ complaint }: ComplaintCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/complaints/${complaint._id}`)}
      className="bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{categoryIcons[complaint.category] || '📋'}</span>
          <div>
            <h3 className="font-semibold text-card-foreground">{complaint.category}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <MapPin className="h-3 w-3" />
              <span>{complaint.location.building}, {complaint.location.room}</span>
            </div>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{complaint.description}</p>
      <div className="flex items-center justify-between">
        <StatusBadge status={complaint.status} />
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{complaint.date}</span>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
