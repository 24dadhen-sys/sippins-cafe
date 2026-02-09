
"use client";

import useSWR from "swr";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MenuDialog } from "@/components/admin/MenuDialog";
import { Trash2 } from "lucide-react";

// Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface MenuItem {
    id: string;
    name: string;
    price: number;
    categoryId: string;
    category: { name: string };
    isAvailable: boolean;
}

interface Category {
    id: string;
    name: string;
}

export default function MenuPage() {
    const { data: menuItems, mutate } = useSWR<MenuItem[]>("/api/admin/menu", fetcher);
    const { data: categories } = useSWR<Category[]>("/api/admin/categories", fetcher);

    const deleteItem = async (id: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });
            mutate();
        }
    };

    if (!menuItems || !categories) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Menu Management</h1>
                <MenuDialog categories={categories} />
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {menuItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.category?.name}</TableCell>
                                <TableCell>₹{item.price}</TableCell>
                                <TableCell>
                                    <Badge variant={item.isAvailable ? "default" : "destructive"}>
                                        {item.isAvailable ? "Available" : "Out of Stock"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <MenuDialog item={item} categories={categories} />
                                    <Button variant="ghost" size="sm" onClick={() => deleteItem(item.id)}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
