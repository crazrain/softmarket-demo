import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError('Email and password are required.'); return; }
    login();
    navigate('/');
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-surface-900">Sign In</h1>
          <p className="mt-2 text-surface-500">Welcome back to SoftMarket</p>
        </div>
        <form onSubmit={handleSubmit} className="card space-y-4">
          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-surface-700">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-field" required />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-surface-700">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input-field" required />
          </div>
          <button type="submit" className="btn-primary w-full">Sign In</button>
          <p className="text-center text-sm text-surface-500">
            Don&apos;t have an account? <Link to="/register" className="text-primary-600 hover:text-primary-700">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
