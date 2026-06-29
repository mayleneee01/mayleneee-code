'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useI18n } from '../../../context/I18nContext';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithToken } = useAuth();
  const { t } = useI18n();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // 1. Save token
      localStorage.setItem('mayleneee-token', token);
      
      // 2. Fetch user profile to complete login state
      fetch((process.env.NEXT_PUBLIC_API_URL || '/api') + '/v1/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
      })
      .then(data => {
        localStorage.setItem('mayleneee-user', JSON.stringify(data.user));
        // Force a reload to let AuthContext pick up the new localStorage state,
        // or we could use a custom loginWithToken method if we exposed one.
        // For simplicity and to ensure all contexts reset correctly, window.location is robust.
        window.location.href = '/dashboard';
      })
      .catch(err => {
        console.error('OAuth login failed:', err);
        router.push('/login?error=oauth_failed');
      });
    } else {
      router.push('/login?error=no_token');
    }
  }, [router, searchParams]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-500)" strokeWidth="2" style={{ animation: 'spin 1s linear infinite', marginBottom: 'var(--space-4)' }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <h2 style={{ color: 'var(--text-primary)' }}>{t('common.loading') || 'Authenticating...'}</h2>
      <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>Please wait while we complete your login.</p>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackHandler />
    </Suspense>
  );
}
