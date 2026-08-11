import {
  doc,
  collection,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export async function createTransactionAtomic(shopId: string, payload: {
  engineerId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  amountPaid: number;
}) {
  if (!shopId) throw new Error("shopId required");

  const { engineerId, productId, quantity, unitPrice, amountPaid } = payload;
  return await runTransaction(db, async (t) => {
    const pRef = doc(db, `shops/${shopId}/products/${productId}`);
    const pSnap = await t.get(pRef);
    if (!pSnap.exists()) throw new Error("Product not found");
    const productData = pSnap.data() as any;

    const currentQty = productData.quantity ?? 0;
    if (quantity > currentQty) {
      throw new Error(`Insufficient stock. Only ${currentQty} units are available.`);
    }

    const cRef = doc(db, `shops/${shopId}/meta/counters`);
    const cSnap = await t.get(cRef);
    let txnCounter = 0;
    if (!cSnap.exists()) {
      t.set(cRef, { txnCounter: 1 }, { merge: true });
      txnCounter = 1;
    } else {
      const prev = (cSnap.data() as any).txnCounter ?? 0;
      txnCounter = prev + 1;
      t.update(cRef, { txnCounter });
    }

    const txnNumber = `GSM-${String(txnCounter).padStart(6, "0")}`;

    const total = unitPrice * quantity;
    const outstanding = Math.max(0, total - amountPaid);
    const status: TransactionRecord["status"] =
      outstanding === 0 ? "PAID" : amountPaid === 0 ? "UNPAID" : "PARTIALLY_PAID";

    const txRef = doc(collection(db, `shops/${shopId}/transactions`));
    t.set(txRef, {
      txnNumber,
      engineerId,
      productId,
      productName: productData.name || "",
      quantity,
      unitPrice,
      total,
      amountPaid,
      outstanding,
      status,
      createdAt: serverTimestamp(),
    });

    t.update(pRef, { quantity: currentQty - quantity });

    return { id: txRef.id, txnNumber };
  });
}
