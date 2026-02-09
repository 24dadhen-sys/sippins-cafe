
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store";
import { ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartSheet() {
    const { items, total, removeItem, updateQuantity } = useCart();
    const [mounted, setMounted] = useState(false);
    const cartTotal = total();
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Sheet>
            <SheetTrigger asChild>
                {itemCount > 0 && (
                    <div className="fixed bottom-6 left-4 right-4 z-50">
                        <Button className="w-full h-14 bg-black hover:bg-gray-800 text-white shadow-xl rounded-full flex justify-between px-6 items-center animate-in slide-in-from-bottom-4">
                            <div className="flex flex-col items-start">
                                <span className="text-xs text-gray-400">{itemCount} items</span>
                                <span className="font-bold text-lg">₹{cartTotal}</span>
                            </div>
                            <div className="flex items-center font-bold">
                                View Cart <ShoppingBag className="ml-2 w-5 h-5" />
                            </div>
                        </Button>
                    </div>
                )}
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh] rounded-t-[20px] p-0 flex flex-col">
                <SheetHeader className="p-6 border-b">
                    <SheetTitle>Your Order</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10">Your cart is empty</div>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-gray-500">₹{item.price * item.quantity}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center border rounded-lg">
                                        <button className="px-3 py-1 hover:bg-gray-100" onClick={() => {
                                            if (item.quantity > 1) updateQuantity(item.id, item.quantity - 1)
                                            else removeItem(item.id)
                                        }}>-</button>
                                        <span className="px-2 text-sm font-bold">{item.quantity}</span>
                                        <button className="px-3 py-1 hover:bg-gray-100" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-6 border-t bg-gray-50">
                    <div className="flex justify-between mb-4 text-sm">
                        <span className="text-gray-600">Total Amount</span>
                        <span className="font-bold text-lg">₹{cartTotal}</span>
                    </div>
                    <Button className="w-full bg-black text-white h-12 rounded-xl" asChild>
                        <Link href="/checkout">Proceed to Checkout</Link>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
