import { Link } from 'react-router-dom';

export default function Donate() {
  return (
    <div className="min-vh-100 bg-dark text-white py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">

            {/* Main Card */}
            <div className="card bg-dark border-secondary shadow-lg rounded-4 overflow-hidden">
              <div className="card-body p-4 p-md-5">
                {/* Header */}
                <h1 className="card-title text-center display-5 fw-bold text-primary mb-4 mb-md-5">
                  Support Campus-Connect
                </h1>

                {/* Main message */}
                <p className="lead text-center text-secondary mb-5">
                  Campus-Connect is built and run by students, for students — completely free, no ads, no hidden fees.
                  <br className="d-none d-sm-block" />
                  We cover server costs, domain renewals, SSL certificates, and occasional improvements entirely out of pocket.
                  Your support — even small amounts — keeps the platform alive and growing for everyone in Lusaka and beyond.
                </p>

                {/* What Your Donation Helps With */}
                <div className="card bg-secondary border-0 shadow mb-5">
                  <div className="card-body p-4">
                    <h2 className="card-title text-center text-light mb-4">
                      What Your Donation Helps With
                    </h2>
                    <ul className="list-group list-group-flush text-light">
                      <li className="list-group-item bg-transparent border-secondary py-3">
                        Server hosting & database (~K500–K1,500/month)
                      </li>
                      <li className="list-group-item bg-transparent border-secondary py-3">
                        Domain name & SSL certificate renewals
                      </li>
                      <li className="list-group-item bg-transparent border-secondary py-3">
                        New features (variants, messaging, filters, notifications)
                      </li>
                      <li className="list-group-item bg-transparent border-secondary py-3">
                        Keeping the platform fast, secure, and ad-free
                      </li>
                      <li className="list-group-item bg-transparent border-secondary py-3">
                        Occasional developer coffee & late-night debugging ☕😂
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Donation Info */}
                <div className="text-center mb-5">
                  <h3 className="text-success display-6 fw-bold mb-4">
                    Donate via Mobile Money
                  </h3>

                  <div className="row justify-content-center g-4 mb-4">
                    <div className="col-12 col-sm-6 col-md-5">
                      <div className="bg-success text-white p-4 rounded-3 shadow text-center">
                        <strong className="fs-5">AirTel:</strong><br />
                        0977 123 456
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-5">
                      <div className="bg-info text-white p-4 rounded-3 shadow text-center">
                        <strong className="fs-5">MTN:</strong><br />
                        0966 789 012
                      </div>
                    </div>
                  </div>

                  <p className="lead text-secondary fs-5">
                    Every amount counts — K10, K50, K100, K500 or more.
                    <br />
                    <strong className="text-white">Thank you</strong> for believing in a better campus marketplace!
                  </p>
                </div>

                {/* Back Button */}
                <div className="text-center">
                  <Link
                    to="/"
                    className="btn btn-primary btn-lg px-5 py-3 fw-bold shadow-lg w-100 w-md-auto"
                  >
                    Back to Marketplace
                  </Link>
                </div>

                {/* Footer Note */}
                <p className="text-center text-muted mt-5 small">
                  Campus-Connect • Made with ❤️ in Lusaka
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}