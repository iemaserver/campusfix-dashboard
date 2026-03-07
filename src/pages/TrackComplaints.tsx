import { useEffect, useState } from 'react';
import { getComplaints } from '@/services/api';
import ComplaintCard from '@/components/ComplaintCard';
import { Search } from 'lucide-react';

const TrackComplaints = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getComplaints().then(setComplaints);
  }, []);

  const statuses = ['All', 'Submitted', 'Assigned', 'In Progress', 'Completed'];

  const filtered = complaints.filter(c => {
    const matchStatus = filter === 'All' || c.status === filter;
    const matchSearch = c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Track Complaints</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor the status of your submitted complaints</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search complaints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filter === s
                  ? 'gradient-primary text-primary-foreground shadow-sm'
                  : 'bg-card border border-input text-muted-foreground hover:bg-muted'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Complaints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => (
          <ComplaintCard key={c._id} complaint={c} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">No complaints found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default TrackComplaints;
