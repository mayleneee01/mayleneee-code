'use client';

import { useState, useEffect, use } from 'react';
import Navbar from '../../../components/Navbar';
import LabTerminal from '../../../components/LabTerminal';
import { useI18n } from '../../../context/I18nContext';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ModuleDetailPage({ params }) {
  const unwrappedParams = use(params);
  const moduleId = unwrappedParams.id;
  
  const { t } = useI18n();
  const [moduleInfo, setModuleInfo] = useState(null);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all modules to find this one
    fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/v1/modules`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const m = data.find(mod => mod.id === moduleId);
          setModuleInfo(m);
        }
      })
      .catch(err => console.error("Failed to fetch module details:", err));

    // Fetch labs for this module
    fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/v1/modules/${moduleId}/labs`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLabs(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch labs:", err);
        setLoading(false);
      });
  }, [moduleId]);

  if (loading) return <div>Memuat data modul...</div>;
  if (!moduleInfo) return <div>Modul tidak ditemukan.</div>;

  return (
    <>
      <Navbar currentPage="paths" />
      <main className="module-detail-page" style={{ padding: 'var(--space-8) var(--space-6)', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: 'var(--space-8)' }}>
        
        {/* Left Column: Module Info */}
        <div style={{ flex: '1', maxWidth: '400px' }}>
          <Link href="/modules" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-tertiary)', textDecoration: 'none', marginBottom: 'var(--space-6)' }}>
            <ArrowLeft size={16} /> Kembali ke Katalog
          </Link>

          <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>{moduleInfo.title}</h1>
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-primary-600)', background: 'var(--color-primary-100)', padding: '2px 8px', borderRadius: '12px' }}>
              {moduleInfo.category.toUpperCase()}
            </span>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-accent-600)', background: 'var(--color-accent-100)', padding: '2px 8px', borderRadius: '12px' }}>
              {moduleInfo.difficulty}
            </span>
          </div>

          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: 'var(--space-6)' }}>
            {moduleInfo.description}
          </p>

          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>Daftar Tantangan (Labs)</h3>
            {labs.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)' }}>Belum ada lab di modul ini.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {labs.map((lab, idx) => (
                  <li key={lab.id} style={{ padding: 'var(--space-3) 0', borderBottom: idx !== labs.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                    <div style={{ fontWeight: 600 }}>{idx + 1}. {lab.title}</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>{lab.description}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column: Lab Terminal */}
        <div style={{ flex: '2' }}>
          {labs.length > 0 ? (
            <LabTerminal lab={labs[0]} category={moduleInfo.category} />
          ) : (
            <div style={{ background: '#0a0a0a', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', color: 'var(--text-tertiary)', textAlign: 'center', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Terminal Offline (Tidak ada lab)
            </div>
          )}
        </div>

      </main>
    </>
  );
}
