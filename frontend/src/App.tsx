import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/Signup';
import Wallet from './pages/wallet/Wallet';
import Verify from './pages/auth/Verify'; 
import MiniKitProvider from './minikit-provider';
import Dashboard from './pages/dashboard/Dashboard';
import Header from './pages/home/Header';
import { AuthProvider } from './context/auth-provider'; 



function App() {
  return (
    <AuthProvider>
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
                <Route path="/property/verify" element={<Verify />} />
              </Routes>
            </main>
          </div>
        </Router>
      </MiniKitProvider>
    </AuthProvider>
  );
}

export default App;