import { ShoppingCart, Star, Heart, Search, User, ArrowRight } from "lucide-react";

const heroImg = "/webisite/hero-headphones.jpg";
const products = [
  { id: 1, name: "Sound Pro X1", price: "?24,999", was: "?32,000", rating: "4.8", img: "/webisite/p-headphones.jpg", badge: "Best Seller" },
  { id: 2, name: "AirBud Neo", price: "?12,499", was: "?16,000", rating: "4.7", img: "/webisite/p-earbuds.jpg", badge: "New" },
  { id: 3, name: "Nexa Watch S", price: "?18,999", was: null, rating: "4.6", img: "/webisite/p-watch.jpg", badge: null },
  { id: 4, name: "UltraBook Pro", price: "?89,999", was: "?1,10,000", rating: "4.9", img: "/webisite/p-laptop.jpg", badge: "Deal" },
  { id: 5, name: "HomeSphere", price: "?6,999", was: null, rating: "4.5", img: "/webisite/p-home.jpg", badge: null },
];
const categories = [
  { name: "Audio", sub: "Headphones & Earbuds", img: "/webisite/p-headphones.jpg" },
  { name: "Wearables", sub: "Smartwatches", img: "/webisite/p-watch.jpg" },
  { name: "Laptops", sub: "Ultrabooks & Pro", img: "/webisite/p-laptop.jpg" },
  { name: "Mobile", sub: "Smartphones", img: "/webisite/p-phone.jpg" },
  { name: "Home", sub: "Smart Home Devices", img: "/webisite/p-home.jpg" },
];

export function NexaStorefrontPreview() {
  return (
    <div className="nexa-preview-root">
      {/* Navbar */}
      <header className="nexa-preview-nav">
        <span className="nexa-preview-logo">NEXA</span>
        <nav className="nexa-preview-links">
          <span className="nexa-preview-link nexa-preview-link--active">Home</span>
          <span className="nexa-preview-link">Shop</span>
          <span className="nexa-preview-link">Deals</span>
          <span className="nexa-preview-link">About</span>
        </nav>
        <div className="nexa-preview-actions">
          <span className="nexa-preview-search-pill">
            <Search size={11} />
            <span>Search products…</span>
          </span>
          <User size={15} className="nexa-preview-icon--action" />
          <span className="nexa-preview-cart-wrap">
            <ShoppingCart size={15} className="nexa-preview-icon--action" />
            <span className="nexa-preview-cart-badge">3</span>
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="nexa-preview-hero">
        <img src={heroImg} alt="NEXA hero" className="nexa-preview-hero-img" />
        <div className="nexa-preview-hero-fade" />
        <div className="nexa-preview-hero-content">
          <p className="nexa-preview-eyebrow">NEW COLLECTION</p>
          <h1 className="nexa-preview-h1">Elevate Your<br />Everyday</h1>
          <p className="nexa-preview-hero-sub">Premium products for a smarter, modern lifestyle.</p>
          <button className="nexa-preview-cta">Shop Now <ArrowRight size={11} /></button>
        </div>
      </section>

      {/* Categories */}
      <section className="nexa-preview-cats">
        {categories.map((c) => (
          <div key={c.name} className="nexa-preview-cat">
            <img src={c.img} alt={c.name} className="nexa-preview-cat-img" />
            <div className="nexa-preview-cat-info">
              <span className="nexa-preview-cat-name">{c.name}</span>
              <span className="nexa-preview-cat-sub">{c.sub}</span>
            </div>
            <ArrowRight size={10} className="nexa-preview-cat-arrow" />
          </div>
        ))}
      </section>

      {/* Best Sellers */}
      <section className="nexa-preview-products">
        <div className="nexa-preview-products-header">
          <div>
            <h2 className="nexa-preview-h2">Best Sellers</h2>
            <p className="nexa-preview-products-sub">Most loved by our customers</p>
          </div>
          <span className="nexa-preview-view-all">View All <ArrowRight size={10} /></span>
        </div>
        <div className="nexa-preview-grid">
          {products.map((p) => (
            <div key={p.id} className="nexa-preview-card">
              <div className="nexa-preview-card-img-wrap">
                <img src={p.img} alt={p.name} className="nexa-preview-card-img" />
                {p.badge && <span className="nexa-preview-badge">{p.badge}</span>}
                <Heart size={11} className="nexa-preview-heart" />
              </div>
              <div className="nexa-preview-card-body">
                <div className="nexa-preview-card-name">{p.name}</div>
                <div className="nexa-preview-card-row">
                  <span className="nexa-preview-price">{p.price}</span>
                  {p.was && <span className="nexa-preview-was">{p.was}</span>}
                  <span className="nexa-preview-rating ml-auto">
                    <Star size={9} className="nexa-preview-star" /> {p.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="nexa-preview-footer">
        <div className="nexa-preview-footer-inner">
          <div>
            <div className="nexa-preview-footer-logo">NEXA</div>
            <p className="nexa-preview-footer-tagline">Premium products for a smarter, modern lifestyle.</p>
          </div>
          <div>
            <div className="nexa-preview-footer-col-title">Shop</div>
            <div className="nexa-preview-footer-col-link">All Products</div>
            <div className="nexa-preview-footer-col-link">Deals</div>
          </div>
          <div>
            <div className="nexa-preview-footer-col-title">Company</div>
            <div className="nexa-preview-footer-col-link">About NEXA</div>
            <div className="nexa-preview-footer-col-link">Your Cart</div>
          </div>
          <div>
            <div className="nexa-preview-footer-col-title">Stay in the loop</div>
            <div className="nexa-preview-footer-col-link">New drops, first.</div>
          </div>
        </div>
        <div className="nexa-preview-footer-bottom">© 2026 NEXA. All rights reserved.</div>
      </footer>
    </div>
  );
}
