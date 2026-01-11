import React, { useState } from 'react';
import { User, Table } from '../types.ts';
import { T } from '../constants.ts';

interface Props {
  user: User;
  tables: Table[];
  onSelectTable: (id: number) => void;
  onUpdateTable: (table: Table) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<Props> = ({ user, tables, onSelectTable, onUpdateTable, onLogout }) => {
  const [showConfirm, setShowConfirm] = useState<number | null>(null);
  const [showPeopleCount, setShowPeopleCount] = useState<number | null>(null);
  const [tempPeople, setTempPeople] = useState<string>('1');

  const handleTableClick = (table: Table) => {
    if (table.status === 'busy') {
      onSelectTable(table.id);
    } else {
      setShowConfirm(table.id);
    }
  };

  const confirmOpenTable = () => {
    if (showConfirm !== null) {
      setShowConfirm(null);
      setShowPeopleCount(showConfirm);
    }
  };

  const finalizeOpenTable = () => {
    if (showPeopleCount !== null) {
      const tableToUpdate = tables.find(tbl => tbl.id === showPeopleCount);
      if (tableToUpdate) {
        const updatedTable: Table = {
          ...tableToUpdate,
          status: 'busy',
          peopleCount: parseInt(tempPeople) || 1,
          items: []
        };
        onUpdateTable(updatedTable);
        setShowPeopleCount(null);
        onSelectTable(showPeopleCount);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24 select-none">
      <header className="bg-[#7f1d1d] pt-12 pb-4 px-4 text-white shadow-md sticky top-0 z-10 flex justify-between items-end h-28">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white">PIZZAFLOW</h1>
          <p className="text-[10px] opacity-70 font-bold uppercase tracking-widest text-white">{user.name} • {user.login}</p>
        </div>
        <button onClick={onLogout} className="p-2 bg-white/10 rounded-xl active:bg-white/20 transition-colors">
           <span className="text-sm font-bold uppercase text-white">Sair</span>
        </button>
      </header>

      <main className="p-4 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-3">
        {tables.map(table => (
          <button
            key={table.id}
            onClick={() => handleTableClick(table)}
            className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-white font-bold shadow-lg active:scale-90 transition-all ${
              table.status === 'free' ? 'bg-[#064e3b]' : 'bg-blue-600'
            }`}
          >
            <span className="text-xl">{table.id}</span>
            <span className="text-[9px] opacity-70 uppercase font-normal tracking-wide">
              {table.status === 'free' ? 'Livre' : 'Ocupada'}
            </span>
            {table.status === 'busy' && (
              <span className="text-[10px] mt-1 bg-white/20 px-1.5 py-0.5 rounded-full">
                👥 {table.peopleCount}
              </span>
            )}
          </button>
        ))}
      </main>

      {showConfirm !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-xs text-center shadow-2xl">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-xl font-bold mb-6 text-gray-800">{T.openTableConfirm}</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold active:bg-gray-200"
              >
                {T.no}
              </button>
              <button
                onClick={confirmOpenTable}
                className="flex-1 py-4 bg-[#064e3b] text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform"
              >
                {T.yes}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPeopleCount !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-xs text-center shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-gray-800">{T.howManyPeople}</h3>
            <div className="flex items-center justify-center gap-4 mb-8">
               <button 
                 onClick={() => setTempPeople(Math.max(1, parseInt(tempPeople) - 1).toString())}
                 className="w-12 h-12 rounded-full bg-gray-100 text-2xl font-bold"
               >−</button>
               <input
                type="number"
                value={tempPeople}
                onChange={(e) => setTempPeople(e.target.value)}
                className="w-20 text-center text-4xl font-black text-[#064e3b] outline-none"
              />
               <button 
                 onClick={() => setTempPeople((parseInt(tempPeople) + 1).toString())}
                 className="w-12 h-12 rounded-full bg-gray-100 text-2xl font-bold"
               >+</button>
            </div>
            <button
              onClick={finalizeOpenTable}
              className="w-full py-5 bg-[#064e3b] text-white rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-transform"
            >
              {T.confirm}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
