import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../utils/api';

const ListingCard = ({ listing, onDelete, showDelete = false }) => {
  console.log('Rendering card for:', listing?.title, 'Phone:', listing?.whatsapp_phone);

  const navigate = useNavigate();

  const {
    id,
    title = 'No Title',
    price: rawPrice = 0,
    description = 'No description available',
    condition = 'Unknown',
    whatsapp_phone = '',
    image_url = 'https://placehold.co/400x300?text=No+Image',
    image_urls = [],
    user_id,
    stock_quantity: rawStock = 0,
    average_rating: rawAvg = 0,
    rating_count: rawCount = 0,
    variants = [],
  } = listing || {};

  const price = Number(rawPrice) || 0;
  const stock = Number(rawStock) || 0;
  const avgRating = Number(rawAvg) || 0;
  const ratingCount = Number(rawCount) || 0;

  const hasPhone = whatsapp_phone?.trim();
  const message = `Hi! Interested in your ${title} for K${price.toFixed(0)} on Campus-Connect!`;

  const currentUserId = Number(localStorage.getItem('userId')) || null;
  const userRole = localStorage.getItem('role') || 'user';
  const isOwner = currentUserId && user_id === currentUserId;
  const isAdmin = userRole === 'admin';
  const canDelete = (isOwner || isAdmin) && showDelete;

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingError, setRatingError] = useState(null);

  const handleSubmitRating = async () => {
    if (userRating === 0) {
      setRatingError('Please select a rating');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setRatingError('Please log in to submit a rating');
      return;
    }

    try {
      await api.post(`/api/listings/${id}/rating`, {
        rating: userRating,
        comment: ratingComment.trim(),
      });

      alert('Thank you! Your rating has been submitted.');
      setShowRatingModal(false);
      setUserRating(0);
      setRatingComment('');
      setRatingError(null);
    } catch (err) {
      console.error('Rating submission failed:', err);
      setRatingError(
        err.response?.data?.message || 'Failed to submit rating. Please try again.'
      );
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      await api.delete(`/api/listings/${id}`);
      alert('Listing deleted successfully');
      if (onDelete) onDelete(id);
    } catch (err) {
      alert('Failed to delete listing');
      console.error(err);
    }
  };

  const stopPropagation = (e) => e.stopPropagation();

  const mainImage = image_urls.length > 0 ? image_urls[0] : image_url;

  const openRatingModal = (e) => {
    e.stopPropagation();
    if (!currentUserId) {
      alert('Please log in to leave a rating');
      return;
    }
    setShowRatingModal(true);
  };

  return (
    <Link to={`/listings/${id}`} className="text-decoration-none">
      <div className="card bg-dark border-secondary shadow-lg h-100 transition-all hover:shadow-xl hover:border-primary position-relative overflow-hidden">
        {/* Image section */}
        <div className="position-relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
          <img
            src={mainImage}
            alt={title}
            className="card-img-top img-fluid object-fit-cover w-100 h-100 transition-transform hover:scale-105 duration-500"
            onError={(e) => {
              e.target.src = 'https://placehold.co/400x300?text=Image+Not+Found';
            }}
          />

          {image_urls.length > 1 && (
            <span className="position-absolute top-0 start-0 m-3 badge bg-primary fs-6 px-3 py-2">
              {image_urls.length} photos
            </span>
          )}

          {variants.length > 0 && (
            <span className="position-absolute top-0 start-50 translate-middle-x m-3 badge bg-info fs-6 px-3 py-2">
              Variants available
            </span>
          )}

          {stock > 0 && stock <= 5 && (
            <span className="position-absolute top-0 end-0 m-3 badge bg-danger fs-6 px-3 py-2">
              Only {stock} left!
            </span>
          )}

          {stock === 0 && (
            <div className="position-absolute inset-0 bg-black bg-opacity-70 d-flex align-items-center justify-content-center">
              <span className="bg-danger text-white px-5 py-3 rounded-pill fs-4 fw-bold shadow-lg transform rotate-n2">
                Sold Out
              </span>
            </div>
          )}

          <span className="position-absolute bottom-0 start-0 m-3 badge bg-secondary fs-6 px-3 py-2">
            {condition}
          </span>

          <div className="position-absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>

        {/* Card body */}
        <div className="card-body d-flex flex-column">
          <h3 className="card-title text-light fw-bold mb-3 line-clamp-2">{title}</h3>

          <div className="d-flex align-items-baseline gap-3 mb-3">
            <span className="fs-3 fw-bold text-success">K{price.toLocaleString()}</span>
            {price > 500 && (
              <span className="text-muted text-decoration-line-through">
                K{(price * 1.2).toLocaleString()}
              </span>
            )}
          </div>

          {/* Rating display – clickable to open modal */}
          <div
            className="d-flex align-items-center gap-2 mb-4 cursor-pointer hover:opacity-75 transition"
            onClick={openRatingModal}
          >
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`fs-5 ${i < Math.round(avgRating) ? 'text-warning' : 'text-secondary'}`}
              >
                ★
              </span>
            ))}
            {ratingCount > 0 ? (
              <span className="text-secondary ms-2">
                {avgRating.toFixed(1)} ({ratingCount})
              </span>
            ) : (
              <span className="text-muted ms-2">No ratings yet</span>
            )}
          </div>

          <p className="card-text text-secondary mb-4 line-clamp-4 flex-grow-1">
            {description}
          </p>

          {/* Variants */}
          {variants.length > 0 && (
            <div className="mb-4">
              <h5 className="text-light mb-3">Available Variants</h5>
              <div className="row g-3">
                {variants.map((v, i) => (
                  <div key={i} className="col-6">
                    <div
                      className={`card text-center p-3 border-0 shadow-sm ${
                        v.stock > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'
                      }`}
                    >
                      <div className="fw-bold">
                        {v.color || '—'} {v.size ? `/ ${v.size}` : ''}
                      </div>
                      <div className="small fw-medium">Stock: {v.stock}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WhatsApp / Out of stock button */}
          <div onClick={stopPropagation}>
            {stock > 0 ? (
              <button
                onClick={() => {
                  if (!hasPhone) return;

                  const productUrl = `${window.location.origin}/listings/${id}`;
                  navigator.clipboard
                    .writeText(productUrl)
                    .then(() => alert('Product link copied! Paste in WhatsApp.'))
                    .catch(() => alert('Could not copy link. Copy manually.'));

                  window.open(
                    `https://wa.me/${whatsapp_phone}?text=${encodeURIComponent(message)}`,
                    '_blank',
                    'noopener,noreferrer'
                  );
                }}
                className={`btn w-100 d-flex align-items-center justify-content-center gap-3 py-3 fw-bold ${
                  hasPhone ? 'btn-success' : 'btn-secondary disabled'
                }`}
                disabled={!hasPhone}
              >
                <FaWhatsapp size={24} />
                {hasPhone ? 'Message on WhatsApp' : 'No Contact Info'}
              </button>
            ) : (
              <div className="alert alert-warning text-center mb-0 d-flex align-items-center justify-content-center gap-2 py-3">
                <FaWhatsapp size={24} />
                Out of Stock
              </div>
            )}
          </div>

          {/* Seller profile link */}
          {user_id && Number.isInteger(user_id) && (
            <div className="text-center mt-4" onClick={stopPropagation}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile/${user_id}`);
                }}
                className="btn btn-outline-light btn-sm"
              >
                View seller profile →
              </button>
            </div>
          )}

          {/* Delete button (admin/owner) */}
          {showDelete && canDelete && (
            <button
              onClick={handleDelete}
              className="btn btn-danger position-absolute top-0 end-0 m-3"
            >
              Delete
            </button>
          )}
        </div>

        {/* Rating Modal */}
        {showRatingModal && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
            onClick={() => setShowRatingModal(false)}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div
                className="modal-content bg-dark text-white border-secondary"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header border-secondary">
                  <h5 className="modal-title">Rate this listing</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowRatingModal(false)}
                  />
                </div>

                <div className="modal-body">
                  <div className="d-flex justify-content-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className={`btn btn-link p-0 fs-1 ${
                          star <= userRating ? 'text-warning' : 'text-secondary'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                    placeholder="Optional comment..."
                    rows={4}
                    className="form-control bg-secondary text-white border-secondary focus:border-primary mb-4"
                  />

                  {ratingError && (
                    <div className="alert alert-danger text-center">{ratingError}</div>
                  )}

                  <button
                    onClick={handleSubmitRating}
                    className="btn btn-primary w-100 btn-lg"
                  >
                    Submit Rating
                  </button>

                  <button
                    onClick={() => setShowRatingModal(false)}
                    className="btn btn-secondary w-100 mt-3"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ListingCard;