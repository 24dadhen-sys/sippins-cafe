
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, customerName, mobileNumber, tableNumber, type, specialNote } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // Calculate total amount from DB prices to avoid manipulation
        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of items) {
            const dbItem = await prisma.menuItem.findUnique({ where: { id: item.id } });
            if (!dbItem) continue;

            totalAmount += dbItem.price * item.quantity;
            orderItemsData.push({
                menuItemId: dbItem.id,
                quantity: item.quantity,
                price: dbItem.price,
            });
        }

        // Add parcel charges if applicable
        if (type === 'PARCEL') {
            // simple hardcode for now, or fetch from StoreConfig
            totalAmount += 10;
        }

        const order = await prisma.order.create({
            data: {
                customerName,
                mobileNumber,
                tableNumber,
                type,
                specialNote,
                totalAmount,
                status: "PENDING",
                items: {
                    create: orderItemsData,
                },
            },
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
    }
}
