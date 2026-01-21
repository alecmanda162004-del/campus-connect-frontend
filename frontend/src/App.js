import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Marketplace from './pages/Marketplace';
import CreateListing from './pages/CreateListing';

function App() {
  return (
    <Router>
      <Navbar />  {/* ← New sticky navbar */}

      <Routes>
        <Route path="/" element={
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-4 bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 animate-pulse">
              Welcome to Campus-Connect
            </h1>
            <p className="text-2xl md:text-3xl mb-10 max-w-3xl">
              University of Lusaka's own marketplace — buy, sell, and connect!
            </p>
            <Link
              to="/marketplace"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-5 px-12 rounded-full text-xl transition transform hover:scale-105 shadow-lg"
            >
              Explore Marketplace
            </Link>
          </div>
        } />

        <Route path="/marketplace" element={<Marketplace />} />

        <Route path="/create-listing" element={<CreateListing />} />
      </Routes>
    </Router>
  );
}

export default App;