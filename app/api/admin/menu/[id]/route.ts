import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  return NextResponse.json({
    id,
    success: true,
  });
}
