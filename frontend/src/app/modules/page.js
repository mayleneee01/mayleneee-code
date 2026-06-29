'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { useI18n } from '../../context/I18nContext';
import { Book, Code, Shield, Brain } from 'lucide-react';

export default function ModulesPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('coding');
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/v1/modules`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setModules(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch modules:", err);
        setLoading(false);
      });
  }, []);

  const tabs = [
    { id: 'coding', label: 'Pemrograman Bahasa', icon: <Code size={18} /> },
    { id: 'asd', label: 'Algoritma & Struktur Data (ASD)', icon: <Brain size={18} /> },
    { id: 'hacking', label: 'Keamanan Siber (Hacking)', icon: <Shield size={18} /> },
  ];

  const filteredModules = modules.filter(m => m.category === activeTab);

  return (
    <>
      <Navbar currentPage="paths" />
      <main className="modules-page" style={{ padding: 'var(--space-8) var(--space-6)', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>Katalog Belajar</h1>
        <p style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-8)' }}>Pilih jalur belajarmu dan mulailah beraksi.</p>

        <div style={{ display: 'flex', gap: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--space-6)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-4)',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--color-primary-500)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--color-primary-500)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 600 : 400,
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Memuat katalog...</p>
        ) : filteredModules.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--text-tertiary)', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
            <Book size={48} style={{ opacity: 0.5, marginBottom: 'var(--space-4)' }} />
            <p>Belum ada modul yang tersedia di kategori ini.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
            {filteredModules.map((module) => (
              <Link href={`/modules/${module.id}`} key={module.id} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-5)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>{module.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', flexGrow: 1 }}>{module.description}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-primary-600)', background: 'var(--color-primary-100)', padding: '2px 8px', borderRadius: '12px' }}>
                      {module.difficulty}
                    </span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                      {module.pointsReward} Poin
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
