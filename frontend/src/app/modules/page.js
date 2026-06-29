'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import { useI18n } from '../../context/I18nContext';
import { Book, Shield, Code, Brain } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function ModulesContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [learningPaths, setLearningPaths] = useState([
    { id: 'coding', category: 'coding', icon: <Code size={24} />, title: 'Coding Fundamentals', description: 'Master the basics of programming and software engineering.', modules: 0, estimatedHours: 0, progress: 0 },
    { id: 'asd', category: 'asd', icon: <Brain size={24} />, title: 'Algorithms & Data Structures', description: 'Learn how to optimize code and solve complex problems efficiently.', modules: 0, estimatedHours: 0, progress: 0 },
    { id: 'hacking', category: 'hacking', icon: <Shield size={24} />, title: 'Ethical Hacking', description: 'Become a cybersecurity expert through hands-on penetration testing.', modules: 0, estimatedHours: 0, progress: 0 },
  ]);

  useEffect(() => {
    // 1. Fetch modules to calculate path counts
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
            
            // 2. Try to fetch user progress if logged in
            const token = localStorage.getItem('mayleneee-token');
            const userStr = localStorage.getItem('mayleneee-user');
            
            if (token && userStr) {
                const u = JSON.parse(userStr);
                fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/v1/users/${u.id}/progress`, {
                  headers: { 'Authorization': `Bearer ${token}` }
                })
                .then(res => res.json())
                .then(progressData => {
                    // Update paths with counts and mock progress
                    const pts = progressData.total_points || 0;
                    setLearningPaths(prev => prev.map(p => ({
                        ...p,
                        modules: counts[p.category] || 0,
                        estimatedHours: (counts[p.category] || 0) * 2,
                        progress: p.category === 'coding' ? Math.min(100, Math.floor(pts / 100 * 100)) 
                                : p.category === 'asd' ? Math.min(100, Math.floor((pts-100) / 100 * 100))
                                : Math.min(100, Math.floor((pts-200) / 100 * 100))
                    })));
                })
                .catch(() => updatePathsOnlyCounts(counts));
            } else {
                updatePathsOnlyCounts(counts);
            }
        }
    }).catch(err => console.error("Failed to fetch modules:", err));
  }, []);

  function updatePathsOnlyCounts(counts) {
      setLearningPaths(prev => prev.map(p => ({
          ...p,
          modules: counts[p.category] || 0,
          estimatedHours: (counts[p.category] || 0) * 2,
          progress: 0
      })));
  }

  const filteredPaths = learningPaths.filter(path => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const title = (t(`paths.${path.id}.title`) || path.title).toLowerCase();
    const desc = path.description.toLowerCase();
    return title.includes(q) || desc.includes(q) || path.category.includes(q);
  });

  return (
    <MainLayout currentPage="paths">
      <main className="modules-page" style={{ padding: 'var(--space-8) var(--space-6)', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-2)' }}>
          <Book size={32} style={{ color: 'var(--color-primary-500)' }} />
          <h1 style={{ fontSize: 'var(--text-3xl)' }}>Learning Paths</h1>
        </div>
        <p style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-8)' }}>
          Explore structured curriculums designed to take you from beginner to expert.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-6)' }}>
          {filteredPaths.length === 0 && (
            <p style={{ color: 'var(--text-tertiary)' }}>No learning paths found for "{searchQuery}".</p>
          )}
          {filteredPaths.map((path) => (
            <Link href={`/modules/${path.id}`} key={path.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div 
                style={{ 
                  background: 'var(--bg-secondary)', 
                  borderRadius: 'var(--radius-lg)', 
                  border: '1px solid var(--border-primary)', 
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Thumbnail Image */}
                <div style={{ 
                  height: '160px', 
                  background: 'var(--bg-tertiary)',
                  backgroundImage: `url(/images/paths/${path.category}.png)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, var(--bg-secondary))' }}></div>
                  <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', backdropFilter: 'blur(4px)' }}>
                    {path.category.toUpperCase()}
                  </div>
                </div>
                
                {/* Content */}
                <div style={{ padding: 'var(--space-5)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>{t(`paths.${path.id}.title`) || path.title}</h3>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', flex: 1 }}>
                    {path.description}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    <span>{path.modules} Modules</span>
                    <span>{path.estimatedHours} Hours</span>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: '4px', color: 'var(--text-tertiary)' }}>
                      <span>Progress</span>
                      <span style={{ color: 'var(--color-primary-400)', fontWeight: 600 }}>{path.progress < 0 ? 0 : path.progress}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${path.progress < 0 ? 0 : path.progress}%`, height: '100%', background: 'var(--color-primary-500)' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </MainLayout>
  );
}

export default function ModulesPage() {
  return (
    <Suspense fallback={<div>Loading paths...</div>}>
      <ModulesContent />
    </Suspense>
  );
}
