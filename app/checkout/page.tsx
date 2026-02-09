
"use client";

import { useCart } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customerName: "",
        mobileNumber: "",
        tableNumber: "",
        type: "DINE_IN",
        specialNote: "",
    });

    const cartTotal = total();
    const finalTotal = formData.type === 'PARCEL' ? cartTotal + 10 : cartTotal;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;

        setLoading(true);
        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items,
                    ...formData,
                }),
            });

            if (!response.ok) throw new Error("Failed to place order");

            const order = await response.json();
            clearCart();
            router.push(`/order/${order.id}`);
        } catch (error) {
            console.error(error);
            alert("Something went wrong! Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <Button asChild><Link href="/">Browse Menu</Link></Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center gap-3">
                <Link href="/" className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="font-bold text-lg">Checkout</h1>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-6">
                {/* Order Type */}
                <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
                    <Label className="text-base font-semibold">Dining Preference</Label>
                    <RadioGroup
                        defaultValue="DINE_IN"
                        onValueChange={(val) => setFormData({ ...formData, type: val })}
                        className="flex gap-4"
                    >
                        <div className="flex items-center space-x-2 border rounded-lg p-3 flex-1 justify-center has-[[data-state=checked]]:border-black has-[[data-state=checked]]:bg-gray-50">
                            <RadioGroupItem value="DINE_IN" id="dine-in" />
                            <Label htmlFor="dine-in">Dine In</Label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-lg p-3 flex-1 justify-center has-[[data-state=checked]]:border-black has-[[data-state=checked]]:bg-gray-50">
                            <RadioGroupItem value="PARCEL" id="parcel" />
                            <Label htmlFor="parcel">Parcel (+₹10)</Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Details */}
                <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                    <h2 className="font-semibold text-base">Your Details</h2>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name (Optional)</Label>
                        <Input
                            id="name"
                            placeholder="Enter your name"
                            value={formData.customerName}
                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="mobile">Mobile (Optional)</Label>
                        <Input
                            id="mobile"
                            type="tel"
                            placeholder="Where to send bill?"
                            value={formData.mobileNumber}
                            onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                        />
                    </div>
                    {formData.type === 'DINE_IN' && (
                        <div className="grid gap-2">
                            <Label htmlFor="table">Table Number</Label>
                            <Input
                                id="table"
                                placeholder="e.g. 4"
                                value={formData.tableNumber}
                                onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                            />
                        </div>
                    )}
                </div>

                {/* Create a Note */}
                <div className="bg-white p-4 rounded-xl shadow-sm space-y-2">
                    <Label htmlFor="note">Special Instructions</Label>
                    <Textarea
                        id="note"
                        placeholder="Less spicy, no onions, etc."
                        value={formData.specialNote}
                        onChange={(e) => setFormData({ ...formData, specialNote: e.target.value })}
                    />
                </div>

                {/* Bill Summary */}
                <div className="bg-white p-4 rounded-xl shadow-sm space-y-2">
                    <h2 className="font-semibold text-base mb-2">Bill Summary</h2>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Item Total</span>
                        <span>₹{cartTotal}</span>
                    </div>
                    {formData.type === 'PARCEL' && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Parcel Charges</span>
                            <span>₹10</span>
                        </div>
                    )}
                    <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                        <span>To Pay</span>
                        <span>₹{finalTotal}</span>
                    </div>
                </div>

                <Button type="submit" className="w-full h-14 text-lg bg-black hover:bg-gray-800 rounded-xl" disabled={loading}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Place Order • ₹${finalTotal}`}
                </Button>
            </form>
        </div>
    );
}
