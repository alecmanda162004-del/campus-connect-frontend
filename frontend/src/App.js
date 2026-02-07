import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Marketplace from './pages/Marketplace';
import CreateListing from './pages/CreateListing';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import SellerProfile from './pages/SellerProfile';
import MyListings from './pages/MyListings';
import HomePage from './pages/HomePage';  // ← this import was missing
import Feedback from './pages/Feedback';          // ← add this
import ListingDetail from './pages/ListingDetail'; // ← add this
import Donate from './pages/Donate';

// Inside your <Routes>



function App() {
  return (
    <Router>
      <Navbar />  {/* Sticky navbar */}

      <Routes>
        {/* Home page – now uses the separate HomePage component */}
        <Route path="/" element={<HomePage />} />

        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile/:userId" element={<SellerProfile />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route path="/donate" element={<Donate />} />        
      </Routes>
    </Router>
  );
}

export default App;