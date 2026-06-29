'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const I18nContext = createContext(undefined);

const LOCALE_KEY = 'mayleneee-locale';
const DEFAULT_LOCALE = 'en';

const SUPPORTED_LOCALES = [
  { code: 'en', name: 'English', flag: 'EN' },
  { code: 'id', name: 'Bahasa Indonesia', flag: 'ID' },
  { code: 'ja', name: 'Japanese', flag: 'JA' },
  { code: 'ko', name: 'Korean', flag: 'KO' },
  { code: 'zh', name: 'Chinese', flag: 'ZH' },
  { code: 'es', name: 'Spanish', flag: 'ES' },
  { code: 'fr', name: 'French', flag: 'FR' },
  { code: 'de', name: 'German', flag: 'DE' },
  { code: 'pt', name: 'Portuguese', flag: 'PT' },
  { code: 'ar', name: 'Arabic', flag: 'AR' },
  { code: 'hi', name: 'Hindi', flag: 'HI' },
  { code: 'ru', name: 'Russian', flag: 'RU' },
];

// Translation cache to avoid re-fetching
const translationCache = {};

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);

  async function loadTranslations(loc) {
    if (translationCache[loc]) {
      setTranslations(translationCache[loc]);
      return;
    }

    try {
      const res = await fetch(`/locales/${loc}.json`);
      if (!res.ok) throw new Error(`Failed to load ${loc} translations`);
      const data = await res.json();
      translationCache[loc] = data;
      setTranslations(data);
    } catch (err) {
      console.error(`Failed to load translations for ${loc}:`, err);
      // Fallback to English
      if (loc !== DEFAULT_LOCALE) {
        await loadTranslations(DEFAULT_LOCALE);
      }
    }
  }

  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_KEY);
    const initial = stored && SUPPORTED_LOCALES.some(l => l.code === stored)
      ? stored
      : DEFAULT_LOCALE;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocaleState(initial);
    loadTranslations(initial).finally(() => setLoading(false));
  }, []);

  const setLocale = useCallback(async (newLocale) => {
    if (!SUPPORTED_LOCALES.some(l => l.code === newLocale)) return;
    setLoading(true);
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_KEY, newLocale);
    await loadTranslations(newLocale);
    setLoading(false);
  }, []);

  // Translation function with dot-notation key access and variable interpolation
  // Usage: t('auth.login.title') or t('auth.welcome', { name: 'User' })
  const t = useCallback((key, variables = {}) => {
    const keys = key.split('.');
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Return key as fallback (useful for development)
        return key;
      }
    }

    if (typeof value !== 'string') return key;

    // Replace {{variable}} patterns
    return value.replace(/\{\{(\w+)\}\}/g, (_, varName) => {
      return variables[varName] !== undefined ? String(variables[varName]) : `{{${varName}}}`;
    });
  }, [translations]);

  const currentLocale = SUPPORTED_LOCALES.find(l => l.code === locale) || SUPPORTED_LOCALES[0];

  return (
    <I18nContext.Provider value={{
      locale,
      setLocale,
      t,
      loading,
      supportedLocales: SUPPORTED_LOCALES,
      currentLocale,
    }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
