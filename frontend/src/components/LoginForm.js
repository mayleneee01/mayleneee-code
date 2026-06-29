'use client';

import { useState, useRef, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';
import { validateEmail, validatePassword, validateUsername, validatePasswordMatch, createSubmitGuard } from '../lib/security';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

// Brand Icons
function IconGoogle() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

const submitGuard = createSubmitGuard(2000);

export default function LoginForm({ mode = 'login', onModeChange }) {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailRef = useRef(null);

  useEffect(() => {
    // Focus email input on mount
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, [mode]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (serverError) setServerError('');
  }

  function validateForm() {
    const newErrors = {};

    if (mode === 'register') {
      const usernameResult = validateUsername(formData.username);
      if (!usernameResult.valid) {
        newErrors.username = t(usernameResult.error);
      }
    }

    const emailResult = validateEmail(formData.email);
    if (!emailResult.valid) {
      newErrors.email = t(emailResult.error);
    }

    const passwordResult = validatePassword(formData.password);
    if (!passwordResult.valid) {
      newErrors.password = t(passwordResult.error);
    }

    if (mode === 'register') {
      const matchResult = validatePasswordMatch(formData.password, formData.confirmPassword);
      if (!matchResult.valid) {
        newErrors.confirmPassword = t(matchResult.error);
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!submitGuard.canSubmit()) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      // Simulated API call — in production, use AuthContext.login/register
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success: redirect would happen via AuthContext
      console.log(`${mode} successful:`, formData.email);
    } catch (err) {
      setServerError(err.message || t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleOAuth(provider) {
    // In production, use AuthContext.loginWithOAuth(provider)
    const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api';
    const callbackUrl = encodeURIComponent(window.location.origin + '/auth/callback');
    window.location.href = `${apiBase}/v1/auth/oauth/${provider}?redirect=${callbackUrl}`;
  }

  const isLogin = mode === 'login';

  return (
    <div className="auth-page">
      <div className="auth-container animate-fade-in">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <div className="navbar-brand" style={{ justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
              <span>Mayleneee<span className="navbar-brand-dot">.code</span></span>
            </div>
            <h1 className="auth-title" id="auth-title">
              {isLogin ? t('auth.loginTitle') : t('auth.registerTitle')}
            </h1>
            <p className="auth-subtitle">
              {isLogin ? t('auth.loginSubtitle') : t('auth.registerSubtitle')}
            </p>
          </div>

          {/* OAuth Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <button
              type="button"
              className="oauth-btn"
              onClick={() => handleOAuth('google')}
              id="oauth-google-btn"
              aria-label={t('auth.loginWithGoogle')}
            >
              <IconGoogle />
              <span>{t('auth.loginWithGoogle')}</span>
            </button>
            <button
              type="button"
              className="oauth-btn"
              onClick={() => handleOAuth('github')}
              id="oauth-github-btn"
              aria-label={t('auth.loginWithGitHub')}
            >
              <IconGitHub />
              <span>{t('auth.loginWithGitHub')}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="divider">{t('auth.orContinueWith')}</div>

          {/* Server Error */}
          {serverError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-4)',
                backgroundColor: 'var(--color-danger-50)',
                border: '1px solid var(--color-danger-200)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--color-danger-700)',
                fontSize: 'var(--text-sm)',
                marginBottom: 'var(--space-4)',
              }}
              role="alert"
              id="server-error"
            >
              <AlertCircle size={16} strokeWidth={2} />
              <span>{serverError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Username (Register only) */}
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  {t('auth.username')}
                </label>
                <div className="input-wrapper">
                  <span className="input-icon-left"><User size={18} strokeWidth={2} /></span>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className={`form-input input-with-icon-left ${errors.username ? 'form-input-error' : ''}`}
                    placeholder={t('auth.usernamePlaceholder')}
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="username"
                    maxLength={30}
                    aria-invalid={!!errors.username}
                    aria-describedby={errors.username ? 'username-error' : undefined}
                  />
                </div>
                {errors.username && (
                  <p className="form-error" id="username-error" role="alert">{errors.username}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                {t('auth.email')}
              </label>
              <div className="input-wrapper">
                <span className="input-icon-left"><Mail size={18} strokeWidth={2} /></span>
                <input
                  ref={emailRef}
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input input-with-icon-left ${errors.email ? 'form-input-error' : ''}`}
                  placeholder={t('auth.emailPlaceholder')}
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  maxLength={254}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p className="form-error" id="email-error" role="alert">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="password" className="form-label" style={{ marginBottom: 0 }}>
                  {t('auth.password')}
                </label>
                {isLogin && (
                  <a
                    href="/forgot-password"
                    style={{ fontSize: 'var(--text-xs)', fontWeight: 500 }}
                    id="forgot-password-link"
                  >
                    {t('auth.forgotPassword')}
                  </a>
                )}
              </div>
              <div className="input-wrapper" style={{ marginTop: 'var(--space-2)' }}>
                <span className="input-icon-left"><Lock size={18} strokeWidth={2} /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className={`form-input input-with-icon-left input-with-icon-right ${errors.password ? 'form-input-error' : ''}`}
                  placeholder={t('auth.passwordPlaceholder')}
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  maxLength={128}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : 'password-hint'}
                />
                <span className="input-icon-right">
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                    id="password-toggle-btn"
                  >
                    {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                  </button>
                </span>
              </div>
              {errors.password ? (
                <p className="form-error" id="password-error" role="alert">{errors.password}</p>
              ) : (
                !isLogin && (
                  <p className="form-hint" id="password-hint">{t('auth.passwordRequirements')}</p>
                )
              )}
            </div>

            {/* Confirm Password (Register only) */}
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  {t('auth.confirmPassword')}
                </label>
                <div className="input-wrapper">
                  <span className="input-icon-left"><Lock size={18} strokeWidth={2} /></span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`form-input input-with-icon-left input-with-icon-right ${errors.confirmPassword ? 'form-input-error' : ''}`}
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    maxLength={128}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                  />
                  <span className="input-icon-right">
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                      id="confirm-password-toggle-btn"
                    >
                      {showConfirmPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                    </button>
                  </span>
                </div>
                {errors.confirmPassword && (
                  <p className="form-error" id="confirm-password-error" role="alert">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: 'var(--space-2)' }}
              disabled={isSubmitting}
              id="auth-submit-btn"
            >
              {isSubmitting ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  {t('common.loading')}
                </span>
              ) : (
                isLogin ? t('auth.loginButton') : t('auth.registerButton')
              )}
            </button>
          </form>

          {/* Footer: Switch mode */}
          <div className="auth-footer">
            {isLogin ? (
              <p>
                {t('auth.noAccount')}{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onModeChange?.('register');
                  }}
                  id="switch-to-register"
                >
                  {t('auth.signUpLink')}
                </a>
              </p>
            ) : (
              <p>
                {t('auth.hasAccount')}{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onModeChange?.('login');
                  }}
                  id="switch-to-login"
                >
                  {t('auth.signInLink')}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
