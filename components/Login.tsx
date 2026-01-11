import React, { useState } from 'react';
import { T } from '../constants';
const Login = ({ onLogin }: any) => {
  const [pass, setPass] = useState('');
  const handle = () => {
    if(pass === '111') onLogin({ id: '1', name: 'Alex', login: 'Mestre' });
    else alert('Senha incorreta (use 111)');
  };
  return (
    <div className="min-h-screen bg-[#7f1d1d] flex items-center justify-center p-6 text-white">
      <div className="bg-white p-8 rounded-3xl text-gray-900 w-full max-w-xs shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">{T.loginTitle}</h2>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Senha (111)" className="w-full p-4 border-2 rounded-xl mb-4 text-center text-2xl" />
        <button onClick={handle} className="w-full py-4 bg-[#064e3b] text-white rounded-xl font-bold">ENTRAR</button>
      </div>
    </div>
  );
};
export default Login;
