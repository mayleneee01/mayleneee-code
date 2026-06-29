'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '../context/I18nContext';
import ThemeToggle from './ThemeToggle';

import { ChevronDown, Globe, Menu, LogOut } from 'lucide-react';

export default function Navbar({ toggleSidebar }) {
  const { t, locale, setLocale, supportedLocales, currentLocale } = useI18n();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem('mayleneee-token');
    localStorage.removeItem('mayleneee-user');
    window.location.href = '/login';
  }

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner" style={{ justifyContent: 'space-between' }}>
        
        {/* Left: Hamburger & Brand (if Sidebar hidden) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <button 
            className="btn btn-ghost btn-icon hamburger-btn"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Language Selector */}
          <div className="lang-selector" ref={langRef}>
            <button
              className="lang-selector-btn"
              onClick={() => setLangOpen(!langOpen)}
              aria-expanded={langOpen}
              aria-haspopup="listbox"
              id="lang-selector-btn"
            >
              <Globe size={16} strokeWidth={2} />
              <span className="lang-flag">{currentLocale.flag}</span>
              <ChevronDown size={14} strokeWidth={2} />
            </button>

            {langOpen && (
              <div className="lang-dropdown" role="listbox" aria-label={t('language.select')}>
                {supportedLocales.map((loc) => (
                  <button
                    key={loc.code}
                    className={`lang-option ${locale === loc.code ? 'active' : ''}`}
                    onClick={() => {
                      setLocale(loc.code);
                      setLangOpen(false);
                    }}
                    role="option"
                    aria-selected={locale === loc.code}
                    id={`lang-option-${loc.code}`}
                  >
                    <span style={{ fontWeight: 600, minWidth: '28px' }}>{loc.flag}</span>
                    <span>{loc.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Avatar / Logout */}
          <button
            className="btn btn-ghost btn-icon"
            onClick={handleLogout}
            aria-label={t('nav.logout')}
            title={t('nav.logout')}
            id="navbar-logout-btn"
          >
            <LogOut size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    </nav>
  );
}
