import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api'; // ← Import the centralized API helper (adjust path if needed)
import ListingCard from '../components/ListingCard';
import { FaStar } from 'react-icons/fa';

export default function SellerProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isOwner, setIsOwner] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ shop_name: '', bio: '' });
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const currentUserId = Number(localStorage.getItem('userId')) || null;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const parsedId = Number(userId);
    if (isNaN(parsedId) || parsedId <= 0) {
      setError('Invalid profile ID');
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const profileRes = await api.get(`/api/users/${userId}`); // ← Fixed
        const seller = profileRes.data.data;
        setProfile(seller);
        setIsOwner(seller.id === currentUserId);

        setAvatarPreview(seller.avatar_url);
        setCoverPreview(seller.cover_image_url);

        const listingsRes = await api.get(`/api/listings/user/${userId}`); // ← Fixed
        setListings(listingsRes.data.data || []);

        if ((seller.id === currentUserId || localStorage.getItem('role') === 'admin') && token) {
          try {
            const ratingsRes = await api.get(`/api/listings/users/${userId}/ratings`); // ← Fixed
            setRatings(ratingsRes.data.data || []);
          } catch (ratingsErr) {
            console.error('Failed to load ratings:', ratingsErr);
          }
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        if (err.response?.status === 404) {
          setError('Seller profile not found');
        } else if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError('Failed to load profile or listings');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, currentUserId, navigate, token]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (!editMode && profile) {
      setFormData({
        shop_name: profile.shop_name || '',
        bio: profile.bio || ''
      });
      setCoverPreview(profile.cover_image_url);
      setAvatarPreview(profile.avatar_url);
      setCoverFile(null);
      setAvatarFile(null);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return alert('Please select an image file');
    if (file.size > 5 * 1024 * 1024) return alert('Image too large (max 5MB)');

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return alert('Please select an image file');
    if (file.size > 5 * 1024 * 1024) return alert('Image too large (max 5MB)');

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!token) {
      alert('Please log in to edit your profile');
      navigate('/login');
      return;
    }

    try {
      let coverUrl = profile.cover_image_url;
      let avatarUrl = profile.avatar_url;

      if (coverFile) {
        const formDataImg = new FormData();
        formDataImg.append('image', coverFile);
        const uploadRes = await api.post('/api/upload/image', formDataImg, {
          headers: { 'Content-Type': 'multipart/form-data' }, // ← Required for FormData
        });
        coverUrl = uploadRes.data.url;
      }

      if (avatarFile) {
        const formDataImg = new FormData();
        formDataImg.append('image', avatarFile);
        const uploadRes = await api.post('/api/upload/image', formDataImg, {
          headers: { 'Content-Type': 'multipart/form-data' }, // ← Required for FormData
        });
        avatarUrl = uploadRes.data.url;
      }

      await api.put('/api/users/profile', {
        shop_name: formData.shop_name,
        bio: formData.bio,
        cover_image_url: coverUrl,
        avatar_url: avatarUrl
      }); // ← Fixed

      setProfile(prev => ({
        ...prev,
        shop_name: formData.shop_name,
        bio: formData.bio,
        cover_image_url: coverUrl,
        avatar_url: avatarUrl
      }));

      setEditMode(false);
      setCoverFile(null);
      setAvatarFile(null);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAdminCoverChange = async () => {
    if (!token || localStorage.getItem('role') !== 'admin') {
      alert('Admin access required');
      return;
    }

    const url = prompt('Enter new cover image URL for this seller:');
    if (!url) return;

    try {
      await api.put(`/api/users/${userId}/cover`, { cover_image_url: url }); // ← Fixed
      setProfile(prev => ({ ...prev, cover_image_url: url }));
      alert('Cover image updated by admin!');
    } catch (err) {
      alert('Failed to update cover');
    }
  };

  const handleDelete = (deletedId) => {
    setListings(prev => prev.filter(l => l.id !== deletedId));
  };

  const handleUpdateStock = async (listingId, newStock) => {
    if (!token) {
      alert('Please log in to update stock');
      navigate('/login');
      return;
    }

    if (newStock < 0) {
      alert('Stock quantity cannot be negative');
      return;
    }

    try {
      await api.patch(`/api/listings/${listingId}`, { stock_quantity: newStock }); // ← Fixed
      setListings(prev => prev.map(l => 
        l.id === listingId ? { ...l, stock_quantity: newStock } : l
      ));
      alert('Stock updated successfully!');
    } catch (err) {
      alert('Failed to update stock: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteRating = async (ratingId) => {
    if (!window.confirm('Are you sure you want to delete this rating? This cannot be undone.')) return;

    try {
      await api.delete(`/api/listings/ratings/${ratingId}`); // ← Fixed
      setRatings(prev => prev.filter(r => r.id !== ratingId));
      alert('Rating deleted successfully');
    } catch (err) {
      console.error('Delete rating error:', err);
      alert('Failed to delete rating: ' + (err.response?.data?.message || err.message || 'Unknown error'));
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you ABSOLUTELY sure you want to delete your account?\nThis will permanently remove all your listings, ratings, and profile data.')) {
      return;
    }

    if (!window.confirm('FINAL WARNING: This action CANNOT be undone. Continue?')) {
      return;
    }

    try {
      await api.delete('/api/users/me'); // ← Fixed
      alert('Your account has been permanently deleted. You will now be logged out.');
      localStorage.clear();
      navigate('/');
    } catch (err) {
      alert('Failed to delete account: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
      <div className="spinner-border text-primary" style={{ width: '5rem', height: '5rem' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-primary fs-4 ms-4">Loading seller profile...</p>
    </div>
  );

  if (error) return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-danger">
      <div className="alert alert-danger text-center fs-4">{error}</div>
    </div>
  );

  if (!profile) return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-secondary">
      <div className="alert alert-secondary text-center fs-4">Seller not found</div>
    </div>
  );

  return (
    <div className="bg-dark text-white pb-5">
      {/* Hero / Cover Photo */}
      <div className="position-relative" style={{ height: '500px', overflow: 'hidden' }}>
        <img
          src={coverPreview || profile.cover_image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920'}
          alt="Cover"
          className="w-100 h-100 object-cover brightness-75"
        />

        {isOwner && (
          <div className="position-absolute top-0 start-0 end-0 bottom-0 bg-black bg-opacity-50 d-flex align-items-center justify-content-center opacity-0 hover:opacity-100 transition">
            {editMode ? (
              <div className="text-center">
                <label className="btn btn-primary btn-lg">
                  Change Cover Photo
                  <input type="file" accept="image/*" onChange={handleCoverChange} className="d-none" />
                </label>
                {coverPreview && <p className="text-light mt-3">New preview loaded</p>}
              </div>
            ) : (
              <button
                onClick={handleEditToggle}
                className="btn btn-light btn-lg shadow-lg"
              >
                Edit Profile
              </button>
            )}
          </div>
        )}

        {!isOwner && localStorage.getItem('role') === 'admin' && (
          <button
            onClick={handleAdminCoverChange}
            className="btn btn-info position-absolute top-0 end-0 m-3"
          >
            Change Cover (Admin)
          </button>
        )}
      </div>

      {/* Profile Info Card */}
      <div className="container" style={{ marginTop: '-100px' }}>
        <div className="card bg-dark border-secondary shadow-lg">
          <div className="card-body p-5">
            <div className="row g-5 align-items-center">
              <div className="col-md-4 text-center">
                <div className="position-relative d-inline-block">
                  <img
                    src={avatarPreview || profile.avatar_url || 'https://via.placeholder.com/192?text=User'}
                    alt="Profile avatar"
                    className="rounded-circle border border-4 border-primary shadow-lg object-fit-cover"
                    style={{ width: '180px', height: '180px' }}
                  />
                </div>
              </div>

              <div className="col-md-8">
                {editMode ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={formData.shop_name}
                      onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                      placeholder="Shop / Business Name"
                      className="form-control form-control-lg bg-secondary text-white border-secondary focus:border-primary"
                    />
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell buyers about your shop..."
                      rows={5}
                      className="form-control form-control-lg bg-secondary text-white border-secondary focus:border-primary"
                    />
                    <div className="mb-4">
                      <label className="form-label text-light fw-medium">Profile Picture (Avatar)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="form-control bg-secondary text-white border-secondary"
                      />
                      {avatarPreview && (
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="mt-3 rounded-circle shadow"
                          style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                        />
                      )}
                    </div>

                    <div className="d-flex flex-column flex-sm-row gap-3">
                      <button
                        onClick={handleSave}
                        className="btn btn-success btn-lg flex-grow-1"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className="btn btn-secondary btn-lg flex-grow-1"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="mt-5 pt-4 border-top border-danger">
                      <h3 className="text-danger fw-bold mb-3">Danger Zone</h3>
                      <p className="text-secondary mb-4">
                        Deleting your account is <strong>permanent</strong> and <strong>cannot be undone</strong>.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        className="btn btn-danger btn-lg w-100"
                      >
                        Delete My Account Permanently
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="display-5 fw-bold mb-3 text-white">
                      {profile.shop_name || profile.username}
                    </h1>
                    <p className="text-primary fs-4 mb-3">@{profile.username}</p>
                    {profile.bio && (
                      <p className="text-secondary fs-5 mb-4">
                        {profile.bio}
                      </p>
                    )}
                    <p className="text-secondary fs-5 mb-4">
                      Contact on WhatsApp: {' '}
                      <a
                        href={`https://wa.me/${profile.whatsapp_phone}`}
                        className="text-success fw-medium text-decoration-none"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {profile.whatsapp_phone || 'Not provided'}
                      </a>
                    </p>

                    {isOwner && (
                      <button
                        onClick={handleEditToggle}
                        className="btn btn-primary btn-lg"
                      >
                        Edit Profile
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="mt-5">
          <h2 className="text-center display-6 fw-bold text-light mb-5">
            Listings ({listings.length})
          </h2>

          {listings.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-secondary fs-4 mb-4">
                No approved listings yet.
              </p>
              {isOwner && (
                <Link
                  to="/create-listing"
                  className="btn btn-success btn-lg px-5 py-3"
                >
                  Post Your First Listing
                </Link>
              )}
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {listings.map((listing) => (
                <div key={listing.id} className="col">
                  <ListingCard
                    listing={listing}
                    onDelete={handleDelete}
                    showDelete={isOwner}
                    onUpdateStock={handleUpdateStock}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ratings Received - only for owner */}
        {isOwner && (
          <div className="mt-5">
            <h2 className="text-center display-6 fw-bold text-light mb-5">
              Ratings I've Received ({ratings.length})
            </h2>

            {ratings.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-secondary fs-4">No ratings received yet.</p>
              </div>
            ) : (
              <div className="row g-4">
                {ratings.map((r) => (
                  <div key={r.id} className="col-md-6">
                    <div className="card bg-secondary border-0 shadow h-100">
                      <div className="card-body">
                        <div className="d-flex align-items-center gap-2 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`fs-3 ${i < r.rating ? 'text-warning' : 'text-muted'}`}
                            />
                          ))}
                        </div>
                        <p className="card-text mb-2">
                          <strong className="text-light">{r.rater_username || 'Anonymous'}</strong> rated your listing:
                          <span className="text-primary fw-medium"> "{r.listing_title}"</span>
                        </p>
                        {r.comment && <p className="card-text text-muted fst-italic">"{r.comment}"</p>}
                        <p className="text-muted small mt-2">
                          {new Date(r.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <button
                          onClick={() => handleDeleteRating(r.id)}
                          className="btn btn-danger btn-sm mt-3"
                        >
                          Delete Rating
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}