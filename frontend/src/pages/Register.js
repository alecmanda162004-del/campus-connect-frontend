import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api'; // Centralized API helper with REACT_APP_API_URL

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    whatsapp_phone: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Use api helper → sends to live backend[](https://campus-connect-api-uufw.onrender.com)
      await api.post('/api/auth/register', formData);

      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      // More readable error messages
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please try again or check your connection.';
      setMessage(errorMsg);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-dark d-flex align-items-center justify-content-center px-3">
      <div className="card bg-dark border-secondary shadow-lg rounded-4" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="card-body p-5">
          <h2 className="card-title text-center text-primary display-6 fw-bold mb-5">
            Register
          </h2>

          {message && (
            <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} text-center mb-4`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="mb-4">
              <label htmlFor="username" className="form-label text-light fw-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="form-control form-control-lg bg-secondary text-white border-secondary focus:border-primary"
                placeholder="Choose a username"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="form-label text-light fw-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-control form-control-lg bg-secondary text-white border-secondary focus:border-primary"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="form-label text-light fw-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-control form-control-lg bg-secondary text-white border-secondary focus:border-primary"
                placeholder="Create a password"
              />
            </div>

            {/* WhatsApp Phone */}
            <div className="mb-5">
              <label htmlFor="whatsapp_phone" className="form-label text-light fw-medium">
                WhatsApp Phone (optional)
              </label>
              <input
                type="text"
                id="whatsapp_phone"
                name="whatsapp_phone"
                value={formData.whatsapp_phone}
                onChange={handleChange}
                className="form-control form-control-lg bg-secondary text-white border-secondary focus:border-primary"
                placeholder="260..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary btn-lg w-100 fw-bold ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </button>
          </form>

          <p className="text-center text-secondary mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary fw-medium text-decoration-none">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;