import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaWhatsapp } from 'react-icons/fa';
import api from '../utils/api'; // ← Import the centralized API helper (adjust path if needed)

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [hasRatedThis, setHasRatedThis] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);

  const fetchListingAndRatingStatus = async () => {
    try {
      const listingRes = await api.get(`/api/listings/${id}`); // ← Fixed
      setListing(listingRes.data);

      const token = localStorage.getItem('token');
      if (token) {
        try {
          const statusRes = await api.get(`/api/listings/${id}/rating-status`); // ← Fixed
          const { hasRated, previousRating } = statusRes.data;
          setHasRatedThis(hasRated);

          if (hasRated) {
            setSubmitted(true);
            setRating(previousRating || 0);
          }
        } catch (statusErr) {
          console.log('Rating status check failed (possibly not logged in):', statusErr);
        }
      }
    } catch (err) {
      setError('Failed to load listing');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListingAndRatingStatus();
  }, [id]);

  const handleSubmitRating = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setSubmitError('Please select a rating');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in to submit rating');

      await api.post(`/api/listings/${id}/rating`, { rating, comment }); // ← Fixed

      setSubmitted(true);
      setHasRatedThis(true);
      setRating(0);
      setComment('');
      setSubmitError(null);
      alert('Thank you for your rating!');

      await fetchListingAndRatingStatus();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit rating');
      console.error(err);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
      <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-danger">
      <div className="alert alert-danger text-center fs-4">{error}</div>
    </div>
  );

  if (!listing) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-secondary">
      <div className="alert alert-secondary text-center fs-4">Listing not found</div>
    </div>
  );

  const {
    title = 'No Title',
    price: rawPrice = 0,
    description = 'No description available',
    condition = 'Unknown',
    whatsapp_phone = '',
    image_url = 'https://placehold.co/600x600?text=No+Image',
    image_urls = [],
    user_id,
    stock_quantity: rawStock = 0,
    average_rating: rawAvg = 0,
    rating_count: rawCount = 0,
    variants = [],
  } = listing;

  const price = Number(rawPrice) || 0;
  const stock_quantity = Number(rawStock) || 0;
  const average_rating = Number(rawAvg) || 0;
  const rating_count = Number(rawCount) || 0;

  const message = `Hi! Interested in your ${title} for K${price.toFixed(0)} on Campus-Connect!`;
  const hasPhone = !!whatsapp_phone && whatsapp_phone.trim() !== '';
  const mainImage = image_urls.length > 0 ? image_urls[selectedImage] : image_url;

  return (
    <div className="min-vh-100 bg-dark text-white py-5">
      <div className="container">
        <div className="row g-5">
          {/* Images Gallery */}
          <div className="col-lg-6">
            <div className="card bg-dark border-secondary shadow-lg overflow-hidden">
              <img
                src={mainImage}
                alt={title}
                className="card-img-top img-fluid object-fit-cover"
                style={{ height: '500px' }}
              />
              {stock_quantity === 0 && (
                <div className="position-absolute top-50 start-50 translate-middle bg-danger text-white px-5 py-3 rounded-pill fs-3 fw-bold shadow">
                  Sold Out
                </div>
              )}
            </div>

            {image_urls.length > 1 && (
              <div className="row g-2 mt-3">
                {image_urls.map((img, index) => (
                  <div key={index} className="col-3">
                    <button
                      onClick={() => setSelectedImage(index)}
                      className={`btn btn-link p-0 w-100 ${selectedImage === index ? 'border border-primary border-2' : ''}`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="img-fluid rounded shadow-sm"
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="col-lg-6">
            <div className="card bg-dark border-secondary shadow-lg">
              <div className="card-body p-5">
                <h1 className="card-title display-5 fw-bold mb-4">{title}</h1>

                <div className="d-flex align-items-baseline gap-3 mb-4">
                  <span className="display-6 fw-bold text-success">
                    K{price.toLocaleString()}
                  </span>
                  {price > 1000 && (
                    <span className="fs-4 text-muted text-decoration-line-through">
                      K{(price * 1.15).toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <span className="fw-medium text-light me-2">Condition:</span>
                  <span className={`badge bg-${condition.toLowerCase().includes('new') ? 'success' : 'warning'} fs-5 px-3 py-2`}>
                    {condition}
                  </span>
                </div>

                <div className="mb-5">
                  <span className="fw-medium text-light me-2">Stock:</span>{' '}
                  {stock_quantity > 0 ? (
                    <span className={`fw-bold fs-5 ${stock_quantity <= 3 ? 'text-danger' : stock_quantity <= 10 ? 'text-warning' : 'text-success'}`}>
                      {stock_quantity} available
                    </span>
                  ) : (
                    <span className="fw-bold text-danger fs-5">Out of stock</span>
                  )}
                </div>

                {/* Variants Display */}
                {variants.length > 0 && (
                  <div className="mb-5">
                    <h3 className="fw-bold text-light mb-3">Available Variants</h3>
                    <div className="row g-3">
                      {variants.map((v, i) => (
                        <div key={i} className="col-md-6 col-lg-4">
                          <div className={`card bg-${v.stock > 0 ? 'success' : 'danger'}-subtle border-0 shadow-sm h-100`}>
                            <div className="card-body text-center">
                              <h5 className="card-title text-dark">
                                {v.color || '—'} {v.size ? `/ ${v.size}` : ''}
                              </h5>
                              <p className={`fw-bold fs-5 ${v.stock > 0 ? 'text-success' : 'text-danger'}`}>
                                {v.stock} in stock
                              </p>
                              {v.stock === 0 && (
                                <p className="text-danger small mb-0">Out of stock for this option</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-secondary mb-5">{description}</p>

                {/* WhatsApp Button */}
                {hasPhone && stock_quantity > 0 ? (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href)
                        .then(() => alert('Product link copied to clipboard!\nPaste it in WhatsApp for reference.'))
                        .catch(() => alert('Could not copy link automatically.\nRight-click the page and copy the URL manually.'));

                      window.open(
                        `https://wa.me/${whatsapp_phone}?text=${encodeURIComponent(message)}`,
                        '_blank',
                        'noopener,noreferrer'
                      );
                    }}
                    className="btn btn-success btn-lg w-100 mb-4 d-flex align-items-center justify-content-center gap-3 shadow-lg"
                  >
                    <FaWhatsapp size={24} />
                    Message Seller on WhatsApp
                  </button>
                ) : (
                  <div className="alert alert-warning text-center mb-4">
                    {stock_quantity === 0 ? 'Out of Stock' : 'No contact information available'}
                  </div>
                )}

                {user_id && (
                  <div className="text-center mb-5">
                    <Link
                      to={`/profile/${user_id}`}
                      className="btn btn-outline-light btn-lg"
                    >
                      View seller profile →
                    </Link>
                  </div>
                )}

                {/* Rating Form */}
                <div className="card bg-secondary border-0 shadow">
                  <div className="card-body p-5">
                    <h3 className="card-title text-center fw-bold mb-4">Rate this listing</h3>

                    {submitted || hasRatedThis ? (
                      <div className="alert alert-success text-center">
                        Thank you for your feedback! {hasRatedThis && '(You already rated this listing)'}
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitRating}>
                        {/* Stars */}
                        <div className="d-flex justify-content-center gap-2 mb-4">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className={`btn btn-link p-0 fs-1 ${star <= (hoverRating || rating) ? 'text-warning' : 'text-secondary'}`}
                            >
                              ★
                            </button>
                          ))}
                        </div>

                        {/* Comment */}
                        <div className="mb-4">
                          <label htmlFor="comment" className="form-label fw-medium text-light">Comment (optional)</label>
                          <textarea
                            id="comment"
                            rows={4}
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            className="form-control bg-dark text-white border-secondary focus:border-primary"
                            placeholder="What did you like? Any suggestions?"
                          />
                        </div>

                        {submitError && (
                          <div className="alert alert-danger text-center mb-4">{submitError}</div>
                        )}

                        <button
                          type="submit"
                          disabled={hasRatedThis}
                          className={`btn btn-primary btn-lg w-100 ${hasRatedThis ? 'disabled' : ''}`}
                        >
                          {hasRatedThis ? 'Already Rated' : 'Submit Rating'}
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