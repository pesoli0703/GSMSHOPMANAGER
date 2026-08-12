import { db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export async function ensureDefaultShopForUser(uid: string, email?: string) {
  const shopId = process.env.NEXT_PUBLIC_DEFAULT_SHOP_ID || 'gsm-shop-1';
  const shopRef = doc(db, `shops/${shopId}`);
  const shopSnap = await getDoc(shopRef);
  if (!shopSnap.exists()) {
    await setDoc(shopRef, {
      name: `${email ? email.split('@')[0] + "'s Shop" : 'Alpha GSM Shop'}`,
      createdAt: serverTimestamp(),
    });
  }

  const metaRef = doc(db, `shops/${shopId}/meta/counters`);
  const metaSnap = await getDoc(metaRef);
  if (!metaSnap.exists()) {
    await setDoc(metaRef, { txnCounter: 0 }, { merge: true });
  }

  const userRef = doc(db, `users/${uid}`);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists() || !(userSnap.data() && (userSnap.data() as any).shopId)) {
    await setDoc(userRef, { shopId }, { merge: true });
  }

  return shopId;
}
