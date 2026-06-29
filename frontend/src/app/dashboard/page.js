'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '../../context/I18nContext';
import Navbar from '../../components/Navbar';
import Leaderboard from '../../components/Leaderboard';
import LabTerminal from '../../components/LabTerminal';

function IconTrendUp() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function IconTarget() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function IconZap() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}

function IconFlame() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function IconCode() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconBrain() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </svg>
  );
}

import MainLayout from '../../components/MainLayout';

export default function Dashboard() {
  const { t } = useI18n();
  const [stats, setStats] = useState({
    totalPoints: 0,
    modulesCompleted: 0,
    labsSolved: 0,
    currentStreak: 0,
  });
  const [user, setUser] = useState(null);

  const [learningPaths, setLearningPaths] = useState([
    { id: 'coding', category: 'coding', icon: <IconCode />, modules: 0, estimatedHours: 0, progress: 0 },
    { id: 'asd', category: 'asd', icon: <IconBrain />, modules: 0, estimatedHours: 0, progress: 0 },
    { id: 'hacking', category: 'hacking', icon: <IconShield />, modules: 0, estimatedHours: 0, progress: 0 },
  ]);

  useEffect(() => {
    // 1. Get user from localStorage
    const userStr = localStorage.getItem('mayleneee-user');
    const token = localStorage.getItem('mayleneee-token');
    
    if (userStr && token) {
      try {
        const u = JSON.parse(userStr);
        setUser(u);
        
        // 2. Fetch progress from API
        fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/v1/users/${u.id}/progress`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setStats({
              totalPoints: data.total_points || 0,
              modulesCompleted: data.modules_completed || 0,
              labsSolved: data.labs_solved || 0,
              currentStreak: data.current_streak || 0,
            });
          }
        })
        .catch(err => console.error("Failed to fetch progress:", err));

        // 3. Fetch modules to calculate path counts
        fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/v1/modules`)
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                const counts = { coding: 0, asd: 0, hacking: 0 };
                data.forEach(m => {
                    if (counts[m.category] !== undefined) {
                        counts[m.category]++;
                    }
                });
                setLearningPaths([
                    { id: 'coding', category: 'coding', icon: <IconCode />, modules: counts.coding, estimatedHours: counts.coding * 2, progress: 0 },
                    { id: 'asd', category: 'asd', icon: <IconBrain />, modules: counts.asd, estimatedHours: counts.asd * 2, progress: 0 },
                    { id: 'hacking', category: 'hacking', icon: <IconShield />, modules: counts.hacking, estimatedHours: counts.hacking * 2, progress: 0 },
                ]);
            }
        }).catch(err => console.error("Failed to fetch modules:", err));

      } catch (e) {
        console.error("Invalid user data in local storage");
      }
    }
  }, []);

  const statCards = [
    {
      icon: <IconTrendUp />,
      iconClass: 'stat-icon-blue',
      value: stats.totalPoints.toLocaleString(),
      label: t('dashboard.stats.totalPoints'),
    },
    {
      icon: <IconTarget />,
      iconClass: 'stat-icon-green',
      value: stats.modulesCompleted,
      label: t('dashboard.stats.modulesCompleted'),
    },
    {
      icon: <IconZap />,
      iconClass: 'stat-icon-yellow',
      value: stats.labsSolved,
      label: t('dashboard.stats.labsSolved'),
    },
    {
      icon: <IconFlame />,
      iconClass: 'stat-icon-red',
      value: `${stats.currentStreak}d`,
      label: t('dashboard.stats.currentStreak'),
    },
  ];

  return (
    <MainLayout currentPage="dashboard">
      <main className="dashboard">
        <div className="dashboard-content" style={{ maxWidth: '1400px', margin: '0 auto', padding: 'var(--space-6)' }}>
          {/* Header */}
          <div className="dashboard-header animate-fade-in" style={{ marginBottom: 'var(--space-8)' }}>
            <h1 className="dashboard-greeting" id="dashboard-greeting" style={{ fontSize: 'var(--text-4xl)', fontWeight: 800 }}>
              Welcome, {user?.display_name || user?.username || 'Hacker'}
            </h1>
            <p className="dashboard-subtext" style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-lg)' }}>{t('dashboard.subtitle')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 'var(--space-8)', alignItems: 'start' }}>
            
            {/* Left Column: Enrolled Paths & Modules */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
              
              <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                  <h2 style={{ fontSize: 'var(--text-xl)' }}>Active Learning Paths</h2>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>{learningPaths.length} Paths Available</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {learningPaths.map((path) => (
                    <div
                      key={path.id}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-primary)',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        alignItems: 'stretch',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'pointer',
                        overflow: 'hidden'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Thumbnail Image */}
                      <div style={{ 
                        width: '180px', 
                        background: 'var(--bg-tertiary)',
                        backgroundImage: `url(/images/paths/${path.category}.png)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative'
                      }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, var(--bg-secondary))' }}></div>
                      </div>
                      
                      {/* Content */}
                      <div style={{ flex: 1, padding: 'var(--space-5)', display: 'flex', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                              {path.category}
                            </span>
                          </div>
                          <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-1)' }}>{t(`paths.${path.id}.title`) || path.id.toUpperCase()}</h3>
                          <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                            <span>{path.modules} Modules</span>
                            <span>{path.estimatedHours} Hours</span>
                          </div>
                        </div>
                        
                        <div style={{ width: '150px', textAlign: 'right' }}>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)' }}>
                            <span style={{ color: 'var(--color-primary-400)', fontWeight: 600 }}>{path.progress}%</span> Complete
                          </div>
                          <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${path.progress}%`, height: '100%', background: 'var(--color-primary-500)' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                      

                  ))}
                </div>
              </section>

              <section>
                <Leaderboard />
              </section>

            </div>

            {/* Right Column: User Profile Card (HTB Style) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              
              {/* Profile Card */}
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
                  <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>{user?.display_name || user?.username || 'Hacker'}</h2>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconTarget />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <IconTrendUp /> <span style={{ fontWeight: 600 }}>{stats.totalPoints}</span> <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>pts</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <IconZap /> <span style={{ fontWeight: 600 }}>{stats.labsSolved}</span> <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>labs</span>
                  </div>
                </div>

                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Level {Math.floor(stats.totalPoints / 100) + 1}</span>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>{stats.totalPoints % 100}/100</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${stats.totalPoints % 100}%`, height: '100%', background: '#a855f7' }}></div>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-tertiary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '2px' }}>Rank</div>
                    <div style={{ fontWeight: 700 }}>Apprentice</div>
                  </div>
                  <div style={{ color: 'var(--text-tertiary)' }}>
                    ★★★
                  </div>
                </div>
              </div>

              {/* Weekly Streak Card */}
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                  <h3 style={{ fontSize: 'var(--text-md)', color: 'var(--text-secondary)' }}>Weekly Streak</h3>
                  <IconFlame />
                </div>
                <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ color: '#ef4444' }}>🔥</span> {stats.currentStreak} weeks
                </div>
                <div style={{ width: '100%', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, stats.currentStreak * 10)}%`, height: '100%', background: '#ef4444' }}></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
