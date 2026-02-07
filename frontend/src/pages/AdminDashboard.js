import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import api from '../utils/api'; // ← Import the api helper
import ListingCard from '../components/ListingCard';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [pendingListings, setPendingListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [feedback, setFeedback] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackError, setFeedbackError] = useState(null);

  const [uploadStatus, setUploadStatus] = useState('');

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const isAdmin = role === 'admin';

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (!isAdmin) {
      return; // No fetch needed for non-admins
    }

    const fetchPending = async () => {
      try {
        const res = await api.get('/api/admin/pending'); // ← Fixed URL
        setPendingListings(res.data.data || []);
      } catch (err) {
        setError('Failed to load pending listings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchFeedback = async () => {
      try {
        const res = await api.get('/api/feedback'); // ← Fixed URL
        setFeedback(res.data);
      } catch (err) {
        setFeedbackError('Failed to load feedback');
        console.error(err);
      } finally {
        setFeedbackLoading(false);
      }
    };

    fetchPending();
    fetchFeedback();
  }, [token, isAdmin, navigate]);

  const handleApproveReject = async (id, action) => {
    const verb = action === 'approved' ? 'approve' : 'reject';
    if (!window.confirm(`Are you sure you want to ${verb} this listing?`)) return;

    try {
      await api.patch(`/api/admin/listings/${id}`, { status: action }); // ← Fixed URL + no headers needed
      setPendingListings(prev => prev.filter(l => l.id !== id));
      alert(`Listing ${verb}d successfully`);
    } catch (err) {
      alert(`Failed to ${verb} listing`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing permanently?')) return;

    try {
      await api.delete(`/api/listings/${id}`); // ← Fixed URL + no headers needed
      setPendingListings(prev => prev.filter(l => l.id !== id));
      alert('Listing deleted successfully');
    } catch (err) {
      alert('Failed to delete listing');
    }
  };

  const handleChangeSellerCover = async (sellerId) => {
    const url = prompt('Enter new cover image URL for this seller:');
    if (!url) return;

    try {
      await api.put(`/api/users/${sellerId}/cover`, { cover_image_url: url }); // ← Fixed URL
      alert('Cover image updated successfully!');
    } catch (err) {
      alert('Failed to update cover image');
    }
  };

  const handleHeroUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('Uploading...');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const uploadRes = await api.post('/api/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, // ← Keep multipart header
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadStatus(`Uploading... ${percent}%`);
        },
      });

      const newUrl = uploadRes.data.url;

      await api.put('/api/settings/hero', { hero_image_url: newUrl }); // ← Fixed URL

      setUploadStatus('Success! Hero updated.');
      alert('Hero image updated! Refresh the home page to see the change.');
    } catch (err) {
      setUploadStatus('Failed');
      alert('Upload failed');
      console.error(err);
    }
  };

  if (!token) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-danger fs-4">
        Access denied: Admin dashboard only
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center text-primary fs-4">
        Loading pending listings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center text-danger fs-4">
        {error}
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-dark text-white py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">

            {/* Hero Upload Section */}
            <div className="card bg-dark border-secondary mb-5 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-center text-light mb-4">
                  Update Home Page Hero Image
                </h2>
                <p className="text-center text-secondary mb-4">
                  Upload a new background for the home page hero section
                </p>

                <div className="d-flex justify-content-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroUpload}
                    className="form-control form-control-lg w-75 bg-secondary text-white border-secondary"
                  />
                </div>

                {uploadStatus && (
                  <p className={`text-center mt-3 fw-bold ${uploadStatus.includes('Success') ? 'text-success' : 'text-warning'}`}>
                    {uploadStatus}
                  </p>
                )}
              </div>
            </div>

            {/* Pending Listings */}
            <h1 className="text-center display-4 fw-bold mb-5 text-light">
              Admin Dashboard – Pending Listings
            </h1>

            {pendingListings.length === 0 ? (
              <p className="text-center text-secondary fs-5 py-5">
                No pending listings to review at the moment.
              </p>
            ) : (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {pendingListings.map((listing) => (
                  <div key={listing.id} className="col">
                    <div className="card bg-dark border-secondary h-100 shadow">
                      <ListingCard listing={listing} onDelete={handleDelete} />

                      <div className="card-footer bg-transparent border-0 d-flex flex-wrap gap-2 p-4">
                        <button
                          onClick={() => handleApproveReject(listing.id, 'approved')}
                          className="btn btn-success flex-grow-1"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => handleApproveReject(listing.id, 'rejected')}
                          className="btn btn-danger flex-grow-1"
                        >
                          Reject
                        </button>

                        <button
                          onClick={() => handleChangeSellerCover(listing.user_id)}
                          className="btn btn-info flex-grow-1"
                        >
                          Change Seller Cover
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* User Feedback Section */}
            <div className="card bg-dark border-secondary mt-5 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-center text-light mb-4">
                  User Feedback
                </h2>

                {feedbackLoading ? (
                  <p className="text-center text-primary">Loading feedback...</p>
                ) : feedbackError ? (
                  <p className="text-center text-danger">{feedbackError}</p>
                ) : feedback.length === 0 ? (
                  <p className="text-center text-secondary py-5">No feedback submitted yet.</p>
                ) : (
                  <div className="row row-cols-1 row-cols-md-2 g-4">
                    {feedback.map((fb) => (
                      <div key={fb.id} className="col">
                        <div className="card bg-secondary border-0 shadow">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <div className="d-flex align-items-center gap-2">
                                <div className="d-flex">
                                  {[...Array(5)].map((_, i) => (
                                    <FaStar
                                      key={i}
                                      className={`text-warning ${i < fb.rating ? 'text-warning' : 'text-muted'}`}
                                    />
                                  ))}
                                </div>
                                <small className="text-muted">
                                  by {fb.username || 'Anonymous'}
                                </small>
                              </div>
                              <small className="text-muted">
                                {new Date(fb.created_at).toLocaleDateString()}
                              </small>
                            </div>
                            {fb.comment && <p className="card-text text-light">{fb.comment}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}