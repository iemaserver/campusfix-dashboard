import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, GraduationCap, Mail, Lock, LogIn } from 'lucide-react';
import { msalInstance, popupRequest } from '@/lib/msal';
import { studentLogin } from '@/services/api';
import { toast } from 'sonner';

/* -- Outlook logo SVG ------------------------------------------------- */
const OutlookLogo = () => (
  <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <rect width="48" height="48" rx="8" fill="#0078D4" />
    <path d="M26 10h12a2 2 0 0 1 2 2v24a2 2 0 0 1-2 2H26V10z" fill="#50E6FF" opacity=".4" />
    <path d="M8 16l18-6v28L8 32V16z" fill="#fff" />
    <ellipse cx="17" cy="24" rx="5" ry="6" fill="#0078D4" />
    <path d="M26 18h12v3H26zM26 23h12v2H26zM26 27h12v3H26z" fill="#0078D4" />
  </svg>
);

const StudentLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [outlookLoading, setOutlookLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.toLowerCase().endsWith('@uem.edu.in')) {
      toast.error('Please use your @uem.edu.in email address');
      return;
    }
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const res = await studentLogin(email.toLowerCase(), password);
      localStorage.setItem('student_user', JSON.stringify(res.user));
      toast.success(`Welcome back, ${res.user.name || res.user.email}!`);
      navigate('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOutlookLogin = async () => {
    if (outlookLoading) return;
    setOutlookLoading(true);
    try {
      // Redirect to Microsoft login — main.tsx handles the response on return
      await msalInstance.loginRedirect(popupRequest);
    } catch (err: unknown) {
      if (err instanceof Error && err.message?.includes('user_cancelled')) return;
      if (err instanceof Error && err.message?.includes('interaction_in_progress')) {
        toast.error('A sign-in is already in progress. Please wait and try again.');
        return;
      }
      const message = err instanceof Error ? err.message : 'Sign-in failed';
      toast.error(message);
    } finally {
      setOutlookLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        {/* Back */}
        <button
          onClick={() => navigate('/welcome')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to home
        </button>

        <div className="bg-card rounded-3xl shadow-card-hover border border-border/40 overflow-hidden">
          {/* Header */}
          <div className="gradient-hero p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-12 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 border border-white/20">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-xl font-bold font-display text-white">Student Login</h1>
              <p className="text-sm text-white/60 mt-1">Sign in with your @uem.edu.in account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailLogin} className="p-8 space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="yourname@uem.edu.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary text-sm transition-all"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary text-sm transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-primary text-primary-foreground py-3.5 rounded-xl font-bold text-sm shadow-button hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              {loading ? 'Signing in...' : 'Login'}
            </button>

            {/* Register Link */}
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/student-register" className="text-primary hover:underline font-semibold">
                Register
              </Link>
            </p>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-medium">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Outlook Login */}
            <button
              type="button"
              onClick={handleOutlookLogin}
              disabled={outlookLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white hover:bg-gray-50 border border-border rounded-xl shadow-sm hover:shadow transition-all font-semibold text-gray-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {outlookLoading ? <Loader2 className="h-5 w-5 animate-spin text-blue-600" /> : <OutlookLogo />}
              {outlookLoading ? 'Signing in...' : 'Sign in with Outlook'}
            </button>
          </form>

          <div className="px-8 pb-8">
            <div className="bg-muted/50 rounded-xl p-4 border border-border/30">
              <p className="text-xs text-muted-foreground text-center">
                Use your UEM Outlook account for instant access
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
