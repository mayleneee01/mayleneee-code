'use client';

import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function MainLayout({ children, currentPage }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} currentPage={currentPage} />
      <div className={`app-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        {children}
        <div style={{
          position: 'fixed',
          bottom: '16px',
          right: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-tertiary)',
          fontSize: 'var(--text-xs)',
          zIndex: 40,
          pointerEvents: 'none'
        }}>
          <span>Powered by</span>
          <strong style={{ color: 'var(--color-primary-400)', letterSpacing: '1px' }}>Mayleneee.code</strong>
        </div>
      </div>
    </div>
  );
}
