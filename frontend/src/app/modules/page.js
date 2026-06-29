'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { Book, Play, Lock, Code, Shield, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function ModulesPage() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch modules from the real API we just created, but fallback to mock data if it fails (e.g. no DB connected yet)
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/modules');
        if (res.ok) {
          const data = await res.json();
          setModules(data);
        } else {
          throw new Error('API not ready');
        }
      } catch (err) {
        // Fallback friendly mock data to show the new UI
        setModules([
          {
            id: 'web-fundamentals',
            title: 'Web Security Fundamentals',
            description: 'Learn how modern web applications work and how to find common vulnerabilities like XSS and CSRF.',
            category: 'hacking',
            difficulty: 'beginner',
            accessTier: 'free',
            pointsReward: 100,
            type: 'terminal'
          },
          {
            id: 'sql-injection-mastery',
            title: 'SQL Injection Mastery',
            description: 'Master the art of extracting data from databases through advanced SQL injection techniques.',
            category: 'hacking',
            difficulty: 'intermediate',
            accessTier: 'free',
            pointsReward: 250,
            type: 'terminal'
          },
          {
            id: 'secure-coding-go',
            title: 'Secure Coding in Go',
            description: 'Fix vulnerable Go source code. Practice sanitizing inputs and preventing command injection directly in the code editor.',
            category: 'coding',
            difficulty: 'advanced',
            accessTier: 'premium',
            pointsReward: 500,
            type: 'code'
          },
          {
            id: 'jwt-vulnerabilities',
            title: 'Fixing JWT Vulnerabilities',
            description: 'Analyze and patch a broken JWT implementation. Learn how algorithm confusion attacks work and how to prevent them.',
            category: 'coding',
            difficulty: 'intermediate',
            accessTier: 'free',
            pointsReward: 300,
            type: 'code'
          },
          {
            id: 'linux-privesc',
            title: 'Linux Privilege Escalation',
            description: 'Start as a low-privileged user and find misconfigurations to escalate your privileges to root.',
            category: 'hacking',
            difficulty: 'advanced',
            accessTier: 'premium',
            pointsReward: 1000,
            type: 'terminal'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'coding': return <Code size={20} className="text-primary-500" />;
      case 'hacking': return <Shield size={20} className="text-danger-500" />;
      default: return <Terminal size={20} className="text-accent-500" />;
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'beginner': return 'var(--color-success-500)';
      case 'intermediate': return 'var(--color-accent-500)';
      case 'advanced': return 'var(--color-danger-500)';
      default: return 'var(--color-primary-500)';
    }
  };

  return (
    <div className="layout">
      <Navbar currentPage="paths" />
      
      <main className="main-content" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: 'var(--radius-2xl)', backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-600)', marginBottom: 'var(--space-4)' }}>
              <Book size={32} strokeWidth={1.5} />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
              Learning Modules
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Choose your path. Learn by doing in secure, isolated sandbox environments.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
              <div className="loader" style={{ width: '40px', height: '40px', borderWidth: '4px', margin: '0 auto' }}></div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
              {modules.map(mod => (
                <div key={mod.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' }}>
                  
                  {mod.accessTier === 'premium' && (
                    <div style={{ position: 'absolute', top: 0, right: 0, padding: 'var(--space-2) var(--space-4)', backgroundColor: 'var(--color-accent-100)', color: 'var(--color-accent-700)', borderBottomLeftRadius: 'var(--radius-lg)', fontWeight: 600, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Lock size={12} strokeWidth={2.5} /> Premium
                    </div>
                  )}

                  <div className="card-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <div style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-gray-100)' }}>
                        {getCategoryIcon(mod.category)}
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: getDifficultyColor(mod.difficulty) }}>
                          {mod.difficulty} • {mod.type === 'code' ? 'Code Challenge' : 'Terminal Lab'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-body" style={{ flexGrow: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
                      {mod.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                      {mod.description}
                    </p>
                  </div>

                  <div className="card-footer" style={{ borderTop: '1px solid var(--border-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-4)' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-600)' }}>
                      +{mod.pointsReward} XP
                    </span>
                    <Link href={`/modules/${mod.id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-xl)' }}>
                      <Play size={16} fill="currentColor" />
                      <span>Start Lab</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
