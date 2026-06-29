'use client';

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

export default function DashboardPage() {
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
      value: MOCK_STATS.totalPoints.toLocaleString(),
      label: t('dashboard.stats.totalPoints'),
    },
    {
      icon: <IconTarget />,
      iconClass: 'stat-icon-green',
      value: MOCK_STATS.modulesCompleted,
      label: t('dashboard.stats.modulesCompleted'),
    },
    {
      icon: <IconZap />,
      iconClass: 'stat-icon-yellow',
      value: MOCK_STATS.labsSolved,
      label: t('dashboard.stats.labsSolved'),
    },
    {
      icon: <IconFlame />,
      iconClass: 'stat-icon-red',
      value: `${MOCK_STATS.currentStreak}d`,
      label: t('dashboard.stats.currentStreak'),
    },
  ];

  return (
    <>
      <Navbar currentPage="dashboard" />
      <main className="dashboard">
        <div className="dashboard-content">
          {/* Header */}
          <div className="dashboard-header animate-fade-in">
            <h1 className="dashboard-greeting" id="dashboard-greeting">
              {t('dashboard.greeting', { name: 'Maylene' })}
            </h1>
            <p className="dashboard-subtext">{t('dashboard.subtitle')}</p>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid stagger-children">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card" id={`stat-card-${index}`}>
                <div className={`stat-icon ${stat.iconClass}`}>
                  {stat.icon}
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="section-grid">
            {/* Left Column: Learning Paths + Terminal */}
            <div>
              <h2 className="section-title">{t('dashboard.learningPaths')}</h2>
              <div className="path-cards stagger-children">
                {learningPaths.map((path) => (
                  <div
                    key={path.id}
                    className={`path-card path-card-${path.category}`}
                    id={`path-card-${path.id}`}
                  >
                    <div
                      className="path-card-icon"
                      style={{
                        backgroundColor: path.category === 'coding'
                          ? 'var(--color-primary-100)'
                          : path.category === 'asd'
                            ? 'var(--color-accent-100)'
                            : 'var(--color-success-100)',
                        color: path.category === 'coding'
                          ? 'var(--color-primary-600)'
                          : path.category === 'asd'
                            ? 'var(--color-accent-600)'
                            : 'var(--color-success-600)',
                      }}
                    >
                      {path.icon === 'code' ? <IconCode /> : path.icon === 'brain' ? <IconBrain /> : <IconShield />}
                    </div>
                    <h3 className="path-card-title">
                      {t(`paths.${path.id}.title`) || path.id.toUpperCase()}
                    </h3>
                    <p className="path-card-desc">
                      {t(`paths.${path.id}.description`) || "Explore this learning path."}
                    </p>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: 'var(--space-3)' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-tertiary)',
                        marginBottom: 'var(--space-1)',
                      }}>
                        <span>{t('common.inProgress')}</span>
                        <span>{path.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className={`progress-bar-fill ${path.category === 'hacking' ? 'progress-bar-fill-success' : ''}`}
                          style={{ width: `${path.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="path-card-meta">
                      <span className="path-card-meta-item">
                        <IconLayers />
                        <span>{path.modules} {t('common.modules')}</span>
                      </span>
                      <span className="path-card-meta-item">
                        <IconClock />
                        <span>{path.estimatedHours}h</span>
                      </span>
                      <span style={{ marginLeft: 'auto' }}>
                        <a
                          href={`/modules/${path.id}`}
                          className="btn btn-sm btn-ghost"
                          style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-2)' }}
                        >
                          <span>{t('common.viewAll')}</span>
                          <IconArrowRight />
                        </a>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Lab Terminal Preview */}
              <div style={{ marginTop: 'var(--space-8)' }}>
                <h2 className="section-title">{t('nav.labs')}</h2>
                <LabTerminal labName="HTB: Blue" status="connected" />
              </div>
            </div>

            {/* Right Column: Leaderboard */}
            <div>
              <Leaderboard />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
