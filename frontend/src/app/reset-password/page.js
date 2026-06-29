'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error | invalid_token
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("invalid_token");
      setMessage('This reset link is missing a token. Please request a new one.');
    }
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 8) {
      setMessage('Password must be at least 8 characters.');
      setStatus('error');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/v1/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Reset failed');
      }

      setStatus('success');
      setMessage(data.message || 'Password reset successfully. You can now log in.');
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container animate-fade-in">
        <div className="auth-card">
          <div className="auth-header">
            <div className="navbar-brand" style={{ justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
              <span>Mayleneee<span className="navbar-brand-dot">.code</span></span>
            </div>
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-subtitle">Enter your new password below.</p>
          </div>

          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
              <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
                <CheckCircle size={32} style={{ color: '#10b981' }} />
              </div>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>Password Reset!</h2>
              <p style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>{message}</p>
              <Link href="/login" className="btn btn-primary">Sign In Now</Link>
            </div>
          ) : status === 'invalid_token' ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
              <div style={{ width: '64px', height: '64px', background: 'rgba(239,68,68,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
                <AlertCircle size={32} style={{ color: '#ef4444' }} />
              </div>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)', color: '#ef4444' }}>Invalid Link</h2>
              <p style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>{message}</p>
              <Link href="/forgot-password" className="btn btn-primary">Request New Link</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {status === 'error' && (
                <div style={{ padding: 'var(--space-3)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderLeft: '4px solid #ef4444', borderRadius: '4px', fontSize: 'var(--text-sm)' }}>
                  {message}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="new-password" className="form-label">New Password</label>
                <div className="input-wrapper">
                  <span className="input-icon-left"><Lock size={18} /></span>
                  <input
                    id="new-password"
                    type={showPwd ? 'text' : 'password'}
                    className="form-input input-with-icon-left input-with-icon-right"
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    autoFocus
                  />
                  <span className="input-icon-right">
                    <button type="button" className="password-toggle" onClick={() => setShowPwd(!showPwd)}>
                      {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                <div className="input-wrapper">
                  <span className="input-icon-left"><Lock size={18} /></span>
                  <input
                    id="confirm-password"
                    type={showPwd ? 'text' : 'password'}
                    className="form-input input-with-icon-left"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Resetting...' : 'Reset Password'}
              </button>

              <div className="auth-footer">
                <Link href="/login" style={{ color: 'var(--text-tertiary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="auth-page"><div className="auth-container"><div className="auth-card">Loading...</div></div></div>}>
      <ResetForm />
    </Suspense>
  );
}
