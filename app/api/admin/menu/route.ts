// 1. Change function to 'async'
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // 2. Await the params object
  const { id } = await params; 
  
  return <div>Item {id}</div>;
}
