import React, { useState } from 'react';
import { Table, OrderItem, PizzaItem, DrinkItem } from '../types.ts';
import { T, MENU_DRINKS, MENU_BEERS, PIZZA_SIZES, SWEET_PIZZA_SIZES } from '../constants.ts';

interface Props {
  table: Table;
  onUpdate: (table: Table) => void;
  onBack: () => void;
  onCloseTable: () => void;
}

const TableOrder: React.FC<Props> = ({ table, onUpdate, onBack, onCloseTable }) => {
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>(table.items);
  const [activeTab, setActiveTab] = useState<'pizzas' | 'sweet-pizzas' | 'drinks' | 'beers'>('pizzas');
  
  const [pizzaConfig, setPizzaConfig] = useState<{ sizeId: string; type: 'pizza' | 'sweet-pizza'; maxFlavors: number } | null>(null);
  const [tempFlavors, setTempFlavors] = useState<string[]>([]);
  const [drinkConfig, setDrinkConfig] = useState<{ name: string; type: 'drink' | 'beer' } | null>(null);
  const [tempIce, setTempIce] = useState<boolean>(false);
  const [tempLemon, setTempLemon] = useState<boolean>(false);

  const handleUpdateItem = (id: string, delta: number) => {
    setCurrentOrder(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleAddPizza = () => {
    if (!pizzaConfig) return;
    
    const sizeObj = [...PIZZA_SIZES, ...SWEET_PIZZA_SIZES].find(s => s.id === pizzaConfig.sizeId);
    if (!sizeObj) return;

    const newItem: PizzaItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: pizzaConfig.type,
      size: sizeObj.name,
      flavors: tempFlavors.filter(f => f.trim() !== ''),
      quantity: 1
    };

    setCurrentOrder(prev => [...prev, newItem]);
    setPizzaConfig(null);
    setTempFlavors([]);
  };

  const handleAddDrink = () => {
    if (!drinkConfig) return;

    const newItem: DrinkItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: drinkConfig.name,
      type: drinkConfig.type,
      withIce: tempIce,
      withLemon: tempLemon,
      quantity: 1
    };

    setCurrentOrder(prev => [...prev, newItem]);
    setDrinkConfig(null);
    setTempIce(false);
    setTempLemon(false);
  };

  const handleSave = () => {
    onUpdate({ ...table, items: currentOrder });
    onBack();
  };

  const itemTotal = currentOrder.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col select-none">
      <div className="bg-[#7f1d1d] text-white p-4 sticky top-0 z-10 flex justify-between items-center shadow-lg h-20 pt-8">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full active:bg-white/20">←</button>
        <div className="text-center">
          <h2 className="text-lg font-bold uppercase tracking-tighter">{T.table} {table.id}</h2>
          <p className="text-[10px] opacity-80 font-bold uppercase">👥 {table.peopleCount} pessoas</p>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4 no-scrollbar">
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">{T.totalItems}: {itemTotal}</h3>
          <div className="space-y-4">
            {currentOrder.length === 0 && <p className="text-gray-400 italic text-center py-6 text-sm">Nenhum item adicionado à mesa</p>}
            {currentOrder.map(item => (
              <div key={item.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <div className="flex-1 mr-4">
                  <div className="font-bold text-gray-800 flex items-center gap-2">
                    {'flavors' in item ? '🍕' : '🥤'} { 'flavors' in item ? item.size : item.name }
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                    {'flavors' in item ? item.flavors.join(' / ') : `${item.withIce ? 'COM GELO' : ''} ${item.withLemon ? 'COM LIMÃO' : ''}`}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleUpdateItem(item.id, -1)} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-red-600 active:bg-red-50">➖</button>
                  <span className="font-black w-6 text-center text-lg">{item.quantity}</span>
                  <button onClick={() => handleUpdateItem(item.id, 1)} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-green-600 active:bg-green-50">➕</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sticky top-20 bg-gray-50 z-10">
          {(['pizzas', 'sweet-pizzas', 'drinks', 'beers'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2.5 rounded-full font-black text-[11px] uppercase tracking-wider whitespace-nowrap border-2 transition-all ${
                activeTab === cat 
                ? 'bg-[#064e3b] text-white border-[#064e3b] shadow-md' 
                : 'bg-white text-gray-400 border-gray-100'
              }`}
            >
              {cat === 'pizzas' && `🍕 ${T.pizzas}`}
              {cat === 'sweet-pizzas' && `🍫 ${T.sweetPizzas}`}
              {cat === 'drinks' && `🥤 ${T.drinks}`}
              {cat === 'beers' && `🍺 ${T.beers}`}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3">
          {activeTab === 'pizzas' && PIZZA_SIZES.map(s => (
            <button
              key={s.id}
              onClick={() => {
                setPizzaConfig({ sizeId: s.id, type: 'pizza', maxFlavors: s.flavors });
                setTempFlavors(Array(s.flavors).fill(''));
              }}
              className="bg-white p-5 rounded-2xl flex justify-between items-center shadow-sm border border-gray-100 active:bg-gray-50 transition-colors"
            >
              <span className="font-black text-gray-700 uppercase tracking-tight">{s.name}</span>
              <span className="bg-green-100 text-green-700 text-[10px] px-3 py-1.5 rounded-lg font-black uppercase">Adicionar</span>
            </button>
          ))}

          {activeTab === 'sweet-pizzas' && SWEET_PIZZA_SIZES.map(s => (
            <button
              key={s.id}
              onClick={() => {
                setPizzaConfig({ sizeId: s.id, type: 'sweet-pizza', maxFlavors: s.flavors });
                setTempFlavors(Array(s.flavors).fill(''));
              }}
              className="bg-white p-5 rounded-2xl flex justify-between items-center shadow-sm border border-gray-100 active:bg-gray-50 transition-colors"
            >
              <span className="font-black text-gray-700 uppercase tracking-tight">{s.name}</span>
              <span className="bg-pink-100 text-pink-700 text-[10px] px-3 py-1.5 rounded-lg font-black uppercase">Adicionar</span>
            </button>
          ))}

          {activeTab === 'drinks' && MENU_DRINKS.map(d => (
            <button
              key={d}
              onClick={() => setDrinkConfig({ name: d, type: 'drink' })}
              className="bg-white p-5 rounded-2xl flex justify-between items-center shadow-sm border border-gray-100 active:bg-gray-50 transition-colors"
            >
              <span className="font-black text-gray-700 uppercase tracking-tight">{d}</span>
              <span className="bg-blue-100 text-blue-700 text-lg rounded-lg w-8 h-8 flex items-center justify-center">➕</span>
            </button>
          ))}

          {activeTab === 'beers' && MENU_BEERS.map(b => (
            <button
              key={b}
              onClick={() => setDrinkConfig({ name: b, type: 'beer' })}
              className="bg-white p-5 rounded-2xl flex justify-between items-center shadow-sm border border-gray-100 active:bg-gray-50 transition-colors"
            >
              <span className="font-black text-gray-700 uppercase tracking-tight">{b}</span>
              <span className="bg-orange-100 text-orange-700 text-lg rounded-lg w-8 h-8 flex items-center justify-center">➕</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-white border-t flex flex-col gap-3 sticky bottom-0 z-20 shadow-[0_-8px_20px_-10px_rgba(0,0,0,0.1)]">
        <button
          onClick={handleSave}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform"
        >
          {T.save}
        </button>
        <div className="flex gap-3">
          <button
            onClick={onCloseTable}
            className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-md active:bg-orange-600"
          >
            {T.paying}
          </button>
          <button
            onClick={onCloseTable}
            className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-md active:bg-red-700"
          >
            {T.tableClosed}
          </button>
        </div>
      </div>

      {pizzaConfig && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-[60] backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-black mb-6 text-[#7f1d1d] uppercase tracking-tighter">{T.addFlavors}</h3>
            <div className="space-y-5 mb-8">
              {tempFlavors.map((flavor, idx) => (
                <div key={idx}>
                  <label className="text-[10px] text-gray-400 block mb-1.5 uppercase font-black tracking-widest">Sabor {idx + 1}</label>
                  <input
                    type="text"
                    autoFocus={idx === 0}
                    value={flavor}
                    onChange={(e) => {
                      const newFlavors = [...tempFlavors];
                      newFlavors[idx] = e.target.value;
                      setTempFlavors(newFlavors);
                    }}
                    placeholder={T.flavorPlaceholder}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#7f1d1d] outline-none font-bold text-lg transition-colors"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPizzaConfig(null)}
                className="flex-1 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black uppercase tracking-widest"
              >
                {T.cancel}
              </button>
              <button
                onClick={handleAddPizza}
                className="flex-1 py-4 bg-[#064e3b] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-transform"
              >
                {T.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {drinkConfig && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-[60] backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-xs shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="text-3xl text-center mb-4">{drinkConfig.type === 'drink' ? '🥤' : '🍺'}</div>
            <h3 className="text-xl font-black mb-8 text-center uppercase tracking-tight">{drinkConfig.name}</h3>
            
            <div className="space-y-8 mb-10">
              <div className="space-y-3">
                <p className="text-center font-bold text-gray-400 text-xs uppercase tracking-widest">{T.iceQuestion}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTempIce(true)}
                    className={`flex-1 py-4 rounded-2xl font-black transition-all ${tempIce ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-50 text-gray-300'}`}
                  >
                    SIM
                  </button>
                  <button
                    onClick={() => setTempIce(false)}
                    className={`flex-1 py-4 rounded-2xl font-black transition-all ${!tempIce ? 'bg-gray-400 text-white shadow-lg' : 'bg-gray-50 text-gray-300'}`}
                  >
                    NÃO
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-center font-bold text-gray-400 text-xs uppercase tracking-widest">{T.lemonQuestion}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTempLemon(true)}
                    className={`flex-1 py-4 rounded-2xl font-black transition-all ${tempLemon ? 'bg-yellow-400 text-white shadow-lg' : 'bg-gray-50 text-gray-300'}`}
                  >
                    SIM
                  </button>
                  <button
                    onClick={() => setTempLemon(false)}
                    className={`flex-1 py-4 rounded-2xl font-black transition-all ${!tempLemon ? 'bg-gray-400 text-white shadow-lg' : 'bg-gray-50 text-gray-300'}`}
                  >
                    NÃO
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDrinkConfig(null)}
                className="flex-1 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-xs"
              >
                {T.cancel}
              </button>
              <button
                onClick={handleAddDrink}
                className="flex-1 py-4 bg-[#064e3b] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-transform"
              >
                {T.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableOrder;
