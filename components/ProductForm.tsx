import { useState } from "react";

export default function ProductForm({ initial, onSave, onCancel }: any){
  const [name, setName] = useState(initial?.name || "");
  const [category, setCategory] = useState(initial?.category || "");
  const [model, setModel] = useState(initial?.model || "");
  const [sellingPrice, setSellingPrice] = useState(initial?.sellingPrice || 0);
  const [quantity, setQuantity] = useState(initial?.quantity || 0);
  const [lowStockThreshold, setLowStockThreshold] = useState(initial?.lowStockThreshold || 0);

  return (
    <form onSubmit={async (e)=>{ e.preventDefault(); await onSave({ name, category, model, sellingPrice, quantity, lowStockThreshold }); }} className="space-y-2">
      <input className="w-full p-3 border rounded" placeholder="Product name" value={name} onChange={e=>setName(e.target.value)} required />
      <input className="w-full p-3 border rounded" placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} />
      <input className="w-full p-3 border rounded" placeholder="Model" value={model} onChange={e=>setModel(e.target.value)} />
      <div className="flex space-x-2">
        <input type="number" className="flex-1 p-3 border rounded" placeholder="Selling price" value={sellingPrice} onChange={e=>setSellingPrice(Number(e.target.value))} />
        <input type="number" className="flex-1 p-3 border rounded" placeholder="Quantity" value={quantity} onChange={e=>setQuantity(Number(e.target.value))} />
      </div>
      <input type="number" className="w-full p-3 border rounded" placeholder="Low stock threshold" value={lowStockThreshold} onChange={e=>setLowStockThreshold(Number(e.target.value))} />

      <div className="flex space-x-2">
        <button type="submit" className="flex-1 p-3 bg-green-600 text-white rounded">Save</button>
        <button type="button" onClick={onCancel} className="p-3 border rounded">Cancel</button>
      </div>
    </form>
  );
}
