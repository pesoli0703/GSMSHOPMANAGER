import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/router';

export default function SignupPage(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  async function onSubmit(e:any){
    e.preventDefault();
    setMessage('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage('Account created. Redirecting...');
      router.push('/');
    } catch (err:any){
      setMessage(err.message || 'Failed to create account');
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Sign up</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full p-3 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="w-full p-3 border rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        {message && <div className="text-sm text-red-600">{message}</div>}
        <button className="w-full p-3 bg-blue-600 text-white rounded">Create account</button>
      </form>
    </div>
  );
}
