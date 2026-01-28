import { useState } from 'react';
import api from '../utils/api';

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to submit feedback');
      }

      await api.post('/api/feedback', {
        rating,
        comment: comment.trim(),
      });

      setSubmitted(true);
      setRating(0);
      setComment('');
      setHover(0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-dark text-white py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">

            <div className="card bg-dark border-secondary shadow-xl rounded-4 overflow-hidden">
              <div className="card-body p-4 p-md-5">

                <h1 className="text-center display-5 fw-bold text-primary mb-4">
                  Your Feedback Matters
                </h1>

                <p className="text-center text-secondary lead mb-5">
                  Help us make Campus-Connect better — tell us what you love and what we can improve.
                </p>

                {submitted ? (
                  <div className="text-center py-5 my-5">
                    <div className="mx-auto mb-4" style={{ width: '90px', height: '90px' }}>
                      <div className="bg-success rounded-circle d-flex align-items-center justify-content-center w-100 h-100 shadow">
                        <svg className="text-white" width="50" height="50" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022z"/>
                        </svg>
                      </div>
                    </div>
                    <h2 className="text-success fw-bold mb-3">Thank You!</h2>
                    <p className="text-secondary fs-5">
                      Your feedback has been successfully received.<br />
                      We really appreciate your time!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {/* Rating Stars */}
                    <div className="mb-5 text-center">
                      <label className="form-label fw-medium fs-4 text-light mb-3 d-block">
                        How would you rate your experience?
                      </label>
                      <div className="d-flex justify-content-center gap-1 gap-md-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            aria-label={`Rate ${star} out of 5 stars`}
                            className={`btn btn-link p-0 fs-1 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary ${
                              star <= (hover || rating) ? 'text-warning' : 'text-secondary'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    <div className="mb-5">
                      <label htmlFor="comment" className="form-label fw-medium fs-4 text-light mb-3 d-block">
                        Tell us more (optional)
                      </label>
                      <textarea
                        id="comment"
                        rows={5}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="form-control form-control-lg bg-secondary text-white border-secondary focus:border-primary focus:ring-primary"
                        placeholder="What do you like most? What could be improved? Any suggestions or issues?"
                      />
                    </div>

                    {error && (
                      <div className="alert alert-danger text-center mb-4">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || rating === 0}
                      className={`btn btn-primary btn-lg w-100 fw-bold d-flex align-items-center justify-content-center gap-2 ${
                        loading ? 'opacity-75' : ''
                      }`}
                    >
                      {loading && (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                      )}
                      {loading ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            <p className="text-center text-muted mt-4 small">
              Your feedback is anonymous and will help us improve Campus-Connect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}