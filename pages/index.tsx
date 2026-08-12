import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const totals = {
    outstanding: 0,
    todaysTransactions: 0,
    todaysCredit: 0,
    todaysPayments: 0,
  };

  return (
    <>
      <Navbar />
      <main style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>Dashboard</h1>

        {!user && (
          <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: '#fff6', border: '1px solid #eee' }}>
            <strong>Please sign in</strong> to see live shop data.
          </div>
        )}

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginTop: 20 }}>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid #eee' }}>
            <div style={{ color: '#666' }}>Total outstanding</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>₦{totals.outstanding}</div>
          </div>

          <div style={{ padding: 16, borderRadius: 8, border: '1px solid #eee' }}>
            <div style={{ color: '#666' }}>Today's transactions</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{totals.todaysTransactions}</div>
          </div>

          <div style={{ padding: 16, borderRadius: 8, border: '1px solid #eee' }}>
            <div style={{ color: '#666' }}>Today's credit</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>₦{totals.todaysCredit}</div>
          </div>

          <div style={{ padding: 16, borderRadius: 8, border: '1px solid #eee' }}>
            <div style={{ color: '#666' }}>Today's payments</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>₦{totals.todaysPayments}</div>
          </div>
        </section>

        <section style={{ marginTop: 28 }}>
          <h2 style={{ fontSize: 22, marginBottom: 8 }}>People owing</h2>
          <div style={{ padding: 12, borderRadius: 8, border: '1px dashed #eee' }}>
            No outstanding balances
          </div>
        </section>
      </main>
    </>
  );
}
