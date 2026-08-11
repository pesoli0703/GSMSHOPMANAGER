import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // redirect if already logged in
    auth.onAuthStateChanged((u) => {
      if (u) router.push('/');
    });
  }, [router]);

  async function onSubmit(e: any) {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">GSM Shop Manager — Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full p-3 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full p-3 border rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div className="text-red-600">{error}</div>}
        <button className="w-full bg-blue-600 text-white p-3 rounded">Login</button>
      </form>
    </div>
  );
}
