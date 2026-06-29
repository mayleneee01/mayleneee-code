'use client';

import { useI18n } from '../context/I18nContext';
import Navbar from '../components/Navbar';

function IconCode() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconTerminal() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}

function IconTrophy() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function HomePage() {
  const { t } = useI18n();

  const features = [
    {
      icon: <IconTerminal />,
      title: 'Interactive Labs',
      description: 'Sandboxed cloud terminals for hands-on coding and hacking challenges. No setup required.',
      color: 'var(--color-primary-600)',
      bg: 'var(--color-primary-50)',
    },
    {
      icon: <IconCode />,
      title: 'Structured Curriculum',
      description: 'From HTML basics to Rust, Go, and advanced algorithms. University-standard ASD modules in C++.',
      color: 'var(--color-accent-600)',
      bg: 'var(--color-accent-50)',
    },
    {
      icon: <IconShield />,
      title: 'Ethical Hacking',
      description: 'Real-world penetration testing labs. Web exploitation, privilege escalation, and network security.',
      color: 'var(--color-success-600)',
      bg: 'var(--color-success-50)',
    },
    {
      icon: <IconTrophy />,
      title: 'Gamified Learning',
      description: 'Competitive leaderboards, point-based progression, and tiered hint system to keep you engaged.',
      color: 'var(--color-primary-600)',
      bg: 'var(--color-primary-50)',
    },
  ];

  return (
    <>
      <Navbar currentPage="" />
      <main>
        {/* Hero Section */}
        <section style={{
          minHeight: 'calc(100vh - var(--navbar-height))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-12) var(--space-6)',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-secondary)',
        }}>
          {/* Subtle gradient orbs */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-20%',
            left: '-10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div className="container animate-fade-in" style={{ textAlign: 'center', maxWidth: '800px', position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-1) var(--space-4)',
              backgroundColor: 'var(--color-primary-50)',
              color: 'var(--color-primary-700)',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              marginBottom: 'var(--space-6)',
              border: '1px solid var(--color-primary-100)',
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-success-500)',
                display: 'inline-block',
              }} />
              Platform is live
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-6)',
            }}>
              Learn to <span style={{ color: 'var(--color-primary-500)' }}>Code</span> and{' '}
              <span style={{ color: 'var(--color-success-500)' }}>Hack</span><br />
              by Actually Doing It
            </h1>

            <p style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto var(--space-8)',
              lineHeight: 'var(--leading-relaxed)',
            }}>
              Hands-on labs, interactive terminals, and structured learning paths.
              No more passive tutorials. Build real skills through practice.
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/login" className="btn btn-primary btn-lg" id="hero-get-started">
                Get Started Free
                <IconArrowRight />
              </a>
              <a href="/dashboard" className="btn btn-ghost btn-lg" id="hero-view-demo">
                View Dashboard
              </a>
            </div>

            {/* Trust indicators */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'var(--space-8)',
              marginTop: 'var(--space-12)',
              flexWrap: 'wrap',
            }}>
              {[
                { value: '10,000+', label: 'Active Learners' },
                { value: '100+', label: 'Modules' },
                { value: '50+', label: 'Hacking Labs' },
              ].map((item, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                  }}>
                    {item.value}
                  </div>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-tertiary)',
                  }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={{
          padding: 'var(--space-20) var(--space-6)',
          backgroundColor: 'var(--bg-primary)',
        }}>
          <div className="container" style={{ maxWidth: 'var(--container-max)' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
              <h2 style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                marginBottom: 'var(--space-3)',
              }}>
                Everything You Need to Level Up
              </h2>
              <p style={{
                fontSize: 'var(--text-base)',
                color: 'var(--text-secondary)',
                maxWidth: '500px',
                margin: '0 auto',
              }}>
                A complete platform designed for serious learners who want practical skills, not just certificates.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 'var(--space-6)',
            }} className="stagger-children">
              {features.map((feature, i) => (
                <div key={i} className="card" id={`feature-card-${i}`}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: 'var(--radius-xl)',
                    backgroundColor: feature.bg,
                    color: feature.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-4)',
                  }}>
                    {feature.icon}
                  </div>
                  <h3 className="card-title">{feature.title}</h3>
                  <p className="card-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          padding: 'var(--space-16) var(--space-6)',
          backgroundColor: 'var(--bg-secondary)',
          textAlign: 'center',
        }}>
          <div className="container" style={{ maxWidth: '600px' }}>
            <h2 style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              marginBottom: 'var(--space-4)',
            }}>
              Ready to Start?
            </h2>
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-8)',
              lineHeight: 'var(--leading-relaxed)',
            }}>
              Join thousands of learners mastering coding and cybersecurity
              through hands-on practice. Free tier available.
            </p>
            <a href="/login" className="btn btn-success btn-lg" id="cta-signup">
              Create Free Account
              <IconArrowRight />
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: 'var(--space-8) var(--space-6)',
          borderTop: '1px solid var(--border-primary)',
          backgroundColor: 'var(--bg-primary)',
        }}>
          <div className="container" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
          }}>
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-tertiary)',
            }}>
              2026 Mayleneee.code. All rights reserved.
            </div>
            <div style={{
              display: 'flex',
              gap: 'var(--space-6)',
              fontSize: 'var(--text-sm)',
            }}>
              <a href="/privacy" style={{ color: 'var(--text-tertiary)' }}>Privacy</a>
              <a href="/terms" style={{ color: 'var(--text-tertiary)' }}>Terms</a>
              <a href="/contact" style={{ color: 'var(--text-tertiary)' }}>Contact</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
