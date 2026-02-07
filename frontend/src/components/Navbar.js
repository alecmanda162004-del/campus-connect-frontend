import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-lg">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold fs-4 fs-md-3 text-white" to="/"> {/* ← Minor polish: smaller on mobile */}
          Campus-Connect
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Menu Items */}
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link text-white py-3 py-md-2" to="/" onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white py-3 py-md-2" to="/marketplace" onClick={() => setIsOpen(false)}>
                Marketplace
              </Link>
            </li>

            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white py-3 py-md-2" to="/create-listing" onClick={() => setIsOpen(false)}>
                    Post Listing
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white py-3 py-md-2" to="/my-listings" onClick={() => setIsOpen(false)}>
                    My Listings
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white py-3 py-md-2" to="/feedback" onClick={() => setIsOpen(false)}>
                    Feedback
                  </Link>
                </li>
                {/* Support / Donate */}
                <li className="nav-item">
                  <Link className="nav-link text-success fw-bold py-3 py-md-2" to="/donate" onClick={() => setIsOpen(false)}>
                    Support Us
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white py-3 py-md-2" to={`/profile/${userId}`} onClick={() => setIsOpen(false)}>
                    Profile
                  </Link>
                </li>

                {role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link text-warning fw-bold py-3 py-md-2" to="/admin" onClick={() => setIsOpen(false)}>
                      Admin Dashboard
                    </Link>
                  </li>
                )}
              </>
            )}

            {isLoggedIn ? (
              <li className="nav-item ms-3">
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="btn btn-outline-danger"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item ms-3">
                  <Link className="nav-link text-white py-3 py-md-2" to="/login" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                </li>
                <li className="nav-item ms-3">
                  <Link className="btn btn-primary" to="/register" onClick={() => setIsOpen(false)}>
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;