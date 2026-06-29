import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { I18nProvider } from '../context/I18nContext';

export const metadata = {
  title: 'Mayleneee.code — Interactive Coding & Hacking Platform',
  description: 'Master coding and ethical hacking through hands-on labs, structured modules, and gamified learning. From HTML basics to advanced penetration testing.',
  keywords: 'coding, hacking, ethical hacking, programming, learn to code, cybersecurity, CTF, penetration testing',
  authors: [{ name: 'Mayleneee.code' }],
  openGraph: {
    title: 'Mayleneee.code — Interactive Coding & Hacking Platform',
    description: 'Master coding and ethical hacking through hands-on labs.',
    type: 'website',
    locale: 'en_US',
  },
};

// Inline script to prevent FOUC (Flash of Unstyled Content) for theme
const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('mayleneee-theme');
      if (theme === 'dark' || theme === 'light') {
        document.documentElement.setAttribute('data-theme', theme);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } catch(e) {}
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        {/*
          Security headers (CSP, X-Frame-Options, X-Content-Type-Options)
          are enforced via HTTP response headers from the backend/reverse proxy.
          Setting CSP via <meta> breaks React dev mode (eval() required).
        */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <I18nProvider>
              {children}
            </I18nProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
