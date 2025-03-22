import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="bg-blue-600 py-16 text-center text-white">
      <h1 className="mb-6 text-4xl font-bold">Bringing Trust to Digital Property Transactions</h1>
      <p className="mx-auto mb-8 max-w-2xl text-xl">Verify real estate ownership and user identity without sacrificing privacy</p>
      <Link to="/signup" className="rounded-lg bg-white px-6 py-3 font-medium text-blue-600 hover:bg-blue-50">Get Started</Link>
    </div>
  );
}