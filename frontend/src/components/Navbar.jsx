import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../utils/authStore';

const SERVICE_CATEGORIES = ['Services','Food','Accommodation'];

const CATEGORIES = [
  'All','Electronics','Scrubs','Books & Stationery','Food',
  'Laptops & Computers','Fashion & Clothing','Mobile Phones & Accessories',
  'Shoes & Bags','Services','Accommodation','Crocs','Jewellery',
  'Beauty & Personal Care','Sports & Fitness','Vehicles & Parts',
];

export default function Navbar() {
  const { token, role, userId, logout } = useAuthStore();
  const navigate   = useNavigate();
  const location   = useLocation();
  const isLoggedIn = !!token;

  const [menuOpen, setMenuOpen]     = useState(false);
  const [dropOpen, setDropOpen]     = useState(false);
  const [activeCategory, setActive] = useState('All');
  const dropRef = useRef(null);

  const isAdmin = role === 'admin';
  const initials = userId ? userId.toString().slice(0,2).toUpperCase() : 'ME';

  const onMarketplace = location.pathname === '/marketplace';

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  const handleCategoryClick = (cat) => {
    setActive(cat);
    const params = cat === 'All' ? '' : `?category=${encodeURIComponent(cat)}`;
    navigate(`/marketplace${params}`);
    setMenuOpen(false);
  };

  const close = () => setMenuOpen(false);

  return (
    <>
      <nav style={{
        background: '#0a0f1a',
        borderBottom: '0.5px solid #1f2937',
        position: 'sticky', top: 0, zIndex: 1000,
      }}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between" style={{ height: 58 }}>

            {/* Brand */}
            <Link to="/" className="text-decoration-none d-flex align-items-center gap-2" onClick={close}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'linear-gradient(135deg, #0d6efd, #6610f2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
              }}>C</div>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: '-0.3px' }}>
                Campus<span style={{ color: '#0d6efd' }}>Connect</span>
              </span>
            </Link>

            {/* Desktop center links */}
            <div className="d-none d-lg-flex align-items-center gap-1">
              {[
                { to: '/',           label: 'Home' },
                { to: '/marketplace',label: 'Marketplace' },
                { to: '/services',   label: 'Services' },
                { to: '/auctions',   label: '🔨 Auctions' },
                { to: '/saved',      label: 'Saved', auth: true },
                { to: '/donate',     label: 'Support Us', color: '#198754' },
              ].map(({ to, label, auth, color }) => {
                if (auth && !isLoggedIn) return null;
                const active = location.pathname === to;
                return (
                  <Link key={to} to={to}
                    style={{
                      padding: '6px 12px', borderRadius: 8, fontSize: 14,
                      color: active ? '#fff' : (color || '#8b949e'),
                      background: active ? '#1f2937' : 'transparent',
                      textDecoration: 'none', fontWeight: active ? 500 : 400,
                      transition: 'all 0.15s',
                    }}>
                    {label}
                  </Link>
                );
              })}
              {isLoggedIn && isAdmin && (
                <Link to="/admin" style={{
                  padding: '6px 12px', borderRadius: 8, fontSize: 14,
                  color: '#ffc107', textDecoration: 'none', fontWeight: 500,
                }}>Admin</Link>
              )}
            </div>

            {/* Desktop right side */}
            <div className="d-none d-lg-flex align-items-center gap-2">
              {isLoggedIn ? (
                <>
                  {/* Sell button */}
                  <Link to="/create-listing"
                    style={{
                      background: '#0d6efd', color: '#fff',
                      padding: '7px 16px', borderRadius: 8,
                      fontSize: 14, fontWeight: 500,
                      textDecoration: 'none', display: 'flex',
                      alignItems: 'center', gap: 5,
                    }}>
                    <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Sell
                  </Link>

                  {/* Avatar dropdown */}
                  <div ref={dropRef} style={{ position: 'relative' }}>
                    <button onClick={() => setDropOpen(!dropOpen)}
                      style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: '#1f2937', border: '2px solid #0d6efd',
                        color: '#0d6efd', fontSize: 13, fontWeight: 600,
                        cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                      {initials}
                    </button>

                    {dropOpen && (
                      <div style={{
                        position: 'absolute', top: '110%', right: 0,
                        background: '#161b22', border: '0.5px solid #30363d',
                        borderRadius: 12, padding: 8, minWidth: 180, zIndex: 2000,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                      }}>
                        <Link to={`/profile/${userId}`} onClick={() => setDropOpen(false)}
                          style={{ display:'block', padding:'8px 12px', borderRadius:8, color:'#e6edf3', textDecoration:'none', fontSize:13 }}>
                          My Profile
                        </Link>
                        <Link to="/my-listings" onClick={() => setDropOpen(false)}
                          style={{ display:'block', padding:'8px 12px', borderRadius:8, color:'#e6edf3', textDecoration:'none', fontSize:13 }}>
                          My Listings
                        </Link>
                        <Link to="/saved" onClick={() => setDropOpen(false)}
                          style={{ display:'block', padding:'8px 12px', borderRadius:8, color:'#e6edf3', textDecoration:'none', fontSize:13 }}>
                          Saved Listings
                        </Link>
                        <Link to="/feedback" onClick={() => setDropOpen(false)}
                          style={{ display:'block', padding:'8px 12px', borderRadius:8, color:'#e6edf3', textDecoration:'none', fontSize:13 }}>
                          Give Feedback
                        </Link>
                        <div style={{ borderTop:'0.5px solid #30363d', margin:'6px 0' }}/>
                        <button onClick={handleLogout}
                          style={{ width:'100%', textAlign:'left', padding:'8px 12px', borderRadius:8, background:'transparent', border:'none', color:'#f85149', fontSize:13, cursor:'pointer' }}>
                          Log out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login"
                    style={{ padding:'7px 14px', borderRadius:8, fontSize:14, color:'#8b949e', textDecoration:'none', border:'0.5px solid #30363d' }}>
                    Login
                  </Link>
                  <Link to="/register"
                    style={{ background:'#0d6efd', color:'#fff', padding:'7px 16px', borderRadius:8, fontSize:14, fontWeight:500, textDecoration:'none' }}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile right side */}
            <div className="d-flex d-lg-none align-items-center gap-2">
              {isLoggedIn && (
                <Link to="/create-listing" onClick={close}
                  style={{ background:'#0d6efd', color:'#fff', padding:'6px 12px', borderRadius:8, fontSize:13, fontWeight:500, textDecoration:'none' }}>
                  + Sell
                </Link>
              )}
              <button onClick={() => setMenuOpen(!menuOpen)}
                style={{ background:'transparent', border:'0.5px solid #30363d', color:'#e6edf3', padding:'6px 10px', borderRadius:8, cursor:'pointer', fontSize:18, lineHeight:1 }}>
                {menuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {/* Category sub-bar — shown on marketplace */}
        {onMarketplace && (
          <div style={{ borderTop:'0.5px solid #1f2937', background:'#0a0f1a' }}>
            {/* NO container wrapper — must be full width so overflow scroll works */}
            <div className="cc-cat-wrap" style={{ gap:0 }}>
              {CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => handleCategoryClick(cat)}
                  style={{
                    padding:'9px 14px', fontSize:12, fontWeight:500,
                    color: activeCategory===cat ? '#0d6efd' : '#8b949e',
                    background:'transparent', border:'none', cursor:'pointer',
                    borderBottom: activeCategory===cat ? '2px solid #0d6efd' : '2px solid transparent',
                    whiteSpace:'nowrap', transition:'all 0.15s',
                    flexShrink: 0,
                  }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile slide-out menu */}
      {menuOpen && (
        <div style={{
          position:'fixed', top:0, left:0, width:'100%', height:'100%',
          background:'rgba(0,0,0,0.5)', zIndex:999,
        }} onClick={close}>
          <div style={{
            position:'absolute', top:0, right:0,
            width:'80%', maxWidth:320, height:'100%',
            background:'#0d1117', borderLeft:'0.5px solid #30363d',
            padding:'20px 0', overflowY:'auto',
            display:'flex', flexDirection:'column',
          }} onClick={(e) => e.stopPropagation()}>

            <div style={{ padding:'0 20px 16px', borderBottom:'0.5px solid #1f2937', marginBottom:8 }}>
              <div style={{ fontSize:16, fontWeight:600, color:'#fff' }}>
                Campus<span style={{ color:'#0d6efd' }}>Connect</span>
              </div>
            </div>

            {[
              { to:'/',            label:'Home' },
              { to:'/marketplace', label:'Marketplace' },
              { to:'/services',    label:'Services' },
              { to:'/auctions',    label:'🔨 Auctions' },
              { to:'/donate',      label:'Support Us', color:'#198754' },
            ].map(({ to, label, color }) => (
              <Link key={to} to={to} onClick={close}
                style={{ padding:'12px 20px', color:color||'#e6edf3', textDecoration:'none', fontSize:15, borderBottom:'0.5px solid #1f2937' }}>
                {label}
              </Link>
            ))}

            {isLoggedIn ? (
              <>
                {[
                  { to:`/profile/${userId}`, label:'My Profile' },
                  { to:'/my-listings',       label:'My Listings' },
                  { to:'/saved',             label:'Saved Listings' },
                  { to:'/feedback',          label:'Feedback' },
                  ...(isAdmin ? [{ to:'/admin', label:'Admin Dashboard', color:'#ffc107' }] : []),
                ].map(({ to, label, color }) => (
                  <Link key={to} to={to} onClick={close}
                    style={{ padding:'12px 20px', color:color||'#e6edf3', textDecoration:'none', fontSize:15, borderBottom:'0.5px solid #1f2937' }}>
                    {label}
                  </Link>
                ))}
                <button onClick={handleLogout}
                  style={{ padding:'12px 20px', color:'#f85149', background:'transparent', border:'none', textAlign:'left', fontSize:15, cursor:'pointer', marginTop:'auto' }}>
                  Log out
                </button>
              </>
            ) : (
              <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:10, marginTop:8 }}>
                <Link to="/login" onClick={close}
                  style={{ background:'transparent', border:'0.5px solid #30363d', color:'#e6edf3', padding:'10px 16px', borderRadius:8, textDecoration:'none', textAlign:'center', fontSize:14 }}>
                  Login
                </Link>
                <Link to="/register" onClick={close}
                  style={{ background:'#0d6efd', color:'#fff', padding:'10px 16px', borderRadius:8, textDecoration:'none', textAlign:'center', fontSize:14, fontWeight:500 }}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
