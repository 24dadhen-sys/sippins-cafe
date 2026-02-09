
"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Clock, ChefHat } from "lucide-react";
import { toast } from "sonner"; // We'll need to install sonner or use standard alert

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface OrderItem {
    id: string;
    quantity: number;
    menuItem: {
        name: string;
        price: number;
    };
}

interface Order {
    id: string;
    customerName: string;
    tableNumber: string;
    status: string;
    totalAmount: number;
    items: OrderItem[];
    createdAt: string;
    specialNote?: string;
}

export default function AdminDashboard() {
    const { data: orders, error, mutate } = useSWR<Order[]>("/api/admin/orders", fetcher, {
        refreshInterval: 5000, // Poll every 5 seconds
    });

    const updateStatus = async (id: string, status: string) => {
        try {
            await fetch(`/api/admin/orders/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ status }),
            });
            mutate(); // Refresh data
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    if (error) return <div>Failed to load orders</div>;
    if (!orders) return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                        Live Object: {orders.length} Active Orders
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => (
                    <Card key={order.id} className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Order #{order.id.slice(-4)}
                            </CardTitle>
                            <Badge variant={order.status === 'PENDING' ? 'destructive' : 'default'}>
                                {order.status}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold mb-1">{order.tableNumber ? `Table ${order.tableNumber}` : 'Parcel'}</div>
                            <p className="text-xs text-muted-foreground mb-4">
                                {new Date(order.createdAt).toLocaleTimeString()} • {order.customerName || 'Guest'}
                            </p>

                            <div className="space-y-2 mb-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span>{item.quantity}x {item.menuItem.name}</span>
                                        <span className="font-mono">₹{item.menuItem.price * item.quantity}</span>
                                    </div>
                                ))}
                                {order.specialNote && (
                                    <div className="text-xs bg-yellow-100 p-2 rounded text-yellow-800 mt-2">
                                        Note: {order.specialNote}
                                    </div>
                                )}
                            </div>

                            <div className="border-t pt-2 mt-2 flex justify-between items-center font-bold">
                                <span>Total</span>
                                <span>₹{order.totalAmount}</span>
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                {order.status === 'PENDING' && (
                                    <Button size="sm" onClick={() => updateStatus(order.id, 'PREPARING')}>
                                        <ChefHat className="w-4 h-4 mr-1" /> Start
                                    </Button>
                                )}
                                {order.status === 'PREPARING' && (
                                    <Button size="sm" onClick={() => updateStatus(order.id, 'COMPLETED')} variant="default" className="bg-green-600 hover:bg-green-700">
                                        <CheckCircle2 className="w-4 h-4 mr-1" /> Ready
                                    </Button>
                                )}
                                {order.status === 'COMPLETED' && (
                                    <Button size="sm" variant="outline" disabled>
                                        Done
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {orders.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-400">
                        <p>No active orders right now.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
