
"use client";

import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Clock, ChefHat, Share2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function OrderStatusPage() {
    const { id } = useParams();
    const { data: order, error } = useSWR(id ? `/api/orders/${id}` : null, fetcher, {
        refreshInterval: 3000,
    });

    if (error) return <div className="p-8 text-center text-red-500">Failed to load order</div>;
    if (!order) return <div className="p-8 text-center">Loading order details...</div>;

    const steps = [
        { status: 'PENDING', label: 'Order Placed', icon: Clock },
        { status: 'PREPARING', label: 'Preparing', icon: ChefHat },
        { status: 'COMPLETED', label: 'Ready!', icon: CheckCircle2 },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.status);

    // WhatsApp Share Link
    const shareText = `Order #${order.id.slice(-4)} at Sippin's Cafe\nTotal: ₹${order.totalAmount}\nTrack status: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

    return (
        <div className="min-h-screen bg-gray-50 p-4 pb-24">
            <div className="max-w-md mx-auto space-y-6">
                {/* Status Header */}
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        {order.status === 'COMPLETED' ? <CheckCircle2 className="w-8 h-8 text-green-600" /> : <Clock className="w-8 h-8 text-green-600 animate-pulse" />}
                    </div>
                    <h1 className="text-2xl font-bold">
                        {order.status === 'PENDING' && "Order Received!"}
                        {order.status === 'PREPARING' && "We're cooking!"}
                        {order.status === 'COMPLETED' && "Ready to Serve!"}
                    </h1>
                    <p className="text-gray-500">Order ID: #{order.id.slice(-4).toUpperCase()}</p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-between px-4">
                    {steps.map((step, idx) => {
                        const isActive = idx <= currentStepIndex;
                        const Icon = step.icon;
                        return (
                            <div key={step.status} className="flex flex-col items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isActive ? 'bg-black text-white border-black' : 'bg-white text-gray-300 border-gray-200'}`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <span className={`text-xs font-medium ${isActive ? 'text-black' : 'text-gray-400'}`}>{step.label}</span>
                            </div>
                        )
                    })}
                </div>

                {/* Digital Bill */}
                <Card className="border-0 shadow-lg">
                    <div className="p-4 border-b bg-gray-50/50">
                        <h2 className="font-semibold">Digital Bill</h2>
                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <CardContent className="p-4 space-y-4">
                        <div className="space-y-2">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span>{item.quantity}x {item.menuItem.name}</span>
                                    <span>₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <Separator />

                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{order.totalAmount - (order.type === 'PARCEL' ? 10 : 0)}</span>
                            </div>
                            {order.type === 'PARCEL' && (
                                <div className="flex justify-between text-gray-600">
                                    <span>Parcel Charges</span>
                                    <span>₹10</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-lg pt-2">
                                <span>Grand Total</span>
                                <span>₹{order.totalAmount}</span>
                            </div>
                        </div>
                    </CardContent>
                    <div className="p-4 bg-gray-50 rounded-b-xl">
                        <Button variant="outline" className="w-full border-green-600 text-green-700 hover:bg-green-50" asChild>
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                <Share2 className="w-4 h-4 mr-2" /> Share Bill on WhatsApp
                            </a>
                        </Button>
                    </div>
                </Card>

                <div className="text-center">
                    <Button variant="ghost" asChild>
                        <Link href="/">Order More Items</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
