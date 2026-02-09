
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSWRConfig } from "swr";
import { Plus } from "lucide-react";

interface Category {
    id: string;
    name: string;
}

interface MenuItem {
    id?: string;
    name: string;
    price: number;
    categoryId: string;
    description?: string;
    imageUrl?: string;
    isAvailable: boolean;
}

export function MenuDialog({ item, categories }: { item?: MenuItem; categories: Category[] }) {
    const { mutate } = useSWRConfig();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<MenuItem>({
        name: "",
        price: 0,
        categoryId: categories[0]?.id || "",
        description: "",
        imageUrl: "",
        isAvailable: true,
    });

    useEffect(() => {
        if (item) {
            setFormData(item);
        } else if (categories.length > 0) {
            setFormData(prev => ({ ...prev, categoryId: categories[0].id }))
        }
    }, [item, categories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (item?.id) {
                await fetch(`/api/admin/menu/${item.id}`, {
                    method: "PUT",
                    body: JSON.stringify(formData),
                });
            } else {
                await fetch("/api/admin/menu", {
                    method: "POST",
                    body: JSON.stringify(formData),
                });
            }
            setOpen(false);
            mutate("/api/admin/menu");
            if (!item) {
                // Reset form if it was a create action
                setFormData({
                    name: "",
                    price: 0,
                    categoryId: categories[0]?.id || "",
                    description: "",
                    imageUrl: "",
                    isAvailable: true,
                });
            }
        } catch (error) {
            console.error("Failed to save", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {item ? (
                    <Button variant="ghost" size="sm">Edit</Button>
                ) : (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Item
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{item ? "Edit Item" : "Add New Item"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price
                        </Label>
                        <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                            Category
                        </Label>
                        <select
                            id="category"
                            className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        >
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="available" className="text-right">
                            Available
                        </Label>
                        <Switch
                            id="available"
                            checked={formData.isAvailable}
                            onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
                        />
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button type="submit">Save changes</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
