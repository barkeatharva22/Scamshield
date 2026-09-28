'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center bg-panel border border-border rounded-card shadow-card p-8">
          <div className="w-12 h-12 rounded-2xl bg-safeDim flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6 text-safe" />
          </div>
          <h1 className="font-display text-xl font-semibold mb-2">Check your email</h1>
          <p className="text-sm text-muted">
            We sent a confirmation link to <span className="text-text">{email}</span>. Click it to
            activate your account, then log in.
          </p>
          <Link href="/login" className="inline-block mt-6 text-brand text-sm font-semibold hover:underline">
            Go to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-8 h-8 rounded-xl bg-text flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-semibold text-lg">ScamShield</span>
        </Link>

        <div className="bg-panel border border-border rounded-card shadow-card p-8">
          <h1 className="font-display text-xl font-semibold mb-1">Create your account</h1>
          <p className="text-sm text-muted mb-6">Start checking messages before you trust them.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-2">Full name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-panelLight border border-border rounded-xl px-4 py-2.5 text-sm focus-ring focus:border-brand outline-none"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-panelLight border border-border rounded-xl px-4 py-2.5 text-sm focus-ring focus:border-brand outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-2">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-panelLight border border-border rounded-xl px-4 py-2.5 text-sm focus-ring focus:border-brand outline-none"
                placeholder="At least 6 characters"
              />
            </div>

            {error && (
              <p className="text-xs text-danger bg-dangerDim rounded-xl px-3 py-2.5">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-text text-white font-medium py-3 rounded-pill hover:bg-text/90 transition-colors focus-ring disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-brand font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
