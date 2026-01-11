export interface User { id: string; name: string; login: string; }
export interface PizzaItem { id: string; type: 'pizza' | 'sweet-pizza'; size: string; flavors: string[]; quantity: number; }
export interface DrinkItem { id: string; name: string; withIce: boolean; withLemon: boolean; quantity: number; type: 'drink' | 'beer'; }
export type OrderItem = PizzaItem | DrinkItem;
export interface Table { id: number; status: 'free' | 'busy'; peopleCount: number; items: OrderItem[]; }
