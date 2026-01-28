import { useState, useEffect } from 'react';
import api from '../utils/api'; // ← Import the centralized API helper (adjust path if needed)
import ListingCard from '../components/ListingCard';

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(''); // empty = no upper limit
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await api.delete(`/api/listings/${id}`); // ← Fixed: using api helper
      setListings(prev => prev.filter(l => l.id !== id));
      setFilteredListings(prev => prev.filter(l => l.id !== id));
      alert('Listing deleted successfully');
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await api.get('/api/listings'); // ← Fixed
        setListings(response.data.data || []);
        setFilteredListings(response.data.data || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load listings. Is the backend running?');
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = listings;

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(listing =>
        listing.title?.toLowerCase().includes(term) ||
        listing.description?.toLowerCase().includes(term)
      );
    }

    // Condition filter
    if (selectedCondition !== 'All') {
      filtered = filtered.filter(listing => listing.condition === selectedCondition);
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(listing => listing.category === selectedCategory);
    }

    // Price filter
    filtered = filtered.filter(listing => {
      const p = Number(listing.price) || 0;
      const meetsMin = p >= minPrice;
      const meetsMax = maxPrice === '' || maxPrice <= 0 || p <= Number(maxPrice);
      return meetsMin && meetsMax;
    });

    setFilteredListings(filtered);
  }, [listings, searchTerm, selectedCondition, selectedCategory, minPrice, maxPrice]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
        <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-primary fs-4 ms-4">Loading marketplace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-danger">
        <div className="alert alert-danger text-center fs-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-dark text-white py-5">
      <div className="container">
        <h1 className="text-center display-4 fw-bold text-primary mb-5">
          Campus Marketplace
        </h1>

        {/* Filters Card */}
        <div className="card bg-secondary border-0 shadow-lg mb-5">
          <div className="card-body p-4 p-md-5">
            <div className="row g-4">
              {/* Search */}
              <div className="col-md-6">
                <label className="form-label text-light fw-medium">Search</label>
                <input
                  type="text"
                  placeholder="Search title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control form-control-lg bg-dark text-white border-secondary"
                />
              </div>

              {/* Condition */}
              <div className="col-md-3">
                <label className="form-label text-light fw-medium">Condition</label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="form-select form-select-lg bg-dark text-white border-secondary"
                >
                  <option value="All">All Conditions</option>
                  <option value="New">New</option>
                  <option value="Used - Excellent">Used - Excellent</option>
                  <option value="Used - Good">Used - Good</option>
                  <option value="Used - Fair">Used - Fair</option>
                </select>
              </div>

              {/* Category */}
              <div className="col-md-3">
                <label className="form-label text-light fw-medium">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="form-select form-select-lg bg-dark text-white border-secondary"
                >
                  <option value="All">All Categories</option>
                  <option value="Accommodation">Accommodation</option>
                  <option value="Books">Books</option>
                  <option value="Clothes - Men">Clothes - Men</option>
                  <option value="Clothes - Women">Clothes - Women</option>
                  <option value="Crocs & Medical Footwear">Crocs & Medical Footwear</option>
                  <option value="Electronic Gadgets">Electronic Gadgets</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Jewellery">Jewellery</option>
                  <option value="Lab Coats & Scrubs">Lab Coats & Scrubs</option>
                  <option value="Medical Equipment & Tools">Medical Equipment & Tools</option>
                  <option value="Other">Other</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Stationery & Study Aids">Stationery & Study Aids</option>
                  <option value="Stethoscopes & Diagnostic Tools">Stethoscopes & Diagnostic Tools</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="col-12">
                <label className="form-label text-light fw-medium">Price Range (K)</label>
                <div className="row g-3">
                  <div className="col-6 col-md-3">
                    <input
                      type="number"
                      placeholder="Min price"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
                      className="form-control form-control-lg bg-dark text-white border-secondary"
                    />
                  </div>
                  <div className="col-6 col-md-3">
                    <input
                      type="number"
                      placeholder="Max price (leave blank = unlimited)"
                      value={maxPrice}
                      onChange={(e) => {
                        const val = e.target.value;
                        setMaxPrice(val === '' ? '' : Number(val));
                      }}
                      className="form-control form-control-lg bg-dark text-white border-secondary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredListings.length === 0 ? (
          <div className="alert alert-info text-center fs-5 py-4">
            No listings match your filters. Try adjusting search, price, or category.
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="col">
                <ListingCard
                  listing={listing}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;