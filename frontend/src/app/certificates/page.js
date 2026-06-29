'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import { useI18n } from '../../context/I18nContext';
import { Award, Download, Lock } from 'lucide-react';

export default function CertificatesPage() {
  const { t } = useI18n();
  const [user, setUser] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('mayleneee-user');
    const token = localStorage.getItem('mayleneee-token');
    
    if (userStr && token) {
      try {
        const u = JSON.parse(userStr);
        setUser(u);
        
        // Fetch paths progress to determine certificates
        // In a real app, the backend should generate a unique certificate ID and date.
        // For now, we will simulate this based on 100% progress.
        
        fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/v1/users/${u.id}/progress`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
          // Mocking paths based on user progress
          // Assuming user needs 100 points for coding, 200 for asd, 300 for hacking.
          const pts = data.total_points || 0;
          
          const certs = [
            { id: 'CERT-C123', path: 'Coding Basics', date: '2025-10-12', earned: pts >= 100, category: 'coding' },
            { id: 'CERT-A456', path: 'Algorithm & Data Structure', date: '2025-11-05', earned: pts >= 200, category: 'asd' },
            { id: 'CERT-H789', path: 'Web Penetration Testing', date: '2026-01-20', earned: pts >= 300, category: 'hacking' }
          ];
          
          setCertificates(certs);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch certificates:", err);
          setLoading(false);
        });

      } catch (e) {
        console.error("Invalid user data");
      }
    } else {
      window.location.href = '/login';
    }
  }, []);

  function handleDownload(e, cert) {
    e.stopPropagation(); // Prevent routing to modules when clicking download
    if (user.tier !== 'premium' && user.tier !== 'admin' && user.role !== 'admin') {
      alert("Premium Required: You must upgrade to a premium account to claim and download certificates.");
      return;
    }
    alert(`Downloading Certificate ${cert.id} for ${cert.path}...`);
    // Logic to generate and download PDF goes here
  }

  if (loading || !user) return null;

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

        {earnedCerts.length === 0 && (
          <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-8)', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)', marginBottom: 'var(--space-8)' }}>
            <Award size={64} style={{ color: 'var(--text-tertiary)', margin: '0 auto var(--space-4)', opacity: 0.5 }} />
            <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>No Certificates Yet</h2>
            <p style={{ color: 'var(--text-tertiary)' }}>Complete learning paths to earn industry-recognized certificates.</p>
          </div>
        )}

        {earnedCerts.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-10)' }}>
            {earnedCerts.map(cert => (
              <div 
                key={cert.id} 
                onClick={() => window.location.href = `/modules`} 
                style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: 'var(--shadow-md)' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ padding: 'var(--space-8)', textAlign: 'center', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)', borderBottom: '1px solid var(--border-primary)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>Certificate of Completion</div>
                  <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>{cert.path}</h3>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>Presented to</div>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-primary-400)', marginTop: 'var(--space-1)' }}>{user.display_name || user.username}</div>
                </div>
                <div style={{ padding: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                    <div>Issued: {cert.date}</div>
                    <div>ID: {cert.id}</div>
                  </div>
                  <button onClick={(e) => handleDownload(e, cert)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {user.tier === 'premium' || user.role === 'admin' ? <Download size={16} /> : <Lock size={16} />} 
                    {user.tier === 'premium' || user.role === 'admin' ? 'Download' : 'Claim (Premium)'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)', color: 'var(--text-secondary)' }}>Locked Certificates</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-6)' }}>
          {lockedCerts.map(cert => (
            <div key={cert.id} style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-primary)', padding: 'var(--space-6)', opacity: 0.6, display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--bg-tertiary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={20} style={{ color: 'var(--text-tertiary)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>{cert.path}</h3>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Reach 100% completion to unlock</div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </MainLayout>
  );
}
