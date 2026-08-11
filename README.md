# GSM Shop Manager — Phase 1

This repository contains the Phase 1 skeleton for the GSM Shop Manager mobile-first app built with Next.js, TypeScript, Tailwind and Firebase (Auth + Firestore).

Files pushed in branch `phase1-initial` include:
- lib/firebase.ts
- lib/types.ts
- lib/services/transactions.ts (atomic transaction + stock decrement + txn number)
- lib/services/payments.ts
- lib/services/balances.ts
- pages/login.tsx
- pages/transactions/new.tsx
- pages/_app.tsx
- firestore.rules
- .env.example

Next steps (what you should do now):
1. In Firebase Console: create a shop document `gsm-shop-1` and add engineers/products as described in the README above.
2. Add a user in Authentication and create a users/{uid} doc with field `shopId: "gsm-shop-1"`.
3. Set Firestore rules (paste `firestore.rules`).
4. Deploy to Vercel and set the NEXT_PUBLIC_* env vars from `.env.example`.

If you want, I can open a PR from `phase1-initial` into your default branch, or continue by adding the remaining pages (Dashboard, Engineers list, Products, Payments, Transactions history, and mobile nav).
