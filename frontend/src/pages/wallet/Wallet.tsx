import Header from '../home/Header';
import Footer from '../home/Footer';

export default function Wallet() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-grow py-8">
        <h1 className="mb-6 text-3xl font-bold">Your Property Wallet</h1>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <p className="mb-4">Manage your verified properties and credentials.</p>
          <div className="rounded-lg border p-4">
            <p className="text-gray-500">No properties found. Verify ownership to add properties.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}