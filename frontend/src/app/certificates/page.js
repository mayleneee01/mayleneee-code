'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import { Award, Download, Lock } from 'lucide-react';

export default function CertificatesPage() {
  const [user, setUser] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  function buildCertificates(u, pts) {
    const certs = [
      { id: 'CERT-C123', path: 'Coding Fundamentals', slug: 'coding', date: '2025-10-12', earned: pts >= 100 },
      { id: 'CERT-A456', path: 'Algorithms & Data Structures', slug: 'asd', date: '2025-11-05', earned: pts >= 200 },
      { id: 'CERT-H789', path: 'Ethical Hacking', slug: 'hacking', date: '2026-01-20', earned: pts >= 300 }
    ];
    setCertificates(certs);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const userStr = localStorage.getItem('mayleneee-user');
    const token = localStorage.getItem('mayleneee-token');
    
    if (!userStr || !token) {
      window.location.href = '/login';
      return;
    }

    try {
      const u = JSON.parse(userStr);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(u);
      
      fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/v1/users/${u.id}/progress`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        const pts = data.total_points || 0;
        buildCertificates(u, pts);
      })
      .catch(() => {
        // Even on API failure, show the page with all certs locked
        buildCertificates(u, 0);
      });
    } catch (e) {
      console.error("Invalid user data");
      setLoading(false);
    }
  }, []);


  function handleDownload(e, cert) {
    e.stopPropagation();
    if (!user) return;
    if (user.tier !== 'premium' && user.role !== 'admin') {
      alert("🔒 Premium Required\n\nYou must upgrade to a Premium account to claim and download certificates.\n\nContact the admin to upgrade your account.");
      return;
    }
    alert(`✅ Downloading Certificate ${cert.id} for ${cert.path}...`);
  }

  // Show nothing until mounted to prevent SSR mismatch
  if (!mounted) return null;

  // Show spinner while loading
  if (loading) {
    return (
      <MainLayout currentPage="certificates">
        <main style={{ padding: 'var(--space-8) var(--space-6)', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-primary)', borderTopColor: 'var(--color-primary-500)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto var(--space-4)' }}></div>
            <p style={{ color: 'var(--text-tertiary)' }}>Loading certificates...</p>
          </div>
        </main>
      </MainLayout>
    );
  }

  if (!user) return null;

  const earnedCerts = certificates.filter(c => c.earned);
  const lockedCerts = certificates.filter(c => !c.earned);

  return (
    <MainLayout currentPage="certificates">
      <main className="certificates-page" style={{ padding: 'var(--space-8) var(--space-6)', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-2)' }}>
          <Award size={32} style={{ color: 'var(--color-primary-500)' }} />
          <h1 style={{ fontSize: 'var(--text-3xl)' }}>Your Certificates</h1>
        </div>
        <p style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-8)' }}>
          Certificates of completion for learning paths you have mastered.
        </p>

        {/* Premium Banner for free users */}
        {user.tier !== 'premium' && user.role !== 'admin' && (
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(239, 68, 68, 0.05))', 
            border: '1px solid rgba(245, 158, 11, 0.3)', 
            borderRadius: 'var(--radius-lg)', 
            padding: 'var(--space-4) var(--space-6)', 
            marginBottom: 'var(--space-8)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)'
          }}>
            <Lock size={24} style={{ color: '#f59e0b' }} />
            <div>
              <div style={{ fontWeight: 700, color: '#f59e0b', marginBottom: '4px' }}>Premium Required to Claim</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Upgrade to Premium to download and share your certificates of completion.</div>
            </div>
          </div>
        )}

        {earnedCerts.length === 0 && (
          <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-8)', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)', marginBottom: 'var(--space-8)' }}>
            <Award size={64} style={{ color: 'var(--text-tertiary)', margin: '0 auto var(--space-4)', opacity: 0.5 }} />
            <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>No Certificates Yet</h2>
            <p style={{ color: 'var(--text-tertiary)' }}>Complete learning paths to earn industry-recognized certificates.</p>
          </div>
        )}

        {earnedCerts.length > 0 && (
          <>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--color-primary-400)' }}>🏆 Earned Certificates</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-10)' }}>
              {earnedCerts.map(cert => (
                <div 
                  key={cert.id} 
                  onClick={() => window.location.href = `/modules/${cert.slug}`}
                  style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(16, 185, 129, 0.3)', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(16, 185, 129, 0.15)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ padding: 'var(--space-8)', textAlign: 'center', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)', borderBottom: '1px solid var(--border-primary)' }}>
                    <div style={{ width: '56px', height: '56px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
                      <Award size={28} style={{ color: '#10b981' }} />
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>Certificate of Completion</div>
                    <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>{cert.path}</h3>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>Awarded to</div>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-primary-400)', marginTop: 'var(--space-1)' }}>{user.display_name || user.username}</div>
                  </div>
                  <div style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                      <div>Issued: {cert.date}</div>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>Click to view path →</div>
                    </div>
                    <button 
                      onClick={(e) => handleDownload(e, cert)} 
                      className="btn btn-outline" 
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)' }}
                    >
                      {user.tier === 'premium' || user.role === 'admin' ? <><Download size={14}/> Download</> : <><Lock size={14}/> Premium</>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {lockedCerts.length > 0 && (
          <>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--text-secondary)' }}>🔒 Locked Certificates</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 'var(--space-6)' }}>
              {lockedCerts.map(cert => (
                <div 
                  key={cert.id} 
                  onClick={() => window.location.href = `/modules/${cert.slug}`}
                  style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-primary)', padding: 'var(--space-6)', opacity: 0.65, display: 'flex', alignItems: 'center', gap: 'var(--space-4)', cursor: 'pointer' }}
                >
                  <div style={{ width: '52px', height: '52px', background: 'var(--bg-tertiary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Lock size={22} style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '4px' }}>{cert.path}</h3>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Complete this path to unlock • Click to explore modules →</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    </MainLayout>
  );
}
