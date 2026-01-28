import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
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
              className={`btn btn-primary btn-lg w-100 fw-bold ${loading ? 'disabled' : ''}`}
            >
              {loading ? 'Registering...' : 'Register'}
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