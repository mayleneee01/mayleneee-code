'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import { useI18n } from '../../context/I18nContext';
import { User, Settings, Save, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const { t } = useI18n();
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [theme, setTheme] = useState('dark');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('mayleneee-user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setUser(u);
        setDisplayName(u.display_name || u.username);
        setTheme(u.theme || 'dark');
      } catch (e) {
        console.error("Invalid user data");
      }
    } else {
      window.location.href = '/login';
    }
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    setError('');
    setSaveSuccess(false);

    try {
      const token = localStorage.getItem('mayleneee-token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/v1/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          display_name: displayName,
          theme: theme
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Update local storage
      const updatedUser = { ...user, display_name: displayName, theme: theme };
      localStorage.setItem('mayleneee-user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSaveSuccess(true);
      
      // Update theme in DOM
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('mayleneee-theme', theme);
      
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  if (!user) return null;

  return (
    <MainLayout currentPage="profile">
      <main className="profile-page" style={{ padding: 'var(--space-8) var(--space-6)', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>Profile Settings</h1>
        <p style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-8)' }}>Manage your account identity and preferences.</p>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)' }}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', paddingBottom: 'var(--space-6)', borderBottom: '1px solid var(--border-primary)' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--color-primary-500)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <User size={40} />
              </div>
              <div>
                <h2 style={{ fontSize: 'var(--text-xl)' }}>{user.username}</h2>
                <div style={{ color: 'var(--text-tertiary)' }}>{user.email}</div>
                <div style={{ marginTop: 'var(--space-1)', display: 'inline-block', padding: '2px 8px', background: 'var(--bg-tertiary)', borderRadius: '4px', fontSize: 'var(--text-xs)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Role: {user.role}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="displayName" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={16} /> Display Name
              </label>
              <input
                id="displayName"
                type="text"
                className="form-input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter display name"
                required
              />
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '4px' }}>This is how you will appear on the leaderboard.</p>
            </div>

            <div className="form-group">
              <label htmlFor="theme" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={16} /> Theme Preference
              </label>
              <select
                id="theme"
                className="form-input"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="dark">Dark Theme (HTB Style)</option>
                <option value="light">Light Theme</option>
              </select>
            </div>

            {error && (
              <div style={{ padding: 'var(--space-3)', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderLeft: '4px solid #ef4444', borderRadius: '4px' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
              style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {isSaving ? (
                'Saving...'
              ) : saveSuccess ? (
                <><CheckCircle size={18} /> Saved successfully</>
              ) : (
                <><Save size={18} /> Save Changes</>
              )}
            </button>
          </form>
        </div>
      </main>
    </MainLayout>
  );
}
