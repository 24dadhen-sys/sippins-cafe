
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json();
        const { name, price, categoryId, description, imageUrl, isAvailable } = body;

        const menuItem = await prisma.menuItem.update({
            where: { id: params.id },
            data: {
                name,
                price: parseFloat(price),
                categoryId,
                description,
                imageUrl,
                isAvailable
            }
        });

        return NextResponse.json(menuItem);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.menuItem.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete menu item" }, { status: 500 });
    }
}
