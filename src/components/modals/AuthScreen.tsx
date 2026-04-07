import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { MessageCircle, Eye, EyeOff, Lock } from 'lucide-react';

export default function AuthScreen() {
  const { login, signup } = useApp();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [loginForm, setLoginForm] = useState({ emailOrUsername: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    name: '', username: '', email: '', mobile: '', password: '', avatar: '🧑',
  });

  const avatarOptions = ['🧑', '👩', '👨', '🧔', '👩‍💼', '👨‍💼', '🧑‍💻', '👩‍🎨', '🦸', '🧙', '🧝', '🧛'];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await login(loginForm.emailOrUsername, loginForm.password);
    if (!result.ok) setError(result.message || 'Invalid email/username or password.');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!signupForm.name || !signupForm.username || !signupForm.email || !signupForm.password) {
      setError('Please fill in all required fields');
      return;
    }
    if (signupForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    const result = await signup(signupForm);
    if (!result.ok) setError(result.message || 'Email or username already taken');
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm';
  const inputSmCls = 'w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4 overflow-y-auto">
      <div className="w-full max-w-md py-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-3 shadow-lg shadow-primary/30">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">ZenTalk</h1>
          <p className="text-muted-foreground mt-1 text-sm">Connect. Collaborate. Communicate.</p>
        </div>

        <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
          <div className="flex border-b border-border">
            {(['login', 'signup'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-4 text-sm font-semibold transition-colors capitalize ${
                  tab === t ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              {tab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email or Username</label>
                    <input
                      type="text"
                      value={loginForm.emailOrUsername}
                      onChange={e => setLoginForm(p => ({ ...p, emailOrUsername: e.target.value }))}
                      placeholder="Your email or username"
                      className={inputCls}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={loginForm.password}
                        onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                        placeholder="••••••••"
                        className={`${inputCls} pr-12`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] shadow-md shadow-primary/20 text-sm mt-2"
                  >
                    Sign In
                  </button>
                  <div className="p-3 rounded-xl bg-muted/60 border border-border">
                    <p className="text-xs text-muted-foreground text-center">
                      Existing Mongo usernames available: <span className="font-mono text-primary font-medium">coolcookie</span>, <span className="font-mono text-primary font-medium">Rohan05</span>, <span className="font-mono text-primary font-medium">cool</span>
                    </p>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Choose Your Avatar</label>
                    <div className="flex flex-wrap gap-2">
                      {avatarOptions.map(a => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => setSignupForm(p => ({ ...p, avatar: a }))}
                          className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                            signupForm.avatar === a
                              ? 'bg-primary/20 ring-2 ring-primary scale-110 shadow-sm'
                              : 'bg-muted hover:bg-muted/80 hover:scale-105'
                          }`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Full Name <span className="text-destructive">*</span></label>
                      <input
                        type="text"
                        value={signupForm.name}
                        onChange={e => setSignupForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Your name"
                        className={inputSmCls}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Username <span className="text-destructive">*</span></label>
                      <input
                        type="text"
                        value={signupForm.username}
                        onChange={e => setSignupForm(p => ({ ...p, username: e.target.value.replace(/\s/g, '') }))}
                        placeholder="username"
                        className={inputSmCls}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email <span className="text-destructive">*</span></label>
                    <input
                      type="email"
                      value={signupForm.email}
                      onChange={e => setSignupForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="you@example.com"
                      className={inputCls}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Mobile Number <span className="text-xs text-muted-foreground font-normal">(private, optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={signupForm.mobile}
                      onChange={e => setSignupForm(p => ({ ...p, mobile: e.target.value }))}
                      placeholder="+1 555 000 0000"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Password <span className="text-destructive">*</span></label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={signupForm.password}
                        onChange={e => setSignupForm(p => ({ ...p, password: e.target.value }))}
                        placeholder="Min. 6 characters"
                        className={`${inputCls} pr-12`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] shadow-md shadow-primary/20 text-sm"
                  >
                    Create Account
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-5 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3" /> Live Mongo auth · Realtime chat and calling
        </p>
      </div>
    </div>
  );
}
