'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '../context/I18nContext';
import ThemeToggle from './ThemeToggle';

import { ChevronDown, Globe, Menu, LogOut, Search, Coins } from 'lucide-react';

export default function Navbar({ toggleSidebar }) {
  const { t, locale, setLocale, supportedLocales, currentLocale } = useI18n();
  const [langOpen, setLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [coins, setCoins] = useState(0);
  const langRef = useRef(null);
  const router = useRouter();

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

  // Fetch coins
  useEffect(() => {
    const userStr = localStorage.getItem('mayleneee-user');
    const token = localStorage.getItem('mayleneee-token');
    if (userStr && token) {
      try {
        const u = JSON.parse(userStr);
        fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/v1/users/${u.id}/progress`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
          if (data && data.coins !== undefined) {
            setCoins(data.coins);
          }
        })
        .catch(() => {});
      } catch (e) {}
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem('mayleneee-token');
    localStorage.removeItem('mayleneee-user');
    window.location.href = '/login';
  }

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/modules?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner" style={{ justifyContent: 'space-between', width: '100%' }}>
        
        {/* Left: Hamburger & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flex: 1 }}>
          <button 
            className="btn btn-ghost btn-icon hamburger-btn"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <Menu size={24} />
          </button>
          
          <form onSubmit={handleSearch} style={{ position: 'relative', maxWidth: '300px', width: '100%', display: 'none' }} className="desktop-search">
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}>
              <Search size={16} />
            </span>
            <input 
              type="text" 
              placeholder={t('nav.search') || 'Search modules...'} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 16px 8px 36px',
                borderRadius: '20px',
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
          </form>
        </div>

        {/* Right Actions */}
        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          
          {/* Coins Display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.1)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <Coins size={16} color="#f59e0b" />
            <span style={{ fontWeight: 700, color: '#f59e0b', fontSize: '0.9rem' }}>{coins}</span>
          </div>

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
              <span className="lang-flag">{currentLocale?.flag || 'EN'}</span>
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
                      // Force reload to apply translations if needed (fixes cache bug)
                      window.location.reload();
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
