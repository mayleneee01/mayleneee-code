'use client';

import { useState, useEffect, useRef } from 'react';
import { useI18n } from '../context/I18nContext';

import { Maximize, RefreshCw } from 'lucide-react';

// Simulated terminal output sequence
const DEMO_LINES = [
  { type: 'prompt', user: 'user@lab', path: '~', command: 'nmap -sV -sC 10.10.10.40' },
  { type: 'output', text: 'Starting Nmap 7.94 ( https://nmap.org )' },
  { type: 'output', text: 'Nmap scan report for 10.10.10.40' },
  { type: 'output', text: 'Host is up (0.032s latency).' },
  { type: 'output', text: '' },
  { type: 'output', text: 'PORT    STATE SERVICE      VERSION' },
  { type: 'output', text: '22/tcp  open  ssh          OpenSSH 7.6p1' },
  { type: 'output', text: '80/tcp  open  http         Apache/2.4.29' },
  { type: 'output', text: '443/tcp open  ssl/http     Apache/2.4.29' },
  { type: 'output', text: '' },
  { type: 'prompt', user: 'user@lab', path: '~', command: 'gobuster dir -u http://10.10.10.40 -w /usr/share/wordlists/common.txt' },
  { type: 'output', text: '===============================================================' },
  { type: 'output', text: 'Gobuster v3.6' },
  { type: 'output', text: '===============================================================' },
  { type: 'output', text: '/admin               (Status: 301) [Size: 314]' },
  { type: 'output', text: '/uploads             (Status: 301) [Size: 316]' },
  { type: 'output', text: '/config              (Status: 403) [Size: 277]' },
  { type: 'output', text: '' },
  { type: 'prompt', user: 'user@lab', path: '~', command: '' },
];

export default function LabTerminal({ labName = 'HTB: Blue', status = 'connected' }) {
  const { t } = useI18n();
  const [lines, setLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const bodyRef = useRef(null);

  // Simulate terminal output typing effect
  useEffect(() => {
    if (currentLineIndex >= DEMO_LINES.length) return;

    const delay = DEMO_LINES[currentLineIndex].type === 'prompt' ? 800 : 120;
    const timer = setTimeout(() => {
      setLines((prev) => [...prev, DEMO_LINES[currentLineIndex]]);
      setCurrentLineIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentLineIndex]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines]);

  function handleReset() {
    setLines([]);
    setCurrentLineIndex(0);
  }

  const statusText = status === 'connected' ? t('lab.connected') : t('lab.disconnected');

  return (
    <div className="terminal-container" id="lab-terminal">
      {/* Title Bar */}
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="terminal-dot terminal-dot-red" />
          <span className="terminal-dot terminal-dot-yellow" />
          <span className="terminal-dot terminal-dot-green" />
        </div>
        <span className="terminal-title">{labName} -- bash</span>
        <div className="terminal-actions">
          <button
            className="password-toggle"
            onClick={handleReset}
            aria-label={t('lab.resetLab')}
            title={t('lab.resetLab')}
            style={{ color: '#8b949e' }}
            id="terminal-reset-btn"
          >
            <RefreshCw size={14} />
          </button>
          <button
            className="password-toggle"
            aria-label="Maximize"
            style={{ color: '#8b949e' }}
            id="terminal-maximize-btn"
          >
            <Maximize size={14} />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="terminal-body" ref={bodyRef} style={{ maxHeight: '360px', overflowY: 'auto' }}>
        {lines.map((line, i) => (
          <div key={i} className="terminal-line">
            {line.type === 'prompt' ? (
              <>
                <span className="terminal-prompt">{line.user}:{line.path}$ </span>
                <span className="terminal-command">{line.command}</span>
                {i === lines.length - 1 && line.command === '' && (
                  <span className="terminal-cursor" />
                )}
              </>
            ) : (
              <span className="terminal-output">{line.text}</span>
            )}
          </div>
        ))}
        {lines.length === 0 && (
          <div className="terminal-line">
            <span className="terminal-prompt">user@lab:~$ </span>
            <span className="terminal-cursor" />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="terminal-status">
        <div className="terminal-status-left">
          <span
            className="terminal-status-indicator"
            style={{
              backgroundColor: status === 'connected'
                ? 'var(--color-success-400)'
                : 'var(--color-danger-400)',
            }}
          />
          <span>{statusText}</span>
        </div>
        <span>UTF-8 | bash | {labName}</span>
      </div>
    </div>
  );
}
