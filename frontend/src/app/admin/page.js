'use client';

import { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import { Shield, Plus, Users, Save, CheckCircle } from 'lucide-react';

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('modules');
  
  // Promotion State
  const [promoteUserId, setPromoteUserId] = useState('');
  const [promoteStatus, setPromoteStatus] = useState('');

  // Module State
  const [moduleForm, setModuleForm] = useState({
    id: '', title: '', description: '', category: 'coding', difficulty: 'beginner',
    access_tier: 'free', points_reward: 100, order_index: 1, is_published: true
  });
  const [moduleStatus, setModuleStatus] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('mayleneee-user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.role !== 'admin') {
          window.location.href = '/dashboard'; // Redirect non-admins
        } else {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setUser(u);
        }
      } catch (e) {
        window.location.href = '/login';
      }
    } else {
      window.location.href = '/login';
    }
  }, []);

  async function handlePromote(e) {
    e.preventDefault();
    setPromoteStatus('Promoting...');
    try {
      const token = localStorage.getItem('mayleneee-token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/v1/admin/users/${promoteUserId}/promote`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setPromoteStatus('User promoted successfully!');
        setPromoteUserId('');
      } else {
        const data = await res.json();
        setPromoteStatus(`Error: ${data.error}`);
      }
    } catch (err) {
      setPromoteStatus(`Error: ${err.message}`);
    }
    setTimeout(() => setPromoteStatus(''), 4000);
  }

  async function handleCreateModule(e) {
    e.preventDefault();
    setModuleStatus('Creating...');
    try {
      const token = localStorage.getItem('mayleneee-token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/v1/admin/modules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...moduleForm,
          points_reward: parseInt(moduleForm.points_reward, 10),
          order_index: parseInt(moduleForm.order_index, 10),
          is_published: moduleForm.is_published === 'true' || moduleForm.is_published === true
        })
      });
      if (res.ok) {
        setModuleStatus('Module created successfully!');
        setModuleForm({ ...moduleForm, id: '', title: '', description: '' }); // Reset text fields
      } else {
        const data = await res.json();
        setModuleStatus(`Error: ${data.error}`);
      }
    } catch (err) {
      setModuleStatus(`Error: ${err.message}`);
    }
    setTimeout(() => setModuleStatus(''), 4000);
  }

  if (!user) return null;

  return (
    <MainLayout currentPage="admin">
      <main className="admin-page" style={{ padding: 'var(--space-8) var(--space-6)', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-8)' }}>
          <Shield size={32} style={{ color: '#ef4444' }} />
          <div>
            <h1 style={{ fontSize: 'var(--text-3xl)' }}>Admin Control Panel</h1>
            <p style={{ color: 'var(--text-tertiary)' }}>Manage platform content and users.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
          <button className={`btn ${activeTab === 'modules' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('modules')}>
            <Plus size={16} /> Create Module
          </button>
          <button className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('users')}>
            <Users size={16} /> Promote User
          </button>
        </div>

        {activeTab === 'modules' && (
          <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-6)' }}>Create New Module</h2>
            <form onSubmit={handleCreateModule} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Module ID (e.g. m-htb-1)</label>
                <input className="form-input" required value={moduleForm.id} onChange={e => setModuleForm({...moduleForm, id: e.target.value})} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Title</label>
                <input className="form-input" required value={moduleForm.title} onChange={e => setModuleForm({...moduleForm, title: e.target.value})} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} required value={moduleForm.description} onChange={e => setModuleForm({...moduleForm, description: e.target.value})} />
              </div>
              
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input" value={moduleForm.category} onChange={e => setModuleForm({...moduleForm, category: e.target.value})}>
                  <option value="coding">Coding</option>
                  <option value="asd">Algorithm & Data Structures</option>
                  <option value="hacking">Hacking</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Difficulty</label>
                <select className="form-input" value={moduleForm.difficulty} onChange={e => setModuleForm({...moduleForm, difficulty: e.target.value})}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Points Reward</label>
                <input type="number" className="form-input" required value={moduleForm.points_reward} onChange={e => setModuleForm({...moduleForm, points_reward: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Order Index</label>
                <input type="number" className="form-input" required value={moduleForm.order_index} onChange={e => setModuleForm({...moduleForm, order_index: e.target.value})} />
              </div>

              <div style={{ gridColumn: '1 / -1', marginTop: 'var(--space-4)' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  <Save size={18} /> Create Module
                </button>
                {moduleStatus && <p style={{ marginTop: 'var(--space-4)', textAlign: 'center', color: moduleStatus.includes('Error') ? '#ef4444' : '#10b981' }}>{moduleStatus}</p>}
              </div>
            </form>
          </div>
        )}

        {activeTab === 'users' && (
          <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-6)' }}>Promote to Admin</h2>
            <p style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)' }}>Enter the User ID (UUID) of the user you want to grant admin privileges.</p>
            <form onSubmit={handlePromote}>
              <div className="form-group">
                <label className="form-label">User ID (UUID)</label>
                <input type="text" className="form-input" required value={promoteUserId} onChange={e => setPromoteUserId(e.target.value)} placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--space-2)' }}>
                Promote User
              </button>
              {promoteStatus && <p style={{ marginTop: 'var(--space-4)', color: promoteStatus.includes('Error') ? '#ef4444' : '#10b981' }}>{promoteStatus}</p>}
            </form>
          </div>
        )}

      </main>
    </MainLayout>
  );
}
