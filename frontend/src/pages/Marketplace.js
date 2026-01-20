import { useState, useEffect } from 'react';
import axios from 'axios';
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
  const [maxPrice, setMaxPrice] = useState(10000); // adjust max as needed

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/listings');
        setListings(response.data.data);
        setFilteredListings(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load listings. Is the backend running?');
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  // Apply filters whenever search/condition/price changes
  useEffect(() => {
    let filtered = listings;

    // Search by title or description
    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (listing.description && listing.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by condition
    if (selectedCondition !== 'All') {
      filtered = filtered.filter(listing => listing.condition === selectedCondition);
    }

    // Filter by price range
    filtered = filtered.filter(listing => {
      const p = Number(listing.price);
      return p >= minPrice && p <= maxPrice;
    });

    setFilteredListings(filtered);
  }, [listings, searchTerm, selectedCondition, minPrice, maxPrice]);

  if (loading) return <div className="text-center py-20 text-2xl text-purple-300 animate-pulse">Loading marketplace...</div>;
  if (error) return <div className="text-center py-20 text-2xl text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 to-indigo-950 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-center text-white mb-12">
          Campus Marketplace
        </h1>

        {/* Search & Filters */}
        <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl mb-12 border border-purple-700/40">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search Bar */}
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2 font-medium">Search by title or description</label>
              <input
                type="text"
                placeholder="e.g. iPhone, calculator, textbook..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            {/* Condition Filter */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Condition</label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition"
              >
                <option>All</option>
                <option>New</option>
                <option>Used - Excellent</option>
                <option>Used - Good</option>
                <option>Used - Fair</option>
              </select>
            </div>

            {/* Price Range (simple inputs for MVP) */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Price Range (K)</label>
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
                  className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value) || 10000)}
                  className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <p className="text-center text-xl text-gray-300">
            No listings match your filters. Try adjusting search or price range.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;