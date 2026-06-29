'use client';

import { useState } from 'react';
import Navbar from '../../../components/Navbar';
import LabTerminal from '../../../components/LabTerminal';
import CodeEditor from '../../../components/CodeEditor';
import { Flag, HelpCircle, ChevronLeft, Lightbulb } from 'lucide-react';
import Link from 'next/link';

export default function LabPage({ params }) {
  const [flag, setFlag] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCodeChallenge = params.id === 'secure-coding-go' || params.id === 'jwt-vulnerabilities';

  const mockCodeGo = `package main

import (
	"fmt"
	"net/http"
)

func handleRequest(w http.ResponseWriter, r *http.Request) {
	userInput := r.URL.Query().Get("name")
	
	// Vulnerable: Directly reflecting user input
	// Fix this by sanitizing or encoding the output
	fmt.Fprintf(w, "Hello, %s!", ___ANSWER___)
}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      if (flag.includes('HTB{')) {
        alert('Congratulations! Flag is correct.');
      } else {
        alert('Incorrect flag.');
      }
    }, 1000);
  };

  return (
    <div className="layout" style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Navbar currentPage="labs" />
      
      <main style={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* Left Sidebar: Instructions */}
        <aside style={{ width: '400px', flexShrink: 0, backgroundColor: 'var(--bg-card)', borderRight: '1px solid var(--border-secondary)', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-secondary)' }}>
            <Link href="/modules" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-tertiary)', fontSize: '0.875rem', textDecoration: 'none', marginBottom: 'var(--space-2)' }}>
              <ChevronLeft size={16} /> Back to Modules
            </Link>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Web Security Fundamentals
            </h1>
          </div>

          <div style={{ padding: 'var(--space-6)', flexGrow: 1, overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Lab Instructions</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
              {isCodeChallenge 
                ? "In this lab, you are reviewing source code that contains a critical vulnerability. Your objective is to patch the code by filling in the missing piece."
                : "In this lab, you have access to a target machine running a vulnerable web application. Your objective is to find the hidden flag by exploiting a common misconfiguration."}
            </p>
            
            {isCodeChallenge ? (
              <ul style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, paddingLeft: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                <li>Review the surrounding code context.</li>
                <li>Identify the injection or logical flaw.</li>
                <li>Provide the exact syntax needed to sanitize the input.</li>
              </ul>
            ) : (
              <ul style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, paddingLeft: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                <li>Enumerate open ports and services.</li>
                <li>Discover hidden directories.</li>
                <li>Gain administrative access to retrieve the flag.</li>
              </ul>
            )}

            <div style={{ backgroundColor: 'var(--color-primary-50)', border: '1px solid var(--color-primary-200)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-primary-700)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                <Lightbulb size={18} /> Pro Tip
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-primary-900)', margin: 0 }}>
                Always check the source code and common hidden files (like `robots.txt` or `.git`) when attacking a web application.
              </p>
            </div>
            
            {showHint ? (
               <div style={{ backgroundColor: 'var(--color-accent-50)', border: '1px solid var(--color-accent-200)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)' }}>
                 <p style={{ fontSize: '0.875rem', color: 'var(--color-accent-900)', margin: 0 }}>
                   <strong>Hint:</strong> {isCodeChallenge ? "Look into HTML encoding functions available in Go's standard library (e.g. html.EscapeString)." : "Have you tried looking into the `/admin` directory we found earlier? Default credentials might work."}
                 </p>
               </div>
            ) : (
              <button 
                onClick={() => setShowHint(true)}
                className="btn btn-ghost" style={{ width: '100%', marginBottom: 'var(--space-6)', border: '1px dashed var(--border-secondary)', padding: '1rem' }}
              >
                <HelpCircle size={16} /> Show Hint (-10 Points)
              </button>
            )}

          </div>

          <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--border-secondary)', backgroundColor: 'var(--bg-primary)' }}>
            <form onSubmit={handleSubmit}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>Submit Flag</label>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <div className="input-wrapper" style={{ flexGrow: 1 }}>
                  <span className="input-icon-left"><Flag size={16} strokeWidth={2} className="text-success-500" /></span>
                  <input
                    type="text"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    placeholder="HTB{...}"
                    className="input"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? '...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </aside>

        {/* Right Side: Terminal/Workspace */}
        <div style={{ flexGrow: 1, padding: 'var(--space-4)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flexGrow: 1, backgroundColor: 'var(--bg-code)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
             {isCodeChallenge ? (
               <CodeEditor 
                 initialCode={mockCodeGo} 
                 language="go" 
                 expectedAnswer="html.EscapeString(userInput)"
                 onSolve={() => alert("Great job! You patched the XSS vulnerability.")}
               />
             ) : (
               <LabTerminal labName={`Target: ${params.id || 'Web Fundamentals'}`} />
             )}
          </div>
        </div>

      </main>
    </div>
  );
}
