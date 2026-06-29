'use client';

import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';

import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={t('theme.toggle')}
      title={theme === 'light' ? t('theme.dark') : t('theme.light')}
      id="theme-toggle-btn"
    >
      <span className="theme-toggle-thumb">
        <span className="theme-toggle-icon">
          {theme === 'light' ? <Sun size={14} /> : <Moon size={14} />}
        </span>
      </span>
    </button>
  );
}
