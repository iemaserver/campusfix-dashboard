import { useNavigate } from 'react-router-dom';
import { GraduationCap, Shield, ArrowRight, Wrench } from 'lucide-react';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[360px] h-[360px] rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* Logos */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <img
            src="/assets/UEM_LOGO.png"
            alt="UEM Logo"
            className="h-16 w-16 object-contain drop-shadow-lg"
          />
          <div className="w-px h-12 bg-border/60" />
          <img
            src="/assets/IEM.png"
            alt="IEM Logo"
            className="h-16 w-16 object-contain drop-shadow-lg"
          />
        </div>

        {/* Title */}
        <div className="mb-2">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4">
            <Wrench className="h-3.5 w-3.5" />
            Smart Campus Platform
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-gradient leading-tight mb-3">
          UEM Complaint
          <br />
          Management System
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto mb-12 leading-relaxed">
          Report, track and resolve campus infrastructure issues — fast and transparently.
        </p>

        {/* Login cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Student */}
          <button
            onClick={() => navigate('/student-login')}
            className="group relative bg-card border border-border/40 rounded-3xl p-8 text-left shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-cyan-500/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="h-7 w-7 text-blue-500" />
              </div>
              <h2 className="text-lg font-bold font-display text-foreground mb-1">Student Login</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sign in with your university email via OTP verification.
              </p>
              <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-blue-500">
                Get Started <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>

          {/* Manager */}
          <button
            onClick={() => navigate('/manager-login')}
            className="group relative bg-card border border-border/40 rounded-3xl p-8 text-left shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-indigo-500/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-lg font-bold font-display text-foreground mb-1">Manager Login</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Admin &amp; facility managers — sign in with your credentials.
              </p>
              <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-primary">
                Sign In <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground/60">
          © 2026 University of Engineering &amp; Management · CampusFix
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;
