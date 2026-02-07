import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api'; // ← Import the centralized API helper (adjust path if needed)

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await api.post('/api/auth/login', formData); // ← Fixed: using api helper

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      localStorage.setItem('userId', res.data.user.id);

      console.log('Logged in as user ID:', res.data.user.id);

      setMessage('Login successful! Redirecting...');

      if (res.data.user.role === 'admin') {
        setTimeout(() => navigate('/admin'), 1500);
      } else {
        setTimeout(() => navigate('/marketplace'), 1500);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-dark d-flex align-items-center justify-content-center px-3">
      <div className="card bg-dark border-secondary shadow-lg rounded-4" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="card-body p-5">
          <h2 className="card-title text-center text-primary display-6 fw-bold mb-5">
            Login
          </h2>

          {message && (
            <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} text-center mb-4`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
            <div className="mb-5">
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
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary btn-lg w-100 fw-bold ${loading ? 'disabled' : ''}`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-secondary mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary fw-medium text-decoration-none">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;