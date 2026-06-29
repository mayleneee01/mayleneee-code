'use client';

import { useState, useEffect, useRef } from 'react';
import MainLayout from '../../components/MainLayout';
import { User, Camera, Save, CheckCircle, Coins, Trophy, Flame } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [theme, setTheme] = useState('dark');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ totalPoints: 0, coins: 0, labsSolved: 0, modulesCompleted: 0 });
  const fileInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const userStr = localStorage.getItem('mayleneee-user');
    const token = localStorage.getItem('mayleneee-token');
    if (!userStr) { window.location.href = '/login'; return; }
    try {
      const u = JSON.parse(userStr);
      setUser(u);
      setDisplayName(u.display_name || u.username || '');
      setTheme(u.theme || 'dark');
      setAvatarPreview(u.avatar_url || null);

      if (token) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/v1/users/${u.id}/progress`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data) {
            setStats({
              totalPoints: data.total_points || 0,
              coins: data.coins || 0,
              labsSolved: data.labs_solved || 0,
              modulesCompleted: data.modules_completed || 0,
            });
          }
        })
        .catch(() => {});
      }
    } catch (e) {
      console.error("Invalid user data");
    }
  }, []);

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Photo must be smaller than 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setError('');
    setSaveSuccess(false);

    try {
      const token = localStorage.getItem('mayleneee-token');
      const body = { display_name: displayName, theme };
      if (avatarPreview && avatarPreview.startsWith('data:')) {
        body.avatar_url = avatarPreview;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/v1/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update profile');
      }

      const updatedUser = { ...user, display_name: displayName, theme, avatar_url: body.avatar_url || user.avatar_url };
      localStorage.setItem('mayleneee-user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSaveSuccess(true);
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('mayleneee-theme', theme);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  if (!mounted) return null;
  if (!user) return (
    <MainLayout currentPage="profile">
      <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading...</div>
    </MainLayout>
  );

  const initials = (user.display_name || user.username || 'U').slice(0, 2).toUpperCase();
  const rankName = stats.totalPoints < 100 ? 'Apprentice' : stats.totalPoints < 500 ? 'Hacker' : stats.totalPoints < 1000 ? 'Pro Hacker' : 'Elite';

  return (
    <MainLayout currentPage="profile">
      <main style={{ padding: 'var(--space-8) var(--space-6)', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Profile</h1>
        <p style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-8)' }}>Manage your identity and track your progress.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-6)', alignItems: 'start' }}>

          {/* Left: Edit Form */}
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>Edit Profile</h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

              {/* Avatar Upload */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: '96px', height: '96px', borderRadius: '50%', cursor: 'pointer',
                    background: avatarPreview ? 'transparent' : 'var(--color-primary-500)',
                    backgroundImage: avatarPreview ? `url(${avatarPreview})` : 'none',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '3px solid var(--border-primary)',
                    position: 'relative', overflow: 'hidden',
                    transition: 'filter 0.2s'
                  }}
                >
                  {!avatarPreview && <span style={{ fontSize: '2rem', color: 'white', fontWeight: 800 }}>{initials}</span>}
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 0.2s'
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                  >
                    <Camera size={24} style={{ color: 'white' }} />
                  </div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                <div>
                  <button type="button" className="btn btn-outline" onClick={() => fileInputRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Camera size={16} /> Change Photo
                  </button>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>JPG, PNG max 2MB</p>
                </div>
              </div>

              {/* Username (readonly) */}
              <div className="form-group">
                <label className="form-label">Username</label>
                <input className="form-input" value={user.username} readOnly style={{ opacity: 0.6, cursor: 'not-allowed' }} />
              </div>

              {/* Email (readonly) */}
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" value={user.email} readOnly style={{ opacity: 0.6, cursor: 'not-allowed' }} />
              </div>

              {/* Display Name */}
              <div className="form-group">
                <label htmlFor="displayName" className="form-label">Display Name</label>
                <input
                  id="displayName"
                  type="text"
                  className="form-input"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Your display name on leaderboard"
                  required
                />
              </div>

              {/* Theme */}
              <div className="form-group">
                <label htmlFor="theme" className="form-label">Theme</label>
                <select id="theme" className="form-input" value={theme} onChange={e => setTheme(e.target.value)}>
                  <option value="dark">🌙 Dark Mode</option>
                  <option value="light">☀️ Light Mode</option>
                </select>
              </div>

              {error && (
                <div style={{ padding: 'var(--space-3)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderLeft: '4px solid #ef4444', borderRadius: '4px' }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn-primary" disabled={isSaving} style={{ display: 'flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start' }}>
                {isSaving ? 'Saving...' : saveSuccess ? <><CheckCircle size={18}/> Saved!</> : <><Save size={18}/> Save Changes</>}
              </button>
            </form>
          </div>

          {/* Right: Stats Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Identity Card */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', textAlign: 'center' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto var(--space-3)',
                background: avatarPreview ? 'transparent' : 'var(--color-primary-500)',
                backgroundImage: avatarPreview ? `url(${avatarPreview})` : 'none',
                backgroundSize: 'cover', backgroundPosition: 'center',
                border: '3px solid var(--color-primary-500)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {!avatarPreview && <span style={{ fontSize: '1.5rem', color: 'white', fontWeight: 800 }}>{initials}</span>}
              </div>
              <div style={{ fontWeight: 800, fontSize: 'var(--text-lg)' }}>{user.display_name || user.username}</div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>{user.email}</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: user.role === 'admin' ? 'rgba(239,68,68,0.15)' : 'var(--bg-tertiary)', borderRadius: '20px', fontSize: 'var(--text-xs)', fontWeight: 700, color: user.role === 'admin' ? '#ef4444' : 'var(--text-secondary)', textTransform: 'uppercase' }}>
                {user.role}
              </div>
            </div>

            {/* Coins & Stats */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Stats</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                    🪙 Coins
                  </span>
                  <span style={{ fontWeight: 700, color: '#f59e0b' }}>{stats.coins}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                    ⚡ Points
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary-400)' }}>{stats.totalPoints}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                    🔬 Labs Solved
                  </span>
                  <span style={{ fontWeight: 700 }}>{stats.labsSolved}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                    📚 Modules Done
                  </span>
                  <span style={{ fontWeight: 700 }}>{stats.modulesCompleted}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>🏆 Rank</span>
                  <span style={{ fontWeight: 700, color: '#a855f7' }}>{rankName}</span>
                </div>
              </div>
            </div>

            {/* Tier Card */}
            <div style={{ background: user.tier === 'premium' ? 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(239,68,68,0.1))' : 'var(--bg-secondary)', border: `1px solid ${user.tier === 'premium' ? 'rgba(245,158,11,0.4)' : 'var(--border-primary)'}`, borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
              <div style={{ fontWeight: 700, marginBottom: '4px', color: user.tier === 'premium' ? '#f59e0b' : 'var(--text-primary)' }}>
                {user.tier === 'premium' ? '⭐ Premium Member' : '🆓 Free Tier'}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                {user.tier === 'premium' ? 'You can download certificates and access all features.' : 'Upgrade to Premium to unlock certificates and exclusive labs.'}
              </div>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
