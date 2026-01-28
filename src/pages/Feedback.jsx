import { useState } from 'react';
import api from '../utils/api'; // ← Import the centralized API helper
import { FaStar } from 'react-icons/fa'; // if you're using stars elsewhere, but not needed here

export default function Feedback() {
  const [rating, setRating] = useState(0);
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
      if (!token) throw new Error('Please log in to submit feedback');

      await api.post('/api/feedback', { rating, comment }); // ← Fixed: using api helper

      setSubmitted(true);
      setRating(0);
      setComment('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
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

            <div className="card bg-dark border-secondary shadow-lg rounded-4 overflow-hidden">
              <div className="card-body p-5 p-md-5">
                <h1 className="card-title text-center display-5 fw-bold text-primary mb-5">
                  Your Feedback Matters
                </h1>

                <p className="text-center text-secondary lead mb-5">
                  Tell us what you love about Campus-Connect and what we can improve.
                </p>

                {submitted ? (
                  <div className="text-center py-5">
                    <div className="mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                      <div className="bg-success rounded-circle d-flex align-items-center justify-content-center w-100 h-100">
                        <svg className="text-white" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022z"/>
                        </svg>
                      </div>
                    </div>
                    <h2 className="text-success fw-bold mb-3">Thank You!</h2>
                    <p className="text-secondary fs-5">Your feedback has been received.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="needs-validation">
                    {/* Stars Rating */}
                    <div className="mb-5 text-center">
                      <label className="form-label fw-medium fs-4 text-light mb-3">
                        How would you rate us?
                      </label>
                      <div className="d-flex justify-content-center gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`btn btn-link p-0 fs-1 transition-transform hover:scale-110 ${
                              star <= rating ? 'text-warning' : 'text-secondary'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    <div className="mb-5">
                      <label htmlFor="comment" className="form-label fw-medium fs-4 text-light mb-3">
                        Tell us more (optional)
                      </label>
                      <textarea
                        id="comment"
                        rows={6}
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        className="form-control form-control-lg bg-secondary text-white border-secondary focus:border-primary"
                        placeholder="What do you like? What can be better? Any suggestions?"
                      />
                    </div>

                    {error && (
                      <div className="alert alert-danger text-center mb-4">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className={`btn btn-primary btn-lg w-100 fw-bold ${loading ? 'disabled' : ''}`}
                    >
                      {loading ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}