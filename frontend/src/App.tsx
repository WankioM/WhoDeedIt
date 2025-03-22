import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/Signup';
import Wallet from './pages/wallet/Wallet';
import Verify from './pages/auth/Verify'; // Import the new Verify component
import MiniKitProvider from './minikit-provider';
import { useEffect, useState } from 'react';
import Dashboard from './pages/dashboard/Dashboard';
import Header from './pages/home/Header';
import VerifyOwnership from './components/Eruda/layout/VerifyOwnership';

function App() {
  const [_isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    const userAddress = localStorage.getItem('user_address');
    setIsAuthenticated(!!userAddress);
  }, []);

  return (
    <MiniKitProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/verify" element={<Verify />} /> 
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/property/verify" element={<VerifyOwnership />} />
              </Routes>
            </main>
          </div>
        </Router>
      </MiniKitProvider>
  );
}

export default App;