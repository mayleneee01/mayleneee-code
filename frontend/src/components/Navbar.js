'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '../context/I18nContext';
import ThemeToggle from './ThemeToggle';

import { ChevronDown, Globe, Terminal, Book, Trophy, LayoutDashboard, LogOut } from 'lucide-react';

export default function Navbar({ currentPage = 'dashboard' }) {
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

  const navLinks = [
    { key: 'dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} strokeWidth={2} />, label: t('nav.dashboard') },
    { key: 'paths', href: '/modules', icon: <Book size={18} strokeWidth={2} />, label: t('nav.paths') },
    { key: 'labs', href: '/modules', icon: <Terminal size={18} strokeWidth={2} />, label: t('nav.labs') },
    { key: 'leaderboard', href: '/dashboard', icon: <Trophy size={18} strokeWidth={2} />, label: t('nav.leaderboard') },
  ];

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Brand */}
        <Link href="/" className="navbar-brand" id="navbar-brand">
          <span>Mayleneee<span className="navbar-brand-dot">.code</span></span>
        </Link>

        {/* Navigation Links */}
        <ul className="navbar-nav" role="menubar">
          {navLinks.map((link) => (
            <li key={link.key} role="none">
              <a
                href={link.href}
                className={`navbar-link ${currentPage === link.key ? 'active' : ''}`}
                role="menuitem"
                aria-current={currentPage === link.key ? 'page' : undefined}
                id={`nav-link-${link.key}`}
              >
                {link.icon}
                <span>{link.label}</span>
              </a>
            </li>
          ))}
        </ul>

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
              <span>{currentLocale.flag}</span>
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
