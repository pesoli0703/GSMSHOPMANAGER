import Link from "next/link";

export default function MobileNav(){
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex justify-around">
      <Link href="/" className="text-center">Dashboard</Link>
      <Link href="/engineers" className="text-center">Engineers</Link>
      <Link href="/transactions/new" className="text-center">New</Link>
      <Link href="/products" className="text-center">Products</Link>
      <Link href="/payments" className="text-center">Payments</Link>
    </nav>
  );
}
