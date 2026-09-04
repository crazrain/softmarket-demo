import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) { setError('All fields are required.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    login();
    navigate('/');
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-surface-900">Create Account</h1>
          <p className="mt-2 text-surface-500">Join SoftMarket to buy and sell software</p>
        </div>
        <form onSubmit={handleSubmit} className="card space-y-4">
          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
          <div>
            <label htmlFor="reg-name" className="mb-1.5 block text-sm font-medium text-surface-700">Name</label>
            <input id="reg-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="input-field" required />
          </div>
          <div>
            <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium text-surface-700">Email</label>
            <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-field" required />
          </div>
          <div>
            <label htmlFor="reg-password" className="mb-1.5 block text-sm font-medium text-surface-700">Password</label>
            <input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" className="input-field" required minLength={6} />
          </div>
          <div>
            <label htmlFor="reg-confirm" className="mb-1.5 block text-sm font-medium text-surface-700">Confirm Password</label>
            <input id="reg-confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="input-field" required />
          </div>
          <button type="submit" className="btn-primary w-full">Create Account</button>
          <p className="text-center text-sm text-surface-500">
            Already have an account? <Link to="/login" className="text-primary-600 hover:text-primary-700">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
