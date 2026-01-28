import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../utils/api';

export default function ListingDetail() {
  const { id } = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitError, setSubmitError] = useState(null);
  const [hasRated, setHasRated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);

  const fetchListingAndRatingStatus = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get(`/api/listings/${id}`);
      setListing(data);

      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data: status } = await api.get(`/api/listings/${id}/rating-status`);
          setHasRated(status.hasRated);
          if (status.hasRated && status.previousRating) {
            setSelectedRating(status.previousRating);
          }
        } catch (statusErr) {
          console.debug('Rating status fetch failed (likely not logged in)', statusErr);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load listing. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchListingAndRatingStatus();
  }, [fetchListingAndRatingStatus]);

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (hasRated) return;

    if (selectedRating === 0) {
      setSubmitError('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in to rate this listing');

      await api.post(`/api/listings/${id}/rating`, {
        rating: selectedRating,
        comment: comment.trim(),
      });

      setHasRated(true);
      setComment('');
      alert('Thank you for your rating!');
      await fetchListingAndRatingStatus(); // refresh average & status
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit rating');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <div className="spinner-border text-primary" style={{ width: '5rem', height: '5rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-vh-100 bg-dark d-flex align-items-center justify-content-center text-white">
        <div className="alert alert-danger fs-4 text-center p-5">
          {error || 'Listing not found'}
        </div>
      </div>
    );
  }

  const {
    title = 'No Title',
    price = 0,
    description = 'No description available',
    condition = 'Unknown',
    whatsapp_phone = '',
    image_url = 'https://placehold.co/600x600?text=No+Image',
    image_urls = [],
    user_id,
    stock_quantity = 0,
    average_rating = 0,
    rating_count = 0,
    variants = [],
  } = listing;

  const hasPhone = whatsapp_phone?.trim?.();
  const mainImage = image_urls[selectedImage] || image_url;
  const message = `Hi! Interested in your ${title} for K${Number(price).toFixed(0)} on Campus-Connect!`;

  const roundedAvg = Math.round(average_rating);

  return (
    <div className="min-vh-100 bg-dark text-white py-5">
      <div className="container">
        <div className="row g-5">
          {/* Images Column */}
          <div className="col-lg-6">
            <div className="card bg-dark border-secondary shadow-lg overflow-hidden position-relative">
              <img
                src={mainImage}
                alt={title}
                className="img-fluid object-fit-cover w-100"
                style={{ height: '520px' }}
                onError={(e) => (e.target.src = 'https://placehold.co/600x600?text=Image+Not+Found')}
              />
              {stock_quantity === 0 && (
                <div className="position-absolute top-50 start-50 translate-middle bg-danger text-white px-5 py-4 rounded-pill fs-3 fw-bold shadow-lg">
                  Sold Out
                </div>
              )}
            </div>

            {image_urls.length > 1 && (
              <div className="row g-2 mt-3">
                {image_urls.map((img, idx) => (
                  <div key={idx} className="col-3">
                    <button
                      type="button"
                      onClick={() => setSelectedImage(idx)}
                      className={`w-100 p-1 rounded border-2 ${
                        selectedImage === idx ? 'border-primary border-3' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="img-fluid rounded" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="col-lg-6">
            <div className="card bg-dark border-secondary shadow-lg">
              <div className="card-body p-5">
                <h1 className="display-5 fw-bold mb-4">{title}</h1>

                <div className="d-flex align-items-baseline gap-3 mb-4">
                  <span className="display-6 fw-bold text-success">K{Number(price).toLocaleString()}</span>
                  {price > 1000 && (
                    <span className="fs-4 text-muted text-decoration-line-through">
                      K{Math.round(price * 1.15).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Current Rating Display */}
                <div className="mb-4">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`fs-4 ${i < roundedAvg ? 'text-warning' : 'text-secondary'}`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-secondary ms-2">
                      {average_rating.toFixed(1)} ({rating_count} {rating_count === 1 ? 'rating' : 'ratings'})
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="fw-medium text-light me-2">Condition:</span>
                  <span
                    className={`badge fs-5 px-4 py-2 ${
                      condition.toLowerCase().includes('new') ? 'bg-success' : 'bg-warning'
                    }`}
                  >
                    {condition}
                  </span>
                </div>

                <div className="mb-5">
                  <span className="fw-medium text-light me-2">Stock:</span>{' '}
                  {stock_quantity > 0 ? (
                    <span
                      className={`fw-bold fs-5 ${
                        stock_quantity <= 3 ? 'text-danger' : stock_quantity <= 10 ? 'text-warning' : 'text-success'
                      }`}
                    >
                      {stock_quantity} available
                    </span>
                  ) : (
                    <span className="fw-bold text-danger fs-5">Out of stock</span>
                  )}
                </div>

                {variants.length > 0 && (
                  <div className="mb-5">
                    <h3 className="fw-bold text-light mb-3">Available Variants</h3>
                    <div className="row g-3">
                      {variants.map((v, i) => (
                        <div key={i} className="col-md-6">
                          <div
                            className={`card text-center p-3 border-0 shadow-sm ${
                              v.stock > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'
                            }`}
                          >
                            <h5 className="mb-2">
                              {v.color || '—'} {v.size ? `/ ${v.size}` : ''}
                            </h5>
                            <div className="fw-bold">
                              Stock: {v.stock}
                              {v.stock === 0 && <span className="text-danger ms-2">(Out)</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-secondary mb-5 lead">{description}</p>

                {/* WhatsApp CTA */}
                {hasPhone && stock_quantity > 0 ? (
                  <button
                    onClick={() => {
                      navigator.clipboard
                        .writeText(window.location.href)
                        .then(() => alert('Link copied! Paste in WhatsApp.'))
                        .catch(() => alert('Could not copy — copy URL manually.'));
                      window.open(
                        `https://wa.me/${whatsapp_phone}?text=${encodeURIComponent(message)}`,
                        '_blank',
                        'noopener,noreferrer'
                      );
                    }}
                    className="btn btn-success btn-lg w-100 mb-5 d-flex align-items-center justify-content-center gap-3 shadow"
                  >
                    <FaWhatsapp size={28} />
                    Message Seller on WhatsApp
                  </button>
                ) : (
                  <div className="alert alert-warning text-center mb-5 py-3">
                    {stock_quantity === 0 ? 'This item is out of stock' : 'No contact info available'}
                  </div>
                )}

                {user_id && (
                  <div className="text-center mb-5">
                    <Link to={`/profile/${user_id}`} className="btn btn-outline-light btn-lg px-5">
                      View seller profile →
                    </Link>
                  </div>
                )}

                {/* Rating Form */}
                <div className="card bg-secondary-subtle border-0 shadow mt-5">
                  <div className="card-body p-5">
                    <h3 className="text-center fw-bold mb-4">Rate this listing</h3>

                    {hasRated ? (
                      <div className="alert alert-success text-center py-4">
                        Thank you! You've already rated this listing.
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitRating}>
                        <div className="d-flex justify-content-center gap-1 gap-md-2 mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setSelectedRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              aria-label={`Rate ${star} stars`}
                              className={`btn btn-link p-0 fs-1 transition-all hover:scale-110 ${
                                star <= (hoverRating || selectedRating) ? 'text-warning' : 'text-secondary'
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>

                        <div className="mb-4">
                          <label htmlFor="comment" className="form-label fw-medium text-dark d-block mb-2">
                            Comment (optional)
                          </label>
                          <textarea
                            id="comment"
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="form-control bg-dark text-white border-secondary focus:border-primary"
                            placeholder="Share your experience or suggestions..."
                          />
                        </div>

                        {submitError && (
                          <div className="alert alert-danger text-center mb-4">{submitError}</div>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmitting || hasRated}
                          className="btn btn-primary btn-lg w-100 fw-bold"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                              Submitting...
                            </>
                          ) : (
                            'Submit Rating'
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}