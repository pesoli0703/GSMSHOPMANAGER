import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export async function calculateEngineerOutstanding(shopId: string, engineerId: string) {
  const txQ = query(collection(db, `shops/${shopId}/transactions`), where("engineerId", "==", engineerId));
  const txSnap = await getDocs(txQ);

  const payQ = query(collection(db, `shops/${shopId}/payments`), where("engineerId", "==", engineerId));
  const paySnap = await getDocs(payQ);

  let totalTx = 0;
  txSnap.forEach(d => { const t: any = d.data(); totalTx += Number(t.total || 0); });

  let totalPay = 0;
  paySnap.forEach(d => { const p: any = d.data(); totalPay += Number(p.amount || 0); });

  return Math.max(0, totalTx - totalPay);
}
