export default function Home() {
  return (
    <main className="min-h-screen bg-white p-10">

      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-5xl font-bold">
          ☕ Welcome to Sippins Cafe
        </h1>

        <p className="text-lg text-gray-600">
          Fresh coffee. Cozy vibes. Good moments.
        </p>
      </section>

      {/* Menu Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Our Favorites</h2>

        <ul className="space-y-2">
          <li>Latte</li>
          <li>Cappuccino</li>
          <li>Cold Brew</li>
        </ul>
      </section>

    </main>
  );
}
