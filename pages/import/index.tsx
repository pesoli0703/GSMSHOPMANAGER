import { useState } from "react";
import { collection, writeBatch, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function BulkImportPage(){
  const shopId = process.env.NEXT_PUBLIC_DEFAULT_SHOP_ID!;
  const [text, setText] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const [mode, setMode] = useState<'engineers'|'products'>('engineers');

  function parseCSV(input: string) {
    const lines = input.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return [];
    const headers = lines[0].split(",").map(h => h.trim());
    const rows = lines.slice(1).map(line => {
      const cols = line.split(",").map(c => c.trim());
      const obj: any = {};
      headers.forEach((h, i) => obj[h] = cols[i] ?? "");
      return obj;
    });
    return rows;
  }

  async function onImport(){
    setLog([]);
    try {
      const rows = parseCSV(text);
      if (!rows.length) { setLog(["No rows parsed — ensure header row exists"]); return; }
      const batch = writeBatch(db);
      let ops = 0;
      for (let i=0;i<rows.length;i++){
        const r = rows[i];
        if (mode === 'engineers'){
          const colRef = collection(db, `shops/${shopId}/engineers`);
          const docRef = (colRef as any).doc ? (colRef as any).doc() : undefined;
          const { doc } = await import('firebase/firestore');
          const newRef = doc(collection(db, `shops/${shopId}/engineers`));
          batch.set(newRef, {
            fullName: r.fullName || r.name || '',
            phone: r.phone || '',
            workshop: r.workshop || '',
            notes: r.notes || '',
            createdAt: serverTimestamp(),
          });
          ops++;
        } else {
          const { doc } = await import('firebase/firestore');
          const newRef = doc(collection(db, `shops/${shopId}/products`));
          batch.set(newRef, {
            name: r.name || r.product || '',
            category: r.category || '',
            model: r.model || '',
            sellingPrice: Number(r.sellingPrice || r.price || 0),
            quantity: Number(r.quantity || 0),
            lowStockThreshold: Number(r.lowStockThreshold || 0),
            createdAt: serverTimestamp(),
          });
          ops++;
        }
        // commit every 400 ops
        if (ops >= 400) {
          await batch.commit();
        }
      }
      await batch.commit();
      setLog([`Imported ${rows.length} rows into ${mode}`]);
    } catch (err: any){
      setLog([err.message || String(err)]);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-3">Bulk import</h1>
      <div className="mb-3">
        <label className="mr-2"><input type="radio" checked={mode==='engineers'} onChange={()=>setMode('engineers')} /> Engineers</label>
        <label className="ml-3"><input type="radio" checked={mode==='products'} onChange={()=>setMode('products')} /> Products</label>
      </div>
      <p className="mb-2 text-sm">Paste CSV with header. Examples:</p>
      {mode==='engineers' && <pre className="text-sm bg-gray-800 p-2 rounded">fullName,phone,workshop,notes
Emeka,08012345678,Emeka Workshop,Regular</pre>}
      {mode==='products' && <pre className="text-sm bg-gray-800 p-2 rounded">name,category,model,sellingPrice,quantity,lowStockThreshold
"iPhone 13 Screen",Screens,iPhone 13,85000,10,3</pre>}
      <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full h-48 p-2 border rounded my-3" />
      <div className="flex space-x-2">
        <button onClick={onImport} className="flex-1 p-3 bg-blue-600 text-white rounded">Import</button>
        <button onClick={()=>setText('')} className="p-3 border rounded">Clear</button>
      </div>
      <div className="mt-4">
        {log.map((l,i)=>(<div key={i} className="text-sm mb-1">{l}</div>))}
      </div>
    </div>
  );
}
