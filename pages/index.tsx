import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function DashboardPage(){
  const shopId = process.env.NEXT_PUBLIC_DEFAULT_SHOP_ID!;
  const [transactionsCountToday, setTransactionsCountToday] = useState(0);
  const [todayCredit, setTodayCredit] = useState(0);
  const [todayPayments, setTodayPayments] = useState(0);
  const [totalOutstanding, setTotalOutstanding] = useState(0);
  const [peopleOwing, setPeopleOwing] = useState<any[]>([]);

  useEffect(()=>{
    async function load(){
      const txCol = collection(db, `shops/${shopId}/transactions`);
      const txSnap = await getDocs(txCol);
      const paySnap = await getDocs(collection(db, `shops/${shopId}/payments`));

      const now = new Date();
      const todayStr = now.toDateString();

      let txToday = 0;
      let todayCred = 0;
      let todayPay = 0;
      let totalTx = 0;
      let totalPay = 0;

      const byEngineer: Record<string, {name?:string, owe:number}> = {};

      txSnap.forEach(d=>{
        const t: any = d.data();
        const createdAt = t.createdAt?.toDate ? t.createdAt.toDate() : (t.createdAt && t.createdAt.seconds ? new Date(t.createdAt.seconds*1000) : null);
        if (createdAt && createdAt.toDateString()===todayStr) txToday++;
        if (t.amountPaid==0 && createdAt && createdAt.toDateString()===todayStr) todayCred += Number(t.total||0);
        totalTx += Number(t.total||0);
        const eng = t.engineerId || 'unknown';
        if (!byEngineer[eng]) byEngineer[eng] = { name: t.engineerId, owe: 0 };
        byEngineer[eng].owe += Number(t.total||0);
      });

      paySnap.forEach(d=>{
        const p: any = d.data();
        const createdAt = p.createdAt?.toDate ? p.createdAt.toDate() : (p.createdAt && p.createdAt.seconds ? new Date(p.createdAt.seconds*1000) : null);
        if (createdAt && createdAt.toDateString()===todayStr) todayPay += Number(p.amount||0);
        totalPay += Number(p.amount||0);
        const eng = p.engineerId || 'unknown';
        if (!byEngineer[eng]) byEngineer[eng] = { name: eng, owe: 0 };
        byEngineer[eng].owe -= Number(p.amount||0);
      });

      // assemble people owing
      const oweList = Object.keys(byEngineer).map(k=>({ engineerId: k, owe: byEngineer[k].owe }));
      const people = oweList.filter(x=>x.owe>0).slice(0,10);

      setTransactionsCountToday(txToday);
      setTodayCredit(todayCred);
      setTodayPayments(todayPay);
      setTotalOutstanding(Math.max(0, totalTx - totalPay));
      setPeopleOwing(people);
    }
    load();
  }, [shopId]);

  return (
    <div className="p-4 pb-20">
      <h1 className="text-xl font-semibold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-white rounded shadow">Total outstanding<div className="text-2xl font-bold">₦{totalOutstanding.toLocaleString()}</div></div>
        <div className="p-3 bg-white rounded shadow">Today's transactions<div className="text-2xl font-bold">{transactionsCountToday}</div></div>
        <div className="p-3 bg-white rounded shadow">Today's credit<div className="text-2xl font-bold">₦{todayCredit.toLocaleString()}</div></div>
        <div className="p-3 bg-white rounded shadow">Today's payments<div className="text-2xl font-bold">₦{todayPayments.toLocaleString()}</div></div>
      </div>

      <div className="mb-4">
        <h2 className="font-medium mb-2">People owing</h2>
        <div className="space-y-2">
          {peopleOwing.length===0 && <div className="text-sm text-gray-500">No outstanding balances</div>}
          {peopleOwing.map(p => (
            <div key={p.engineerId} className="p-3 border rounded flex justify-between items-center">
              <div>{p.engineerId}</div>
              <div className="font-medium">₦{(p.owe||0).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
