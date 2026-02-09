
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json();
        const { status } = body;

        const order = await prisma.order.update({
            where: {
                id: params.id,
            },
            data: {
                status,
            },
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
}
