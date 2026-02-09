
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            where: {
                status: {
                    not: "COMPLETED", // Fetch active orders
                },
            },
            include: {
                items: {
                    include: {
                        menuItem: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}
