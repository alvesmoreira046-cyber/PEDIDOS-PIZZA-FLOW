import React, { useState, useEffect } from 'react';
import { User, Table } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TableOrder from './components/TableOrder';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTableId, setActiveTableId] = useState<number | null>(null);
  const [tables, setTables] = useState<Table[]>(() => {
    const saved = localStorage.getItem('pizzaflow_tables');
    if (saved) return JSON.parse(saved);
    return Array.from({ length: 50 }, (_, i) => ({ id: i + 1, status: 'free', peopleCount: 0, items: [] }));
  });

  useEffect(() => { localStorage.setItem('pizzaflow_tables', JSON.stringify(tables)); }, [tables]);

  if (!user) return <Login onLogin={setUser} />;
  
  if (activeTableId !== null) {
    const activeTable = tables.find(t => t.id === activeTableId);
    if (activeTable) return <TableOrder table={activeTable} onUpdate={(tbl) => setTables(prev => prev.map(t => t.id === tbl.id ? tbl : t))} onBack={() => setActiveTableId(null)} onCloseTable={() => { setTables(prev => prev.map(t => t.id === activeTableId ? { ...t, status: 'free', items: [], peopleCount: 0 } : t)); setActiveTableId(null); }} />;
  }

  return <Dashboard user={user} tables={tables} onSelectTable={setActiveTableId} onUpdateTable={(tbl) => setTables(prev => prev.map(t => t.id === tbl.id ? tbl : t))} onLogout={() => setUser(null)} />;
};

export default App;
