'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { getUserRole } from '@/services/getUserRole'; // Make sure this path is correct

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null); // reset error on new submit

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    if (!data.user) {
      setError('Login failed: no user data returned');
      return;
    }

    // Fetch the user's role from profiles table
    const role = await getUserRole(data.user.id);

    if (!role) {
      setError('Failed to fetch user role');
      return;
    }

    // Redirect based on role
    switch (role) {
      case 'client':
        router.push('/lounge');
        break;
      case 'artist':
        router.push('/dashboard');
        break;
      case 'studio':
        router.push('/studio');
        break;
      case 'admin':
        router.push('/admin');
        break;
      default:
        router.push('/unauthorized');
        break;
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-2 max-w-xs mx-auto">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Log In
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
}