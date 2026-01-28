import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import api from '../utils/api'; // ← Import the centralized API helper (adjust path if needed)

export default function HomePage() {
  const [heroImage, setHeroImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    console.log('HomePage: Starting hero fetch...');

    const loadHeroImage = async () => {
      try {
        console.log('Fetching from: /api/settings/hero');
        const res = await api.get('/api/settings/hero'); // ← Fixed: using api helper
        console.log('API response:', res.data);

        if (res.data.hero_image_url) {
          console.log('Setting new hero image:', res.data.hero_image_url);
          setHeroImage(res.data.hero_image_url);
        } else {
          console.log('No hero_url in response — using fallback');
          setHeroImage('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80');
        }
      } catch (err) {
        console.error('Hero fetch failed:', err.message);
        setFetchError('Could not load custom hero');
        setHeroImage('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80');
      } finally {
        setLoading(false);
      }
    };

    loadHeroImage();
  }, []);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
        <div className="spinner-border text-primary" style={{ width: '5rem', height: '5rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-primary fs-4 ms-4">Loading Campus-Connect...</p>
      </div>
    );
  }

  return (
    <div className="bg-dark text-white">
      {/* Hero Section */}
      <section
        className="d-flex align-items-center justify-content-center text-center py-5 py-md-0"
        style={{
          minHeight: '100vh',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${heroImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container">
          <h1 className="display-3 display-md-2 fw-bold mb-4 text-white">
            Campus-Connect
          </h1>

          <p className="lead fs-4 mb-5 text-light">
            Buy. Sell. Connect. <br className="d-none d-sm-block" />
            Everything you need — right here on campus.
          </p>

          <div className="d-flex flex-column flex-sm-row gap-4 justify-content-center">
            <Link
              to="/marketplace"
              className="btn btn-primary btn-lg px-5 py-3 fw-bold shadow-lg"
            >
              Browse Marketplace
            </Link>

            <Link
              to="/create-listing"
              className="btn btn-success btn-lg px-5 py-3 fw-bold shadow-lg"
            >
              Sell Something Now
            </Link>
          </div>

          {fetchError && (
            <p className="mt-4 text-warning">
              Note: Using default background ({fetchError.toLowerCase()})
            </p>
          )}
        </div>
      </section>

      {/* QR Code + Quick Access Section */}
      <section className="py-5 bg-black">
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4 text-primary">
            Scan to Join on Mobile
          </h2>

          <p className="lead text-secondary mb-5">
            Open Campus-Connect instantly on your phone — no typing required.
          </p>

          <div className="card bg-dark border-secondary mx-auto shadow-lg" style={{ maxWidth: '400px' }}>
            <div className="card-body p-4">
              <QRCodeSVG
                value="https://campus-connect.zm" // replace with your real domain when live
                size={240}
                bgColor="#111827"
                fgColor="#c084fc"
                level="Q"
                className="mx-auto mb-4 rounded"
              />
              <p className="text-primary fw-medium mb-2">Scan me!</p>
              <p className="text-secondary small">
                Or visit: <strong>campus-connect.zm</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-5 bg-black">
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4 text-light">
            Ready to Buy or Sell?
          </h2>

          <div className="d-flex flex-column flex-sm-row gap-4 justify-content-center">
            <Link
              to="/marketplace"
              className="btn btn-primary btn-lg px-5 py-3 fw-bold shadow-lg"
            >
              Explore Now
            </Link>

            <Link
              to="/register"
              className="btn btn-outline-light btn-lg px-5 py-3 fw-bold"
            >
              Join Campus-Connect
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 bg-black text-center text-secondary border-top border-secondary">
        <p>© {new Date().getFullYear()} Campus-Connect • Built with ❤️ in Lusaka</p>
      </footer>
    </div>
  );
}