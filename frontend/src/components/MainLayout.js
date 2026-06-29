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
      </div>
    </div>
  );
}
