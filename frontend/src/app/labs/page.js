'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import LabTerminal from '../../components/LabTerminal';
import { useI18n } from '../../context/I18nContext';
import { Terminal as TerminalIcon, Server, Shield, Activity } from 'lucide-react';

export default function GlobalLabsPage() {
  const { t } = useI18n();
  const [activeLab, setActiveLab] = useState('htb-blue');

  const labInstances = [
    { id: 'htb-blue', name: 'Pwnbox: Blue', type: 'hacking', ip: '10.10.10.40', status: 'online' },
    { id: 'htb-lame', name: 'Pwnbox: Lame', type: 'hacking', ip: '10.10.10.3', status: 'online' },
    { id: 'dev-python', name: 'DevBox: Python Core', type: 'coding', status: 'offline' },
  ];

  return (
    <MainLayout currentPage="labs">
      <main className="labs-page" style={{ height: 'calc(100vh - var(--navbar-height))', display: 'flex', flexDirection: 'column' }}>
        
        {/* Lab Header Controls */}
        <div style={{ padding: 'var(--space-4) var(--space-6)', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Server size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Global Lab Environment</h1>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Select an instance to connect</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
            <select 
              className="form-input" 
              style={{ width: '250px', background: 'var(--bg-tertiary)' }}
              value={activeLab}
              onChange={(e) => setActiveLab(e.target.value)}
            >
              {labInstances.map(lab => (
                <option key={lab.id} value={lab.id}>
                  {lab.name} {lab.ip ? `(${lab.ip})` : ''}
                </option>
              ))}
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Connected</span>
            </div>
          </div>
        </div>

        {/* Terminal Area */}
        <div style={{ flex: 1, padding: 'var(--space-6)', background: 'var(--bg-primary)' }}>
          <div style={{ height: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-xl)' }}>
            {activeLab.startsWith('htb') ? (
              <LabTerminal lab={{ title: labInstances.find(l => l.id === activeLab)?.name }} category="hacking" />
            ) : (
              <LabTerminal lab={{ title: labInstances.find(l => l.id === activeLab)?.name }} category="coding" />
            )}
          </div>
        </div>

      </main>
    </MainLayout>
  );
}
