import { db } from "../firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export async function createProduct(shopId: string, product: any) {
  const col = collection(db, `shops/${shopId}/products`);
  const ref = await addDoc(col, {
    name: product.name,
    category: product.category || "",
    model: product.model || "",
    sellingPrice: Number(product.sellingPrice) || 0,
    quantity: Number(product.quantity) || 0,
    lowStockThreshold: Number(product.lowStockThreshold) || 0,
    createdAt: new Date(),
  });
  return { id: ref.id };
}

export async function updateProduct(shopId: string, productId: string, product: any) {
  const ref = doc(db, `shops/${shopId}/products/${productId}`);
  await updateDoc(ref, {
    name: product.name,
    category: product.category || "",
    model: product.model || "",
    sellingPrice: Number(product.sellingPrice) || 0,
    quantity: Number(product.quantity) || 0,
    lowStockThreshold: Number(product.lowStockThreshold) || 0,
  });
}

export async function deleteProduct(shopId: string, productId: string) {
  const ref = doc(db, `shops/${shopId}/products/${productId}`);
  await deleteDoc(ref);
}
