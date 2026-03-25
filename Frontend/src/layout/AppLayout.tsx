import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const people = [
  { name: 'MD Asif', url: 'https://www.linkedin.com/in/mdasif2003/' },
  { name: 'Pratyay Chatterjee', url: 'https://www.linkedin.com/in/pratyaychatterjee/' },
  { name: 'Prakash Metla', url: 'https://www.linkedin.com/in/prakash-metla-921050253' },
];

const guides = [
  { name: 'Dr. Sudipta Sahana', url: 'https://www.linkedin.com/in/sudipta-sahana-3843321a/' },
  { name: 'Dr. Susmita Mukherjee', url: 'https://www.linkedin.com/in/susmitamukherjee-environmentalist/' },
];

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-border/30 py-4 text-center text-xs text-muted-foreground/60 space-y-1">
        <p>
          Developed at CSE AI IEDC Lab by{' '}
          {people.map((p, i) => (
            <span key={p.url}>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground transition-colors">{p.name}</a>
              {i < people.length - 1 ? (i === people.length - 2 ? ' and ' : ', ') : ''}
            </span>
          ))}
          {' '}under the guidance of{' '}
          {guides.map((g, i) => (
            <span key={g.url}>
              <a href={g.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground transition-colors">{g.name}</a>
              {i < guides.length - 1 ? ' and ' : ''}
            </span>
          ))}
        </p>
        <p>© {new Date().getFullYear()} University of Engineering &amp; Management · CampusFix · All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AppLayout;
