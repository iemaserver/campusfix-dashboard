import { useEffect, useState } from 'react';
import { getComplaints } from '@/services/api';
import ComplaintCard from '@/components/ComplaintCard';
import { Search, SlidersHorizontal } from 'lucide-react';

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
    <div>
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-semibold mb-3">
          <SlidersHorizontal className="h-3 w-3" />
          Tracking
        </div>
        <h1 className="text-2xl font-bold font-display text-foreground">Track Complaints</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor the status of all submitted complaints</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by category or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border/40 bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary shadow-card transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                filter === s
                  ? 'gradient-primary text-primary-foreground shadow-button'
                  : 'bg-card border border-border/40 text-muted-foreground hover:border-primary/30 hover:text-foreground shadow-card'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs font-medium text-muted-foreground mb-4">{filtered.length} complaint{filtered.length !== 1 ? 's' : ''} found</p>

      {/* Complaints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((c, i) => (
          <div key={c._id} className="animate-slide-up" style={{ animationDelay: `${200 + i * 80}ms` }}>
            <ComplaintCard complaint={c} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-lg font-semibold font-display text-foreground">No complaints found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
};

export default TrackComplaints;
