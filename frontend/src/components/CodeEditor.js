'use client';

import { useState } from 'react';
import { Play, CheckCircle, XCircle } from 'lucide-react';

export default function CodeEditor({ initialCode, language = 'javascript', expectedAnswer, onSolve }) {
  // initialCode should contain a placeholder string like "___ANSWER___" where the input goes.
  const parts = initialCode.split('___ANSWER___');
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'correct', 'incorrect'

  const handleRun = () => {
    if (answer.trim() === expectedAnswer) {
      setStatus('correct');
      if (onSolve) onSolve();
    } else {
      setStatus('incorrect');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--bg-code)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      
      {/* Editor Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-2) var(--space-4)', backgroundColor: 'var(--bg-overlay)', borderBottom: '1px solid var(--border-secondary)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
        </div>
        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', fontFamily: 'monospace' }}>main.{language === 'go' ? 'go' : 'js'}</span>
        <button 
          onClick={handleRun}
          className="btn btn-primary"
          style={{ padding: '4px 12px', fontSize: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '4px', alignItems: 'center' }}
        >
          <Play size={12} fill="currentColor" /> Run Code
        </button>
      </div>

      {/* Editor Body */}
      <div style={{ flexGrow: 1, padding: 'var(--space-4)', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.875rem', color: '#e2e8f0', lineHeight: 1.6 }}>
        {parts.length === 2 ? (
          <>
            <span style={{ whiteSpace: 'pre-wrap' }}>{parts[0]}</span>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: status === 'incorrect' ? '1px solid var(--color-danger-500)' : status === 'correct' ? '1px solid var(--color-success-500)' : '1px solid var(--color-primary-500)',
                color: status === 'correct' ? 'var(--color-success-400)' : '#fff',
                padding: '2px 8px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                outline: 'none',
                minWidth: '150px',
                transition: 'all 0.2s',
              }}
              placeholder="Type your fix here..."
            />
            <span style={{ whiteSpace: 'pre-wrap' }}>{parts[1]}</span>
          </>
        ) : (
          <span style={{ whiteSpace: 'pre-wrap' }}>{initialCode}</span>
        )}
      </div>

      {/* Output Console */}
      <div style={{ height: '120px', backgroundColor: '#0d1117', borderTop: '1px solid var(--border-secondary)', padding: 'var(--space-2) var(--space-4)', display: 'flex', flexDirection: 'column' }}>
        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>Console Output</span>
        
        {status === 'idle' && (
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontFamily: 'monospace' }}>Waiting for compilation...</span>
        )}
        
        {status === 'incorrect' && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--color-danger-400)' }}>
            <XCircle size={16} style={{ marginTop: '2px' }} />
            <span style={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>Compilation Error: Invalid syntax or insecure implementation detected. Try again.</span>
          </div>
        )}

        {status === 'correct' && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--color-success-400)' }}>
            <CheckCircle size={16} style={{ marginTop: '2px' }} />
            <span style={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>Success! Code compiled successfully. Vulnerability patched.</span>
          </div>
        )}
      </div>

    </div>
  );
}
