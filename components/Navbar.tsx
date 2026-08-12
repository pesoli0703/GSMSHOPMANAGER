import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <header style={{ padding: '12px 16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontWeight: 700, fontSize: 20 }}>
        <Link href="/">GSM Shop Manager</Link>
      </div>
      <nav>
        {user ? (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 14 }}>{user.email}</span>
            <button onClick={logout} style={{ padding: '8px 12px', borderRadius: 6 }}>Logout</button>
          </div>
        ) : (
          <Link href="/login">
            <a style={{ padding: '8px 12px', borderRadius: 6 }}>Sign in</a>
          </Link>
        )}
      </nav>
    </header>
  );
}
