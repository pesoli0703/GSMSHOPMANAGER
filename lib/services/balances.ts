import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export async function calculateEngineerOutstanding(shopId: string, engineerId: string) {
  const txQ = query(collection(db, `shops/${shopId}/transactions`), where("engineerId", "==", engineerId));
  const payQ = query(collection(db, `shops/${shopId}/payments`), where("engineerId", "==", engineerId));

  const [txSnap, paySnap] = await Promise.all([getDocs(txQ), getDocs(payQ)]);

  let txTotal = 0;
  txSnap.forEach((d) => {
    const data = d.data() as any;
    txTotal += data.total ?? 0;
  });

  let paymentsTotal = 0;
  paySnap.forEach((d) => {
    const data = d.data() as any;
    paymentsTotal += data.amount ?? 0;
  });

  return Math.max(0, txTotal - paymentsTotal);
}
