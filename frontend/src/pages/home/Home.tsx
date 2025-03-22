import Hero from './Hero';
import Footer from './Footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Removed the Header component from here since it's already in App.tsx */}
      <Hero />
      <main className="container mx-auto flex-grow py-8">
        <section className="mb-12">
          <h2 className="mb-4 text-center text-3xl font-bold">How It Works</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg p-6 shadow-md">
              <h3 className="mb-2 text-xl font-semibold">Identity Verification</h3>
              <p>Prove you're a real person with World ID verification</p>
            </div>
            <div className="rounded-lg p-6 shadow-md">
              <h3 className="mb-2 text-xl font-semibold">Property Ownership</h3>
              <p>Verify and prove real estate ownership</p>
            </div>
            <div className="rounded-lg p-6 shadow-md">
              <h3 className="mb-2 text-xl font-semibold">Secure Transactions</h3>
              <p>Conduct safe property transactions</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}