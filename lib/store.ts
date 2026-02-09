
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    id: string; // MenuItem ID
    name: string;
    price: number;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    total: () => number;
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (newItem) =>
                set((state) => {
                    const existingItem = state.items.find((i) => i.id === newItem.id);
                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.id === newItem.id
                                    ? { ...i, quantity: i.quantity + 1 }
                                    : i
                            ),
                        };
                    }
                    return { items: [...state.items, { ...newItem, quantity: 1 }] };
                }),
            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                })),
            updateQuantity: (id, quantity) =>
                set((state) => {
                    if (quantity <= 0) {
                        return { items: state.items.filter((i) => i.id !== id) };
                    }
                    return {
                        items: state.items.map((i) => i.id === id ? { ...i, quantity } : i)
                    };
                }),
            clearCart: () => set({ items: [] }),
            total: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }),
        {
            name: 'sippins-cart',
        }
    )
);
