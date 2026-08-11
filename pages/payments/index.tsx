import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { recordPayment } from "../../lib/services/payments";

export default function PaymentsPage(){
  const shopId = process.env.NEXT_PUBLIC_DEFAULT_SHOP_ID!;
  const [engineers, setEngineers] = useState<any[]>([]);
  const [engineerId, setEngineerId] = useState("");
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState('Cash');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  useEffect(()=>{
    async function load(){
      const q = query(collection(db, `shops/${shopId}/engineers`));
      const snap = await getDocs(q);
      setEngineers(snap.docs.map(d=>({ id: d.id, ...d.data() })));
    }
    load();
  }, [shopId]);

  async function onSubmit(e:any){
    e.preventDefault();
    setMessage('');
    if (!engineerId) { setMessage('Select engineer'); return; }
    if (amount <= 0) { setMessage('Enter amount'); return; }

    try {
      await recordPayment(shopId, { engineerId, amount: Number(amount), method, reference, notes });
      setMessage('Payment recorded');
      setAmount(0); setReference(''); setNotes('');
    } catch (err:any) {
      setMessage(err.message || 'Failed to record payment');
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Record Payment</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <select required value={engineerId} onChange={e=>setEngineerId(e.target.value)} className="w-full p-3 rounded border">
          <option value="">Select engineer</option>
          {engineers.map(e => <option key={e.id} value={e.id}>{e.fullName} — {e.phone}</option>)}
        </select>

        <input type="number" min={1} value={amount} onChange={e=>setAmount(Number(e.target.value))} className="w-full p-3 rounded border" placeholder="Amount (₦)" />

        <select value={method} onChange={e=>setMethod(e.target.value)} className="w-full p-3 rounded border">
          <option>Cash</option>
          <option>Bank Transfer</option>
          <option>POS</option>
          <option>Other</option>
        </select>

        <input className="w-full p-3 rounded border" placeholder="Reference" value={reference} onChange={e=>setReference(e.target.value)} />
        <textarea className="w-full p-3 rounded border" placeholder="Notes" value={notes} onChange={e=>setNotes(e.target.value)} />

        {message && <div className="text-sm text-green-600">{message}</div>}

        <button className="w-full p-3 bg-blue-600 text-white rounded">Record payment</button>
      </form>
    </div>
  );
}
