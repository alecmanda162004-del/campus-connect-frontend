import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api'; // ← Import the centralized API helper (adjust path if needed)
import ListingCard from '../components/ListingCard';

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyListings = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        setError('Please log in to see your listings');
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/api/listings/user/${userId}`); // ← Fixed: using api helper

        setListings(res.data.data || []);
      } catch (err) {
        setError('Failed to load your listings. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, []);

  // Handle delete: remove listing from state after API success
  const handleDelete = (deletedId) => {
    setListings(prev => prev.filter(listing => listing.id !== deletedId));
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-dark d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" style={{ width: '5rem', height: '5rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-primary fs-4 ms-4">Loading your listings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 bg-dark d-flex align-items-center justify-content-center px-3">
        <div className="card bg-dark border-danger shadow-lg text-center" style={{ maxWidth: '500px' }}>
          <div className="card-body p-5">
            <h2 className="card-title text-danger display-6 fw-bold mb-4">Oops!</h2>
            <p className="text-secondary fs-5 mb-5">{error}</p>
            <Link
              to="/login"
              className="btn btn-danger btn-lg px-5 py-3 fw-bold shadow-lg"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-dark text-white py-5">
      <div className="container">
        <h1 className="text-center display-4 fw-bold text-primary mb-5">
          My Listings
        </h1>

        {listings.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-secondary fs-4 mb-4">
              You haven't posted any listings yet.
            </p>
            <Link
              to="/create-listing"
              className="btn btn-success btn-lg px-5 py-3 fw-bold shadow-lg"
            >
              Post Your First Listing
            </Link>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {listings.map((listing) => (
              <div key={listing.id} className="col">
                <ListingCard 
                  listing={listing}
                  onDelete={handleDelete}
                  showDelete={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}