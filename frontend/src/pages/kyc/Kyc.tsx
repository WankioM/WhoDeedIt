import Header from '../home/Header';
import Footer from '../home/Footer';

export default function Kyc() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-grow py-8">
        <h1 className="mb-6 text-3xl font-bold">Identity Verification</h1>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <p className="mb-4">Verify your identity to ensure trust in property transactions.</p>
          <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Start Verification</button>
        </div>
      </main>
      <Footer />
    </div>
  );
}