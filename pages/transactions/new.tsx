import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { createTransactionAtomic } from "../../lib/services/transactions";

export default function NewTransactionPage() {
  const shopId = process.env.NEXT_PUBLIC_DEFAULT_SHOP_ID!;
  const [engineers, setEngineers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [engineerId, setEngineerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function load() {
      const eSnap = await getDocs(collection(db, `shops/${shopId}/engineers`));
      setEngineers(eSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      const pSnap = await getDocs(collection(db, `shops/${shopId}/products`));
      setProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    load();
  }, [shopId]);

  useEffect(() => {
    if (!productId) return;
    const p = products.find(p => p.id === productId);
    if (p) setUnitPrice(p.sellingPrice || 0);
  }, [productId, products]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      const res = await createTransactionAtomic(shopId, {
        engineerId,
        productId,
        quantity,
        unitPrice,
        amountPaid,
      });
      setSuccess(`Transaction recorded: ${res.txnNumber}`);
    } catch (err: any) {
      setError(err.message || "Failed to create transaction");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">New Transaction</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <select required value={engineerId} onChange={e => setEngineerId(e.target.value)} className="w-full p-3 rounded border">
          <option value="">Select engineer</option>
          {engineers.map(e => <option key={e.id} value={e.id}>{e.fullName} — {e.phone}</option>)}
        </select>

        <select required value={productId} onChange={e => setProductId(e.target.value)} className="w-full p-3 rounded border">
          <option value="">Select product</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name} — Stock: {p.quantity}</option>)}
        </select>

        <div className="flex space-x-2">
          <input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value||1))} className="flex-1 p-3 rounded border" />
          <input type="number" min={0} value={unitPrice} onChange={e => setUnitPrice(Number(e.target.value||0))} className="flex-1 p-3 rounded border" />
        </div>

        <input type="number" min={0} value={amountPaid} onChange={e => setAmountPaid(Number(e.target.value||0))} className="w-full p-3 rounded border" placeholder="Amount paid (₦)" />

        <div className="text-lg font-medium">
          Total: ₦{(unitPrice * quantity).toLocaleString()} — Outstanding: ₦{Math.max(0, unitPrice * quantity - amountPaid).toLocaleString()}
        </div>

        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}

        <button className="w-full bg-blue-600 text-white p-3 rounded text-lg">Record transaction</button>
      </form>
    </div>
  );
}
