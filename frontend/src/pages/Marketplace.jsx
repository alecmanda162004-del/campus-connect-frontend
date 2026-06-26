import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import ListingCard from '../components/ListingCard';
import { FaSpinner, FaBookmark, FaTimes, FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { getRecentlyViewed } from '../utils/recentlyViewed';
import useAuthStore from '../utils/authStore';
import PriceRangeSlider from '../components/PriceRangeSlider';

const ITEMS_PER_PAGE = 30;
const FULL_CATEGORIES = [
  'Accommodation','Beauty & Personal Care','Books & Stationery','Crocs',
  'Electronics','Fashion & Clothing','Food','Furniture & Home Decor',
  'Jewellery','Lab Coats','Laptops & Computers','Medical Equipment & Tools',
  'Mobile Phones & Accessories','Others','Scrubs','Services','Shoes & Bags',
  'Sports & Fitness','Vehicles & Parts',
].sort();

const ICONS = {
  All:'🛍️', Electronics:'📱', Food:'🍽️', Scrubs:'🩺',
  'Books & Stationery':'📚', 'Fashion & Clothing':'👗',
  Services:'⚙️', Accommodation:'🏠', 'Laptops & Computers':'💻',
  'Shoes & Bags':'👟', Crocs:'🥿', 'Mobile Phones & Accessories':'📲',
  Jewellery:'💍', 'Sports & Fitness':'⚽',
};

const tag = {
  background:'#1f3a5f', color:'#58a6ff',
  border:'0.5px solid #1d6fa8', borderRadius:20,
  padding:'3px 10px', fontSize:11,
  display:'inline-flex', alignItems:'center', gap:4,
};

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q   = searchParams.get('q')         || '';
  const cat = searchParams.get('category')  || 'All';
  const cnd = searchParams.get('condition') || 'All';
  const srt = searchParams.get('sort')      || 'newest';
  const mn  = Number(searchParams.get('min')) || 0;
  const mx  = searchParams.get('max')       || '';

  const setFilter = useCallback((key, val) => {
    setSearchParams(prev => {
      const n = new URLSearchParams(prev);
      if (!val || val === 'All' || val === '' || val === 0) n.delete(key);
      else n.set(key, String(val));
      return n;
    });
  }, [setSearchParams]);

  const [listings, setListings]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [loadingMore, setMore]            = useState(false);
  const [error, setError]                 = useState(null);
  const [page, setPage]                   = useState(1);
  const [rv, setRv]                       = useState([]);
  const [showF, setShowF]                 = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => { setRv(getRecentlyViewed()); }, []);

  useEffect(() => {
    if (q.trim()) {
      setSearchLoading(true);
      const params = new URLSearchParams({ search: q.trim() });
      if (cat !== 'All') params.set('category', cat);
      if (srt !== 'newest') params.set('sort', srt);
      api.get(`/api/listings?${params}`)
        .then(r => setListings(r.data.data || []))
        .catch(() => setError('Search failed.'))
        .finally(() => { setLoading(false); setSearchLoading(false); });
    } else {
      api.get('/api/listings?limit=200&sort=newest')
        .then(r => setListings(r.data.data || []))
        .catch(() => setError('Failed to load marketplace.'))
        .finally(() => setLoading(false));
    }
  }, [q, cat, srt]);

  const filtered = useMemo(() => {
    let r = [...listings];
    r.sort((a, b) => {
      if (a.is_premium && !b.is_premium) return -1;
      if (!a.is_premium && b.is_premium) return 1;
      return 0;
    });
    if (!q.trim()) {
      if (cnd !== 'All') r = r.filter(l => l.condition === cnd);
      if (cat !== 'All') r = r.filter(l => l.category  === cat);
      r = r.filter(l => { const p = Number(l.price)||0; return p >= mn && (mx===''||p<=Number(mx)); });
      if (srt === 'newest') {
        const premium = r.filter(l => l.is_premium);
        const rest    = r.filter(l => !l.is_premium);
        const cut = Date.now() - 7*86400000;
        const rec = rest.filter(l => new Date(l.created_at||0).getTime() > cut);
        const old = rest.filter(l => new Date(l.created_at||0).getTime() <= cut);
        rec.sort((a,b) => new Date(b.created_at)-new Date(a.created_at));
        old.sort(() => Math.random()-0.5);
        r = [...premium, ...rec, ...old];
      } else if (srt==='price-low') r.sort((a,b)=>(Number(a.price)||0)-(Number(b.price)||0));
      else r.sort((a,b)=>(Number(b.price)||0)-(Number(a.price)||0));
    }
    return r;
  }, [listings, q, cnd, cat, srt, mn, mx]);

  const popular = useMemo(() => {
    if (!listings.length) return FULL_CATEGORIES.slice(0,8);
    const c = {};
    listings.forEach(l => { if (l.category) c[l.category]=(c[l.category]||0)+1; });
    return Object.entries(c).sort(([,a],[,b])=>b-a).slice(0,8).map(([x])=>x);
  }, [listings]);

  const displayed = useMemo(() => filtered.slice(0, page*ITEMS_PER_PAGE), [filtered, page]);
  const hasMore   = displayed.length < filtered.length;
  const fc = [q, cat!=='All', cnd!=='All', srt!=='newest', mn>0, mx].filter(Boolean).length;
  const hasF = fc > 0;

  if (loading) return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-dark">
      <FaSpinner className="spinner-border text-primary mb-3" style={{width:'3.5rem',height:'3.5rem'}}/>
      <p className="text-primary">Loading marketplace...</p>
    </div>
  );
  if (error) return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
      <div className="alert alert-danger text-center rounded-3 p-4">{error}</div>
    </div>
  );

  return (
    <div style={{background:'#060d18',minHeight:'100vh',color:'#e6edf3'}}>

      {/* Sticky search bar — category strip NOT inside here */}
      <div style={{position:'sticky',top:58,zIndex:100,background:'#0a0f1a',borderBottom:'0.5px solid #1f2937'}}>
        <div style={{padding:'10px 12px',display:'flex',gap:8,alignItems:'center'}}>
          <div style={{position:'relative',flex:1}}>
            <input
              type="text" placeholder="Search listings..."
              value={q} onChange={e=>setFilter('q',e.target.value)}
              style={{width:'100%',background:'#161b22',border:'0.5px solid #30363d',borderRadius:10,padding:'9px 32px 9px 12px',color:'#e6edf3',fontSize:14,outline:'none'}}
            />
            {q && (
              <button onClick={()=>setFilter('q','')}
                style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'#8b949e',cursor:'pointer',padding:0,display:'flex'}}>
                <FaTimes size={13}/>
              </button>
            )}
          </div>
          <button onClick={()=>setShowF(!showF)}
            style={{background:hasF?'#0d6efd':'#161b22',border:`0.5px solid ${hasF?'#0d6efd':'#30363d'}`,borderRadius:10,padding:'9px 11px',color:'#e6edf3',cursor:'pointer',display:'flex',alignItems:'center',gap:5,flexShrink:0}}>
            <FaFilter size={13}/>
            {hasF && <span style={{background:'#fff',color:'#0d6efd',borderRadius:'50%',width:17,height:17,fontSize:10,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>{fc}</span>}
            {showF?<FaChevronUp size={10}/>:<FaChevronDown size={10}/>}
          </button>
          {token && (
            <Link to="/saved"
              style={{background:'#161b22',border:'0.5px solid #30363d',borderRadius:10,padding:'9px 10px',color:'#ffc107',textDecoration:'none',flexShrink:0,display:'flex'}}>
              <FaBookmark size={14}/>
            </Link>
          )}
        </div>
      </div>

      {/* Category strip — lives OUTSIDE sticky so no clipping */}
      <div style={{background:'#0a0f1a',borderBottom:'0.5px solid #1f2937'}}>
        <div className="cc-cat-wrap">
          {['All', ...popular].map(c2 => {
            const sel = cat===c2;
            return (
              <button key={c2}
                onClick={()=>{setFilter('category',c2==='All'?'':c2);setPage(1);}}
                style={{
                  display:'inline-flex', alignItems:'center', gap:4,
                  padding:'7px 13px', borderRadius:20,
                  fontSize:13, fontWeight:500,
                  flexShrink:0, flexGrow:0,
                  border: sel?'none':'0.5px solid #30363d',
                  background: sel?'#0d6efd':'#161b22',
                  color: sel?'#fff':'#8b949e',
                  cursor:'pointer',
                  whiteSpace:'nowrap',
                  WebkitTapHighlightColor:'transparent',
                }}>
                <span style={{fontSize:15,lineHeight:1}}>{ICONS[c2]||'📦'}</span>
                {c2}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter panel */}
      {showF && (
        <div style={{background:'#0d1117',borderBottom:'0.5px solid #1f2937',padding:'12px'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
            <div>
              <label style={{fontSize:11,color:'#8b949e',display:'block',marginBottom:4}}>Condition</label>
              <select value={cnd} onChange={e=>{setFilter('condition',e.target.value);setPage(1);}}
                style={{width:'100%',background:'#161b22',border:'0.5px solid #30363d',borderRadius:8,padding:'7px 10px',color:'#e6edf3',fontSize:13}}>
                <option value="All">All</option>
                <option>New</option>
                <option>Used - Excellent</option>
                <option>Used - Good</option>
                <option>Used - Fair</option>
              </select>
            </div>
            <div>
              <label style={{fontSize:11,color:'#8b949e',display:'block',marginBottom:4}}>Sort by</label>
              <select value={srt} onChange={e=>{setFilter('sort',e.target.value);setPage(1);}}
                style={{width:'100%',background:'#161b22',border:'0.5px solid #30363d',borderRadius:8,padding:'7px 10px',color:'#e6edf3',fontSize:13}}>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
            </div>
            <div style={{gridColumn:'1/-1'}}>
              <label style={{fontSize:11,color:'#8b949e',display:'block',marginBottom:4}}>Category</label>
              <select value={cat} onChange={e=>{setFilter('category',e.target.value);setPage(1);}}
                style={{width:'100%',background:'#161b22',border:'0.5px solid #30363d',borderRadius:8,padding:'7px 10px',color:'#e6edf3',fontSize:13}}>
                <option value="All">All categories</option>
                {FULL_CATEGORIES.map(c=>(<option key={c}>{c}</option>))}
              </select>
            </div>
            <div style={{gridColumn:'1/-1'}}>
              <PriceRangeSlider min={0} max={20000}
                value={{min:mn,max:mx||20000}}
                onChange={({min,max})=>{setFilter('min',min>0?min:'');setFilter('max',max<20000?max:'');}}
              />
            </div>
          </div>
          {hasF && (
            <div style={{display:'flex',flexWrap:'wrap',gap:6,alignItems:'center'}}>
              {q           && <span style={tag}>"{q}" <FaTimes size={9} style={{cursor:'pointer'}} onClick={()=>setFilter('q','')}/></span>}
              {cat!=='All' && <span style={tag}>{cat} <FaTimes size={9} style={{cursor:'pointer'}} onClick={()=>setFilter('category','')}/></span>}
              {cnd!=='All' && <span style={tag}>{cnd} <FaTimes size={9} style={{cursor:'pointer'}} onClick={()=>setFilter('condition','')}/></span>}
              {(mn>0||mx)  && <span style={tag}>K{mn}–{mx||'any'} <FaTimes size={9} style={{cursor:'pointer'}} onClick={()=>{setFilter('min','');setFilter('max','');}} /></span>}
              <button onClick={()=>setSearchParams({})}
                style={{background:'transparent',border:'0.5px solid #f85149',color:'#f85149',borderRadius:20,padding:'3px 10px',fontSize:11,cursor:'pointer'}}>
                Clear all
              </button>
            </div>
          )}
        </div>
      )}

      <div style={{padding:'12px 12px 0'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
          <p style={{fontSize:12,color:'#6c757d',margin:0}}>
            {searchLoading
              ? 'Searching...'
              : `${filtered.length} listing${filtered.length!==1?'s':''} found${cat!=='All'?' in '+cat:''}`}
          </p>
          {q.trim() && !searchLoading && (
            <span style={{fontSize:11,background:'#1e3a5f',color:'#60a5fa',borderRadius:20,padding:'2px 8px'}}>
              All listings searched
            </span>
          )}
          {searchLoading && <span style={{fontSize:11,color:'#60a5fa'}}>⏳</span>}
        </div>

        {displayed.length===0 ? (
          <div style={{textAlign:'center',padding:'60px 20px'}}>
            <p style={{color:'#8b949e',marginBottom:16}}>No listings match your filters.</p>
            <button onClick={()=>setSearchParams({})}
              style={{background:'#0d6efd',color:'#fff',border:'none',borderRadius:8,padding:'9px 22px',cursor:'pointer',fontSize:14}}>
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="cc-grid">
              {displayed.map(l => (
                <ListingCard key={l.id} listing={l} onDelete={id=>setListings(p=>p.filter(x=>x.id!==id))}/>
              ))}
            </div>
            {hasMore && (
              <div style={{textAlign:'center',margin:'24px 0'}}>
                <button
                  onClick={()=>{setMore(true);setTimeout(()=>{setPage(p=>p+1);setMore(false);},300);}}
                  disabled={loadingMore}
                  style={{background:'#0d6efd',color:'#fff',border:'none',borderRadius:10,padding:'12px 40px',fontSize:14,fontWeight:500,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:8}}>
                  {loadingMore && <FaSpinner className="spinner-border spinner-border-sm"/>}
                  Show more
                </button>
              </div>
            )}
          </>
        )}

        {rv.length>0 && (
          <section style={{marginTop:28,paddingTop:16,borderTop:'0.5px solid #1f2937',paddingBottom:24}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <h5 style={{fontSize:13,fontWeight:600,color:'#e6edf3',margin:0}}>Recently viewed</h5>
              <button onClick={()=>setRv([])} style={{background:'none',border:'none',color:'#8b949e',fontSize:11,cursor:'pointer'}}>Clear</button>
            </div>
            <div className="cc-grid">
              {rv.slice(0,4).map(l => <ListingCard key={l.id} listing={l}/>)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
