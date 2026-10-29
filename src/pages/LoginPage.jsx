import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DEMO_ACCOUNTS } from '../data/mockData';
import Icon from '../components/ui/Icon';
import { BrandMark } from '../components/layout/Sidebar';
import { StatusDot } from '../components/ui/Badges';
import { cx } from '../utils/format';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const { login, pushToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: 'you@lifegrid.ai', password: 'password', remember: true });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');

  const update = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
    setFormError('');
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!EMAIL_RE.test(form.email.trim())) next.email = 'Enter a valid email address.';
    if (!form.password) next.password = 'Password is required.';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setForgotMessage('');
    if (!validate()) return;

    setSubmitting(true);
    // Mock network latency before the session is created.
    setTimeout(() => {
      const result = login({ email: form.email, password: form.password, remember: form.remember });
      setSubmitting(false);
      if (!result.ok) {
        setFormError(result.error);
        console.warn('[LifeGrid] Sign-in rejected', { email: form.email.trim().toLowerCase() });
        return;
      }
      console.info('[LifeGrid] Sign-in success', {
        email: result.session.email,
        role: result.session.role,
        remember: form.remember,
        at: new Date().toISOString(),
      });
      pushToast(`Welcome back, ${result.session.name.split(' ')[0]}`, 'success');
      navigate(location.state?.from || '/dashboard', { replace: true });
    }, 600);
  };

  const fillDemo = (account) => {
    setForm((f) => ({ ...f, email: account.email, password: account.password }));
    setErrors({});
    setFormError('');
    setForgotMessage('');
  };

  const handleForgot = () => {
    const email = form.email.trim();
    if (!EMAIL_RE.test(email)) {
      setErrors((er) => ({ ...er, email: 'Enter your email above to reset the password.' }));
      return;
    }
    setForgotMessage(`If ${email} is registered, a reset link has been sent.`);
    console.info('[LifeGrid] Password reset requested', { email });
  };

  const activeDemo = DEMO_MATCH(form);

  return (
    <div className="grid-bg relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink-950 px-4 py-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_at_top,rgba(252,60,24,0.12),transparent_70%)]" />

      <div className="relative flex w-full max-w-md flex-col items-center">
        <BrandMark className="h-14 w-14 rounded-2xl" />
        <h1 className="mt-6 font-display text-[2rem] font-semibold tracking-tight text-mint">LifeGrid AI</h1>
        <p className="mt-2 text-center text-[15px] text-mint-muted">Edge AI Emergency Intelligence Platform</p>
        <p className="mt-3 flex items-center gap-2 text-sm text-signal">
          <StatusDot tone="signal" pulse />
          All systems operational
        </p>

        <form onSubmit={handleSubmit} noValidate className="panel mt-8 w-full gap-5 p-7" aria-label="Sign in">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-mint-muted">Email</label>
            <div className="relative">
              <Icon name="mail" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mint-dim" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={update('email')}
                placeholder="you@lifegrid.ai"
                aria-invalid={!!errors.email}
                className={cx(
                  'w-full rounded-lg border bg-ink-850 py-3 pl-10 pr-4 text-[15px] text-mint placeholder:text-mint-dim transition-all focus:outline-none focus:ring-2 focus:ring-signal/40',
                  errors.email ? 'border-alert/70' : 'border-ink-500 focus:border-signal/60',
                )}
              />
            </div>
            {errors.email && <p className="mt-1.5 text-xs text-alert">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-mint-muted">Password</label>
            <div className="relative">
              <Icon name="lock" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mint-dim" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={form.password}
                onChange={update('password')}
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                className={cx(
                  'w-full rounded-lg border bg-ink-850 py-3 pl-10 pr-11 text-[15px] text-mint placeholder:text-mint-dim transition-all focus:outline-none focus:ring-2 focus:ring-signal/40',
                  errors.password ? 'border-alert/70' : 'border-ink-500 focus:border-signal/60',
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-mint-muted transition-all hover:opacity-80"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                <Icon name={showPassword ? 'eyeOff' : 'eye'} className="h-[18px] w-[18px]" />
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs text-alert">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-mint-muted">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={update('remember')}
                className="h-4 w-4 cursor-pointer accent-[#FC3C18]"
              />
              Remember me
            </label>
            <button type="button" onClick={handleForgot} className="text-sm font-medium text-alert transition-all hover:opacity-80">
              Forgot password?
            </button>
          </div>

          {forgotMessage && (
            <p className="animate-slide-in rounded-lg border border-signal/30 bg-signal-tint px-3 py-2 text-sm text-signal">{forgotMessage}</p>
          )}
          {formError && (
            <p role="alert" className="animate-slide-in rounded-lg border border-alert/40 bg-alert/10 px-3 py-2 text-sm text-alert">{formError}</p>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full py-3 text-[15px]">
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className="panel mt-5 w-full p-5">
          <p className="mb-3 flex items-center gap-2 text-sm text-mint-muted">
            <Icon name="shield" className="h-4 w-4 text-signal" />
            Demo accounts (role-based access)
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.role}
                type="button"
                onClick={() => fillDemo(a)}
                aria-pressed={activeDemo === a.role}
                className={cx(
                  'rounded-lg border px-3 py-2.5 text-sm font-semibold transition-all duration-200 hover:opacity-80',
                  activeDemo === a.role
                    ? 'border-alert/60 bg-alert-tint text-signal shadow-glow-red'
                    : 'border-ink-500 bg-ink-700 text-mint',
                )}
              >
                {a.role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Returns the demo role whose credentials match the form, if any. */
function DEMO_MATCH(form) {
  const match = DEMO_ACCOUNTS.find((a) => a.email === form.email.trim().toLowerCase() && a.password === form.password);
  return match?.role;
}
