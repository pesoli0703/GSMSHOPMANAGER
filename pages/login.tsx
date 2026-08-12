import { useState } from 'react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const submit = async (e: any) => {
    e.preventDefault();
    setError('');
    try {
      if (isNew) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Auth error');
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 480, margin: '36px auto', padding: '0 16px' }}>
        <h1 style={{ fontSize: 26, marginBottom: 12 }}>{isNew ? 'Create account' : 'Sign in'}</h1>
        <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
          <button type="submit" style={{ padding: '10px 12px', borderRadius: 6 }}>{isNew ? 'Create account' : 'Sign in'}</button>
          {error && <div style={{ color: 'red' }}>{error}</div>}
        </form>
        <div style={{ marginTop: 12 }}>
          <button onClick={() => setIsNew(!isNew)} style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer' }}>
            {isNew ? 'Have an account? Sign in' : "Don't have an account? Create one"}
          </button>
        </div>
      </main>
    </>
  );
}
