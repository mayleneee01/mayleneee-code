'use client';

import Link from 'next/link';
import { useI18n } from '../context/I18nContext';
import { Book, Terminal, Trophy, LayoutDashboard, User, Award, X, ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Sidebar({ isOpen, setIsOpen, currentPage }) {
  const { t } = useI18n();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('mayleneee-user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (e) {}
    }
  }, []);

  const navLinks = [
    { key: 'dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} />, label: t('nav.dashboard') || 'Dashboard' },
    { key: 'paths', href: '/modules', icon: <Book size={20} />, label: t('nav.paths') || 'Modules' },
    { key: 'labs', href: '/labs', icon: <Terminal size={20} />, label: t('nav.labs') || 'Labs' },
    { key: 'leaderboard', href: '/dashboard', icon: <Trophy size={20} />, label: t('nav.leaderboard') || 'Leaderboard' },
    { key: 'profile', href: '/profile', icon: <User size={20} />, label: 'Profile' },
    { key: 'certificates', href: '/certificates', icon: <Award size={20} />, label: 'Certificates' },
  ];

  if (isAdmin) {
    navLinks.push({ key: 'admin', href: '/admin', icon: <ShieldAlert size={20} />, label: 'Admin Panel' });
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsOpen(false)}></div>
      )}
      
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link href="/dashboard" className="sidebar-brand">
            <span style={{ fontSize: '24px', fontWeight: '800' }}>Mayleneee<span style={{ color: 'var(--color-primary-500)' }}>.code</span></span>
          </Link>
          <button className="sidebar-close-btn" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {navLinks.map((link) => (
              <li key={link.key}>
                <Link 
                  href={link.href}
                  className={`sidebar-link ${currentPage === link.key ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="sidebar-icon">{link.icon}</span>
                  <span className="sidebar-label">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
