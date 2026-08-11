import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ensureDefaultShopForUser } from '../lib/services/bootstrap';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await ensureDefaultShopForUser(user.uid, user.email || undefined);
        } catch (err) {
          console.error('Bootstrap failed', err);
        }
      }
    });
    return () => unsub();
  }, []);

  return <Component {...pageProps} />;
}
