import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export async function recordPayment(
  shopId: string,
  payment: {
    engineerId: string;
    amount: number;
    method: string;
    reference?: string;
    notes?: string;
  }
) {
  const colRef = collection(
    db,
    `shops/${shopId}/payments`
  );

  const docRef = await addDoc(colRef, {
    engineerId: payment.engineerId,
    amount: payment.amount,
    method: payment.method,
    reference: payment.reference || "",
    notes: payment.notes || "",
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
  };
}
