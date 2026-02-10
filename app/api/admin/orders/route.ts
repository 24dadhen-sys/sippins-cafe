// ✅ NEW CODE (Next.js 15 compatible)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // We 'await' the params here
  
  // ... rest of your code using 'id'
}
