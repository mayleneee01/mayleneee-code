'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | sent | error
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/v1/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });

      const data = await res.json();

      setStatus('sent');
      setMessage(data.message || 'Check your email for the reset link.');

      // DEV: If backend returns dev_link, show it (remove in production)
      if (data.dev_link) {
        console.log('[DEV] Reset link:', data.dev_link);
        setMessage(prev => prev + ` (Dev mode: Check browser console for the reset link)`);
      }
    } catch (err) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container animate-fade-in">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <div className="navbar-brand" style={{ justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
              <span>Mayleneee<span className="navbar-brand-dot">.code</span></span>
            </div>
            <h1 className="auth-title">Forgot Password</h1>
            <p className="auth-subtitle">
              Enter your registered email address and we'll send you a reset link.
            </p>
          </div>

          {status === 'sent' ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
              <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
                <CheckCircle size={32} style={{ color: '#10b981' }} />
              </div>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>Email Sent!</h2>
              <p style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                {message}
              </p>
              <Link href="/login" style={{ color: 'var(--color-primary-400)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {status === 'error' && (
                <div style={{ padding: 'var(--space-3)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderLeft: '4px solid #ef4444', borderRadius: '4px', fontSize: 'var(--text-sm)' }}>
                  {message}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon-left"><Mail size={18} strokeWidth={2} /></span>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    className="form-input input-with-icon-left"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Sending...
                  </span>
                ) : 'Send Reset Link'}
              </button>

              <div className="auth-footer">
                <Link href="/login" style={{ color: 'var(--color-primary-400)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: 'var(--text-sm)' }}>
                  <ArrowLeft size={16} /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
