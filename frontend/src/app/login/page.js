'use client';

import { useState } from 'react';
import LoginForm from '../../components/LoginForm';

export default function LoginPage() {
  const [mode, setMode] = useState('login');

  return <LoginForm mode={mode} onModeChange={setMode} />;
}
