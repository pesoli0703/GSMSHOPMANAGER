import { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import ProductForm from "../../components/ProductForm";

export default function ProductsPage() {
  const shopId = process.env.NEXT_PUBLIC_DEFAULT_SHOP_ID!;
  const [products, setProducts] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const col = collection(db, `shops/${shopId}/products`);
    const unsub = onSnapshot(col, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProducts(docs as any[]);
    });
    return () => unsub();
  }, [shopId]);

  function filtered() {
    if (!query) return products;
    const q = query.toLowerCase();
    return products.filter(p => {
      return (p.name || "").toLowerCase().includes(q) || (p.model || "").toLowerCase().includes(q);
    });
  }

  async function handleCreate(payload: any) {
    try {
      await addDoc(collection(db, `shops/${shopId}/products`), {
        name: payload.name,
        category: payload.category || "",
        model: payload.model || "",
        sellingPrice: Number(payload.sellingPrice) || 0,
        quantity: Number(payload.quantity) || 0,
        lowStockThreshold: Number(payload.lowStockThreshold) || 0,
        createdAt: new Date(),
      });
      setShowForm(false);
    } catch (err: any) {
      alert("Failed to add product: " + (err.message || err));
    }
  }

  async function handleUpdate(id: string, payload: any) {
    try {
      const ref = doc(db, `shops/${shopId}/products/${id}`);
      await updateDoc(ref, {
        name: payload.name,
        category: payload.category || "",
        model: payload.model || "",
        sellingPrice: Number(payload.sellingPrice) || 0,
        quantity: Number(payload.quantity) || 0,
        lowStockThreshold: Number(payload.lowStockThreshold) || 0,
      });
      setEditing(null);
      setShowForm(false);
    } catch (err: any) {
      alert("Failed to update product: " + (err.message || err));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, `shops/${shopId}/products/${id}`));
    } catch (err: any) {
      alert("Failed to delete: " + (err.message || err));
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Products</h1>
        <div className="space-x-2">
          <button onClick={() => { setShowForm(s => !s); setEditing(null); }} className="px-3 py-2 bg-blue-600 text-white rounded">{showForm ? 'Close' : 'Add'}</button>
        </div>
      </div>

      {showForm && (
        <div className="mb-4">
          <ProductForm
            initial={editing}
            onCancel={() => { setShowForm(false); setEditing(null); }}
            onSave={async (payload:any) => {
              if (editing) await handleUpdate(editing.id, payload);
              else await handleCreate(payload);
            }}
          />
        </div>
      )}

      <div className="mb-3">
        <input placeholder="Search by name or model" value={query} onChange={e=>setQuery(e.target.value)} className="w-full p-3 rounded border" />
      </div>

      <div className="space-y-2">
        {filtered().map(p => (
          <div key={p.id} className="p-3 border rounded flex justify-between items-center">
            <div>
              <div className="font-medium">{p.name} <span className="text-sm text-gray-400">{p.model}</span></div>
              <div className="text-sm text-gray-400">₦{(p.sellingPrice||0).toLocaleString()} • Stock: {p.quantity}{p.lowStockThreshold!=null && p.quantity <= p.lowStockThreshold ? ` • LOW` : ''}</div>
            </div>
            <div className="space-x-2">
              <button onClick={() => { setEditing(p); setShowForm(true); }} className="px-2 py-1 border rounded">Edit</button>
              <button onClick={() => handleDelete(p.id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
        {filtered().length === 0 && <div className="text-sm text-gray-500">No products found.</div>}
      </div>
    </div>
  );
}
