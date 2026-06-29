'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { Settings, Plus, LayoutList, TerminalSquare, Search, Trash2, Edit } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('modules');
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Route Protection: Check if user is admin or super_admin
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    
    try {
      const user = JSON.parse(userStr);
      if (user.role === 'admin' || user.role === 'super_admin') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsAuthorized(true);
      } else {
        router.push('/dashboard');
      }
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  
  // Mock data for display
  const [modules] = useState([
    { id: 'web-fundamentals', title: 'Web Security Fundamentals', category: 'hacking', difficulty: 'beginner', isPublished: true },
    { id: 'sql-injection-mastery', title: 'SQL Injection Mastery', category: 'hacking', difficulty: 'intermediate', isPublished: true },
  ]);

  if (!isAuthorized) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader" style={{ width: '40px', height: '40px', borderWidth: '4px' }}></div>
      </div>
    );
  }

  return (
    <div className="layout">
      <Navbar currentPage="dashboard" />
      
      <main className="main-content" style={{ display: 'flex', gap: 'var(--space-8)', padding: 'var(--space-6)' }}>
        
        {/* Sidebar */}
        <aside style={{ width: '250px', flexShrink: 0 }}>
          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)', paddingLeft: 'var(--space-2)' }}>
              Admin Panel
            </h2>
            
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <button 
                onClick={() => setActiveTab('modules')}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-lg)', background: activeTab === 'modules' ? 'var(--color-primary-50)' : 'transparent', color: activeTab === 'modules' ? 'var(--color-primary-600)' : 'var(--text-secondary)', fontWeight: activeTab === 'modules' ? 600 : 500, border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
              >
                <LayoutList size={18} />
                Manage Modules
              </button>
              
              <button 
                onClick={() => setActiveTab('labs')}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-lg)', background: activeTab === 'labs' ? 'var(--color-primary-50)' : 'transparent', color: activeTab === 'labs' ? 'var(--color-primary-600)' : 'var(--text-secondary)', fontWeight: activeTab === 'labs' ? 600 : 500, border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
              >
                <TerminalSquare size={18} />
                Manage Labs
              </button>
              
              <button 
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-lg)', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 500, border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
              >
                <Settings size={18} />
                Settings
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <div style={{ flexGrow: 1 }}>
          <div className="card" style={{ padding: 'var(--space-6)', minHeight: '600px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {activeTab === 'modules' ? 'Modules' : 'Hands-on Labs'}
              </h1>
              <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-lg)' }}>
                <Plus size={18} />
                <span>Create New</span>
              </button>
            </div>

            <div className="input-wrapper" style={{ marginBottom: 'var(--space-6)', maxWidth: '400px' }}>
              <span className="input-icon-left"><Search size={18} strokeWidth={2} /></span>
              <input type="text" placeholder={`Search ${activeTab}...`} className="input" />
            </div>

            {/* Table Mockup */}
            <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-secondary)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ backgroundColor: 'var(--color-gray-50)', borderBottom: '1px solid var(--border-secondary)' }}>
                  <tr>
                    <th style={{ padding: 'var(--space-4)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>ID</th>
                    <th style={{ padding: 'var(--space-4)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Title</th>
                    <th style={{ padding: 'var(--space-4)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</th>
                    <th style={{ padding: 'var(--space-4)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                    <th style={{ padding: 'var(--space-4)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map(mod => (
                    <tr key={mod.id} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                      <td style={{ padding: 'var(--space-4)', fontSize: '0.875rem', fontFamily: 'monospace' }}>{mod.id}</td>
                      <td style={{ padding: 'var(--space-4)', fontSize: '0.875rem', fontWeight: 500 }}>{mod.title}</td>
                      <td style={{ padding: 'var(--space-4)', fontSize: '0.875rem', textTransform: 'capitalize' }}>{mod.category}</td>
                      <td style={{ padding: 'var(--space-4)', fontSize: '0.875rem' }}>
                        <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', backgroundColor: mod.isPublished ? 'var(--color-success-100)' : 'var(--color-gray-100)', color: mod.isPublished ? 'var(--color-success-700)' : 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: 600 }}>
                          {mod.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                        <button className="btn btn-ghost btn-icon" style={{ padding: 'var(--space-2)' }}><Edit size={16} /></button>
                        <button className="btn btn-ghost btn-icon" style={{ padding: 'var(--space-2)', color: 'var(--color-danger-500)' }}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
