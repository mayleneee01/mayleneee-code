'use client';

import { useState, useRef, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';
import { Maximize, RefreshCw, Play } from 'lucide-react';

export default function LabTerminal({ lab, category = 'hacking' }) {
  const { t } = useI18n();
  const [lines, setLines] = useState([
    { type: 'output', text: `Connected to Lab: ${lab?.title || 'Unknown'}` },
    { type: 'output', text: `Type your command and press Enter.` }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  
  const isCoding = category === 'coding' || category === 'pemrograman';

  // Auto-scroll to bottom
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines]);

  function handleReset() {
    setLines([
      { type: 'output', text: `Session reset for ${lab?.title || 'Lab'}.` }
    ]);
    setInputVal('');
  }

  async function execute(cmd) {
    if (!cmd.trim()) return;
    
    // Add command to history
    if (!isCoding) {
      setLines(prev => [...prev, { type: 'prompt', user: 'user@lab', path: '~', command: cmd }]);
    } else {
      setLines(prev => [...prev, { type: 'output', text: `Executing Code...` }]);
    }
    
    setInputVal('');
    setIsExecuting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/v1/labs/${lab.id}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: cmd,
          lab_type: isCoding ? 'programming' : 'hacking'
        })
      });
      const data = await res.json();
      
      const outputs = data.output ? data.output.split('\n') : [];
      
      setLines(prev => [
        ...prev,
        ...outputs.map(out => ({ type: 'output', text: out })),
        ...(data.success ? [{ type: 'output', text: 'Success! Flag accepted.' }] : [])
      ]);
    } catch (err) {
      setLines(prev => [...prev, { type: 'output', text: `Error: ${err.message}` }]);
    } finally {
      setIsExecuting(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey && !isCoding) {
      e.preventDefault();
      execute(inputVal);
    }
  }

  return (
    <div className="terminal-container" id="lab-terminal" onClick={() => !isCoding && inputRef.current?.focus()}>
      {/* Title Bar */}
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="terminal-dot terminal-dot-red" />
          <span className="terminal-dot terminal-dot-yellow" />
          <span className="terminal-dot terminal-dot-green" />
        </div>
        <span className="terminal-title">{lab?.title || 'Terminal'} -- {isCoding ? 'editor' : 'bash'}</span>
        <div className="terminal-actions">
          <button
            className="password-toggle"
            onClick={handleReset}
            aria-label="Reset Lab"
            title="Reset Lab"
            style={{ color: '#8b949e' }}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="terminal-body" ref={bodyRef} style={{ maxHeight: '360px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {lines.map((line, i) => (
          <div key={i} className="terminal-line">
            {line.type === 'prompt' ? (
              <>
                <span className="terminal-prompt">{line.user}:{line.path}$ </span>
                <span className="terminal-command">{line.command}</span>
              </>
            ) : (
              <span className="terminal-output" style={{ whiteSpace: 'pre-wrap' }}>{line.text}</span>
            )}
          </div>
        ))}

        {!isCoding && (
          <div className="terminal-line" style={{ display: 'flex' }}>
            <span className="terminal-prompt" style={{ marginRight: '8px' }}>user@lab:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isExecuting}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: 'var(--color-primary-100)',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                outline: 'none',
                padding: 0,
                width: '100%'
              }}
              autoComplete="off"
              spellCheck="false"
              autoFocus
            />
          </div>
        )}

        {isCoding && (
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <p style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)' }}>Isi kode yang hilang di bawah ini:</p>
            <textarea
              ref={inputRef}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={isExecuting}
              placeholder='Contoh: print("Hello World")'
              style={{
                flexGrow: 1,
                minHeight: '150px',
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '4px',
                color: '#e2e8f0',
                fontFamily: 'monospace',
                padding: 'var(--space-3)',
                resize: 'vertical'
              }}
            />
            <button 
              onClick={() => execute(inputVal)}
              disabled={isExecuting || !inputVal.trim()}
              style={{
                marginTop: 'var(--space-3)',
                alignSelf: 'flex-end',
                background: 'var(--color-primary-500)',
                color: 'white',
                border: 'none',
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 600
              }}
            >
              <Play size={16} /> Run Code
            </button>
          </div>
        )}

      </div>

      {/* Status Bar */}
      <div className="terminal-status">
        <div className="terminal-status-left">
          <span
            className="terminal-status-indicator"
            style={{ backgroundColor: 'var(--color-success-400)' }}
          />
          <span>{isExecuting ? 'Executing...' : 'Connected'}</span>
        </div>
        <span>UTF-8 | {isCoding ? 'python/go' : 'bash'} | {lab?.title || 'Unknown'}</span>
      </div>
    </div>
  );
}
