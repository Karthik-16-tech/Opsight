import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShoppingCart,
  Star,
  Heart,
  Search,
  User,
  ArrowRight,
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Zap,
  ArrowLeft,
  Check,
  Radio,
  Layers,
  Cpu,
} from "lucide-react";
import { useState } from "react";
import { AgentOrb } from "@/components/opsight/AgentOrb";

export const Route = createFileRoute("/nexa")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "NEXA — Elevate Your Everyday" },
      {
        name: "description",
        content:
          "Premium audio, wearables, laptops and smart home products for a smarter, modern lifestyle.",
      },
    ],
  }),
  component: NexaStore,
});

const heroImg = "/webisite/hero-headphones.jpg";

export interface Product {
  id: number;
  name: string;
  tagline: string;
  price: string;
  numericPrice: number;
  was: string | null;
  rating: string;
  reviews: number;
  img: string;
  badge: string | null;
  category: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
}

export const products: Product[] = [
  {
    id: 1,
    name: "Sound Pro X1",
    tagline: "Studio-grade wireless sound with spatial audio",
    price: "₹24,999",
    numericPrice: 24999,
    was: "₹32,000",
    rating: "4.8",
    reviews: 1284,
    img: "/webisite/p-headphones.jpg",
    badge: "Best Seller",
    category: "audio",
    description:
      "Engineered with custom 40mm beryllium drivers and active hybrid noise cancellation. Enjoy acoustic clarity, deep sub-bass, and 45 hours of continuous playback.",
    features: [
      "Hybrid Active Noise Cancellation (ANC)",
      "40mm High-Resolution Beryllium Drivers",
      "45-Hour Battery with Fast USB-C Quick Charge",
      "Spatial 3D Audio with Dynamic Head Tracking",
    ],
    specs: [
      { label: "Battery Life", value: "45 Hours (ANC On)" },
      { label: "Driver Size", value: "40mm Dynamic" },
      { label: "Bluetooth", value: "v5.3 with LDAC / aptX HD" },
      { label: "Weight", value: "245g" },
    ],
  },
  {
    id: 2,
    name: "AirBud Neo",
    tagline: "True wireless earbuds, zero compromise",
    price: "₹12,499",
    numericPrice: 12499,
    was: "₹16,000",
    rating: "4.7",
    reviews: 986,
    img: "/webisite/p-earbuds.jpg",
    badge: "New",
    category: "audio",
    description:
      "Ultra-compact earbuds delivering deep low-end response and quad-mic beamforming for crystal-clear calls even in busy environments.",
    features: [
      "Adaptive Environmental Noise Cancellation",
      "IPX5 Sweat & Water Resistance",
      "32 Hours Total Playtime with Wireless Charging Case",
      "Touch Gesture Volume & Track Control",
    ],
    specs: [
      { label: "Playtime", value: "8h Earbuds + 24h Case" },
      { label: "Water Rating", value: "IPX5" },
      { label: "Wireless Charging", value: "Qi Certified" },
      { label: "Microphones", value: "4x Beamforming MEMS" },
    ],
  },
  {
    id: 3,
    name: "Nexa Watch S",
    tagline: "Health tracking, redefined with aerospace titanium",
    price: "₹18,999",
    numericPrice: 18999,
    was: "₹24,999",
    rating: "4.6",
    reviews: 742,
    img: "/webisite/p-watch.jpg",
    badge: "Trending",
    category: "wearables",
    description:
      "Precision-machined titanium chassis with an ultra-bright sapphire AMOLED display. Continuous optical bio-sensor tracks heart rate, SpO2, and deep sleep stages.",
    features: [
      "Continuous ECG & SpO2 Biometric Monitoring",
      "Water Resistant to 50 Meters (5 ATM Swim-Proof)",
      "Always-On 1.43\" Sapphire Crystal AMOLED Screen",
      "Dual-Frequency GPS for Precise Outdoor Mapping",
    ],
    specs: [
      { label: "Battery Life", value: "Up to 7 Days" },
      { label: "Display", value: "1.43\" AMOLED 466x466" },
      { label: "Sensors", value: "Optical Heart Rate, SpO2, ECG" },
      { label: "Water Resistance", value: "5 ATM (50m)" },
    ],
  },
  {
    id: 4,
    name: "UltraBook Pro",
    tagline: "M-Series silicon power without the weight",
    price: "₹89,999",
    numericPrice: 89999,
    was: "₹1,10,000",
    rating: "4.9",
    reviews: 521,
    img: "/webisite/p-laptop.jpg",
    badge: "Deal",
    category: "laptops",
    description:
      "Ultrathin 14-inch unibody aluminum workstation powered by next-gen 12-core architecture. 120Hz Liquid Retina display with 18 hours of all-day battery.",
    features: [
      "14.2\" 120Hz Liquid Retina ProMotion Display",
      "12-Core CPU with 18-Core Neural Engine",
      "Up to 32GB Unified Memory & 1TB NVMe Storage",
      "MagSafe Fast Charging & 3x Thunderbolt 4 Ports",
    ],
    specs: [
      { label: "Processor", value: "12-Core Silicon SoC" },
      { label: "Memory", value: "16GB Unified RAM" },
      { label: "Storage", value: "512GB PCIe 4.0 NVMe" },
      { label: "Battery", value: "Up to 18 Hours" },
    ],
  },
  {
    id: 5,
    name: "HomeSphere",
    tagline: "Smart room-filling acoustics for every room",
    price: "₹6,999",
    numericPrice: 6999,
    was: null,
    rating: "4.5",
    reviews: 634,
    img: "/webisite/p-home.jpg",
    badge: null,
    category: "home",
    description:
      "Compact smart hub with 360-degree ambient audio, built-in smart assistant, and Matter protocol compatibility for seamless home automation.",
    features: [
      "360° Computational Audio with Room Sensing",
      "Matter & Thread Smart Home Protocol Support",
      "Far-Field Voice Array with Physical Privacy Mute",
      "Stereo Pairable with Multi-Room Sync",
    ],
    specs: [
      { label: "Drivers", value: "1x High-Excursion Woofer, 2x Tweeters" },
      { label: "Wireless", value: "Wi-Fi 6E, Thread, Bluetooth 5.2" },
      { label: "Power", value: "20W USB-C PD Input" },
      { label: "Dimensions", value: "98mm x 98mm x 85mm" },
    ],
  },
  {
    id: 6,
    name: "NexaPhone 15",
    tagline: "Pro camera system that sees like you do",
    price: "₹54,999",
    numericPrice: 54999,
    was: "₹64,999",
    rating: "4.8",
    reviews: 2103,
    img: "/webisite/p-phone.jpg",
    badge: "Hot",
    category: "mobile",
    description:
      "Aerospace titanium band with custom 50MP Sony sensor array. Record cinematic 4K HDR ProRes video with optical image stabilization and periscope zoom.",
    features: [
      "50MP Primary + 12MP Ultra-Wide + 5x Optical Periscope",
      "6.7\" 120Hz LTPO OLED Display (2500 nits peak)",
      "5000mAh Battery with 65W HyperCharge",
      "Corning Gorilla Glass Armor Front and Back",
    ],
    specs: [
      { label: "Display", value: "6.7\" LTPO OLED 120Hz" },
      { label: "Camera", value: "50MP Triple OIS System" },
      { label: "Battery", value: "5000 mAh (65W Fast Charge)" },
      { label: "Storage", value: "256GB UFS 4.0" },
    ],
  },
  {
    id: 7,
    name: "BassWave Speaker",
    tagline: "Room-filling 360° waterproof sound",
    price: "₹9,499",
    numericPrice: 9499,
    was: "₹12,000",
    rating: "4.6",
    reviews: 389,
    img: "/webisite/p-speaker.jpg",
    badge: "Deal",
    category: "audio",
    description:
      "Rugged portable Bluetooth speaker with dual passive radiators and IP67 waterproof certification. Floating design makes it perfect for pool, beach, and trails.",
    features: [
      "Dual Passive Radiators with Deep Bass Boost",
      "IP67 Dustproof and Waterproof (Floats in water)",
      "24-Hour Battery with Reverse PowerBank USB-A Out",
      "PartyBoost: Pair 100+ Speakers Wirelessly",
    ],
    specs: [
      { label: "Output", value: "40W RMS" },
      { label: "Battery Life", value: "24 Hours" },
      { label: "Water Rating", value: "IP67 Submersible" },
      { label: "Weight", value: "780g" },
    ],
  },
  {
    id: 8,
    name: "Watch Pro 2",
    tagline: "Premium stainless steel with all-day battery",
    price: "₹28,999",
    numericPrice: 28999,
    was: null,
    rating: "4.7",
    reviews: 417,
    img: "/webisite/p-watch.jpg",
    badge: null,
    category: "wearables",
    description:
      "Hand-polished 316L medical-grade stainless steel with luxury Italian leather band. Includes full sapphire glass, sleep tracking, and cellular LTE standby.",
    features: [
      "Medical Grade 316L Stainless Steel Case",
      "Independent 4G LTE eSIM Connectivity",
      "Advanced Dual-Band GPS & Barometric Altimeter",
      "Fast Magnetic Induction Charging (0 to 80% in 35m)",
    ],
    specs: [
      { label: "Case Material", value: "316L Stainless Steel" },
      { label: "Battery", value: "14 Days Typical Use" },
      { label: "Water Rating", value: "10 ATM (100 meters)" },
      { label: "Glass", value: "Sapphire Crystal" },
    ],
  },
];

const categories = [
  { id: "all", name: "All" },
  { id: "audio", name: "Audio" },
  { id: "wearables", name: "Wearables" },
  { id: "laptops", name: "Laptops" },
  { id: "mobile", name: "Mobile" },
  { id: "home", name: "Home" },
];

const categoryCards = [
  { name: "Audio", sub: "Headphones & Earbuds", img: "/webisite/p-headphones.jpg" },
  { name: "Wearables", sub: "Smartwatches & Fitness", img: "/webisite/p-watch.jpg" },
  { name: "Laptops", sub: "Ultrabooks & Pro", img: "/webisite/p-laptop.jpg" },
  { name: "Mobile", sub: "Smartphones", img: "/webisite/p-phone.jpg" },
  { name: "Home", sub: "Smart Home Devices", img: "/webisite/p-home.jpg" },
];

interface CartItem {
  id: number;
  quantity: number;
}

export function NexaStore({
  initialProduct = null,
}: {
  initialProduct?: Product | null;
} = {}) {
  const [cart, setCart] = useState<CartItem[]>([
    { id: 3, quantity: 1 }, // Default: Nexa Watch S in cart
  ]);
  const [cat, setCat] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    initialProduct
  );
  const [detailQty, setDetailQty] = useState(1);

  // Opsight SRE Integration & Drawers
  const [isOpsightSidebarOpen, setIsOpsightSidebarOpen] = useState(false);
  const [isSystemDegraded, setIsSystemDegraded] = useState(true);

  // Cart & Checkout
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutTarget, setCheckoutTarget] = useState<CartItem[] | null>(null);

  // Self-Contained Payment Simulation States
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "failed" | "success"
  >("idle");
  const [orderId, setOrderId] = useState<string>("");
  const [isResolving, setIsResolving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Customer checkout inputs
  const [customer, setCustomer] = useState({
    name: "Alex Vance",
    email: "alex.vance@example.com",
    address: "742 Evergreen Terrace, Suite 400",
    city: "San Francisco, CA 94107",
    paymentMode: "card",
  });

  const list = cat === "all" ? products : products.filter((p) => p.category === cat);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getProduct = (id: number) => products.find((p) => p.id === id);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  const addToCart = (id: number, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { id, quantity: qty }];
    });

    const p = getProduct(id);
    showToast(`Added ${p?.name || "Product"} to cart!`);
  };

  const buyNow = (id: number, qty = 1) => {
    setCheckoutTarget([{ id, quantity: qty }]);
    setPaymentStatus("idle");
    setIsCheckoutOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const activeCheckoutItems = checkoutTarget || cart;

  const checkoutSubtotal = activeCheckoutItems.reduce((acc, item) => {
    const prod = getProduct(item.id);
    return acc + (prod?.numericPrice || 0) * item.quantity;
  }, 0);

  const handleStartCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutTarget(null);
    setPaymentStatus("idle");
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Self-contained realistic payment flow with incident error message
  const handleProcessPayment = async () => {
    setPaymentStatus("processing");
    await new Promise((r) => setTimeout(r, 1300));

    // If system is degraded, trigger the realistic 504 Payment Gateway Timeout!
    if (isSystemDegraded) {
      setPaymentStatus("failed");
    } else {
      setOrderId(`NX-${Math.floor(100000 + Math.random() * 900000)}`);
      setPaymentStatus("success");
      if (!checkoutTarget) setCart([]);
    }
  };

  // SRE Remediation & Retry flow: heals the system and confirms the order!
  const handleRemediateAndRetry = async () => {
    setIsResolving(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSystemDegraded(false);
    setIsResolving(false);
    setPaymentStatus("processing");
    await new Promise((r) => setTimeout(r, 1100));

    setOrderId(`NX-${Math.floor(100000 + Math.random() * 900000)}`);
    setPaymentStatus("success");
    if (!checkoutTarget) setCart([]);
  };

  return (
    <div className="nexa-page">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="nexa-toast">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
          <button
            onClick={() => {
              setIsCartOpen(true);
              setToastMsg(null);
            }}
            className="ml-2 underline text-white font-medium text-xs hover:text-white/80 cursor-pointer"
          >
            View Cart
          </button>
        </div>
      )}

      {/* Floating Opsight Agent Orb Widget */}
      <div className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40">
        <AgentOrb
          size="sm"
          onClick={() => setIsOpsightSidebarOpen(true)}
          className="hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* -- Navbar ----------------------------------- */}
      <header className="nexa-page-nav">
        <span
          className="nexa-page-logo cursor-pointer"
          onClick={() => setSelectedProduct(null)}
        >
          NEXA
        </span>
        <nav className="nexa-page-links">
          <span
            className={`nexa-page-link ${!selectedProduct ? "nexa-page-link--active" : ""}`}
            onClick={() => {
              setSelectedProduct(null);
              setCat("all");
            }}
          >
            Home
          </span>
          <span
            className="nexa-page-link"
            onClick={() => {
              setSelectedProduct(null);
              setCat("all");
            }}
          >
            Shop
          </span>
          <span
            className="nexa-page-link"
            onClick={() => {
              setSelectedProduct(null);
              setCat("wearables");
            }}
          >
            Wearables
          </span>
          <span
            className="nexa-page-link"
            onClick={() => {
              setSelectedProduct(null);
              setCat("audio");
            }}
          >
            Audio
          </span>
        </nav>
        <div className="nexa-page-actions">
          <label className="nexa-page-search-pill">
            <Search size={14} />
            <input placeholder="Search products..." className="nexa-page-search-input" />
          </label>

          {/* Opsight Orb Navbar Button */}
          <button
            onClick={() => setIsOpsightSidebarOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/70 hover:bg-purple-900/90 border border-purple-500/50 text-xs font-mono text-purple-200 transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] group"
            title="Open Opsight SRE Orb Sidebar"
          >
            <span className="relative flex h-3 w-3 items-center justify-center">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                  isSystemDegraded ? "bg-red-400 opacity-75" : "bg-purple-400 opacity-75"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isSystemDegraded ? "bg-red-500" : "bg-purple-400 shadow-[0_0_8px_#c084fc]"
                }`}
              />
            </span>
            <span className="font-bold text-white tracking-wider flex items-center gap-1.5">
              <span>OPSIGHT ORB</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  isSystemDegraded
                    ? "bg-red-950 text-red-300 border border-red-500/30"
                    : "bg-purple-950 text-purple-300 border border-purple-500/30"
                }`}
              >
                {isSystemDegraded ? "SEV-1" : "LIVE"}
              </span>
            </span>
          </button>

          <User size={20} className="nexa-page-action-icon" />

          {/* Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="nexa-page-cart-wrap bg-transparent border-0 cursor-pointer p-0"
            title="Open Shopping Cart"
          >
            <ShoppingCart size={20} className="nexa-page-action-icon" />
            {totalCartCount > 0 && (
              <span className="nexa-page-cart-badge">{totalCartCount}</span>
            )}
          </button>
        </div>
        <Link to="/app-dashboard" className="nexa-page-back-btn">
          ← Back to Dashboard
        </Link>
      </header>

      {/* ======================================================== */}
      {/* VIEW A: DEDICATED PRODUCT DETAIL PAGE (WHEN OPENED)       */}
      {/* ======================================================== */}
      {selectedProduct ? (
        <main className="nexa-detail-view">
          <button
            onClick={() => setSelectedProduct(null)}
            className="nexa-detail-back-link"
          >
            <ArrowLeft size={16} /> Back to Catalog
          </button>

          <div className="nexa-detail-grid">
            {/* Left: Product Image */}
            <div className="nexa-detail-img-container">
              <img
                src={selectedProduct.img}
                alt={selectedProduct.name}
                className="nexa-detail-img"
              />
              {selectedProduct.badge && (
                <span className="nexa-page-badge absolute top-4 left-4">
                  {selectedProduct.badge}
                </span>
              )}
            </div>

            {/* Right: Product Details & Buying Actions */}
            <div className="nexa-detail-content">
              <div>
                <span className="text-[11px] font-mono tracking-widest text-white/50 uppercase">
                  {selectedProduct.category}
                </span>
                <h1 className="text-3xl font-bold text-white mt-1">
                  {selectedProduct.name}
                </h1>
                <p className="text-sm text-neutral-400 mt-1">
                  {selectedProduct.tagline}
                </p>
              </div>

              {/* Price & Rating */}
              <div className="flex items-baseline gap-4 py-2 border-y border-white/10">
                <span className="text-2xl font-bold text-white font-mono">
                  {selectedProduct.price}
                </span>
                {selectedProduct.was && (
                  <span className="text-sm text-white/40 line-through font-mono">
                    {selectedProduct.was}
                  </span>
                )}
                <div className="ml-auto flex items-center gap-1.5 text-xs text-white/70">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-white">
                    {selectedProduct.rating}
                  </span>
                  <span className="text-white/40">
                    ({selectedProduct.reviews} reviews)
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-300 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Features List */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-white/80 tracking-wide uppercase">
                  Highlights
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProduct.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-neutral-300 bg-white/5 p-2 rounded-lg border border-white/5"
                    >
                      <Check size={14} className="text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Specs */}
              <div className="rounded-xl bg-white/[0.03] p-3.5 border border-white/10 space-y-2 text-xs">
                <span className="font-semibold text-white/80 uppercase text-[10px] tracking-wider">
                  Technical Specifications
                </span>
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                  {selectedProduct.specs.map((s, idx) => (
                    <div key={idx}>
                      <span className="text-white/40 text-[11px] block">{s.label}</span>
                      <strong className="text-white text-xs">{s.value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity Picker & Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <div className="flex items-center gap-3 bg-white/10 p-1.5 rounded-xl border border-white/15 w-full sm:w-auto justify-between">
                  <button
                    onClick={() => setDetailQty(Math.max(1, detailQty - 1))}
                    className="nexa-qty-btn"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="font-mono text-sm font-semibold text-white px-2">
                    {detailQty}
                  </span>
                  <button
                    onClick={() => setDetailQty(detailQty + 1)}
                    className="nexa-qty-btn"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Buy Now (Triggers Checkout & Error Flow) */}
                <button
                  onClick={() => buyNow(selectedProduct.id, detailQty)}
                  className="flex-1 w-full py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl"
                >
                  <Zap size={16} /> Buy Now
                </button>

                {/* Add to Cart */}
                <button
                  onClick={() => addToCart(selectedProduct.id, detailQty)}
                  className="flex-1 w-full py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={16} /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* ======================================================== */
        /* VIEW B: MAIN CATALOG & STOREFRONT                        */
        /* ======================================================== */
        <>
          {/* -- Hero ------------------------------------ */}
          <section className="nexa-page-hero">
            <img
              src={heroImg}
              alt="NEXA Sound Pro headphones"
              className="nexa-page-hero-img"
            />
            <div className="nexa-page-hero-fade" />
            <div className="nexa-page-hero-content">
              <p className="nexa-page-eyebrow">NEW COLLECTION</p>
              <h1 className="nexa-page-h1">
                Elevate Your
                <br />
                Everyday
              </h1>
              <p className="nexa-page-hero-sub">
                Premium products for a smarter, modern lifestyle.
              </p>
              <button
                onClick={() => {
                  const watch = products.find((p) => p.name.includes("Watch"));
                  if (watch) setSelectedProduct(watch);
                }}
                className="nexa-page-cta flex items-center gap-2 cursor-pointer"
              >
                Explore Nexa Watch S <ArrowRight size={16} />
              </button>
            </div>
          </section>

          {/* -- Categories grid ------------------------- */}
          <section className="nexa-page-cats-section">
            {categoryCards.map((c) => (
              <div
                key={c.name}
                className="nexa-page-cat-card cursor-pointer"
                onClick={() => setCat(c.name.toLowerCase())}
              >
                <img src={c.img} alt={c.name} className="nexa-page-cat-img" />
                <div className="nexa-page-cat-info">
                  <span className="nexa-page-cat-name">{c.name}</span>
                  <span className="nexa-page-cat-sub">{c.sub}</span>
                </div>
                <ArrowRight size={14} className="nexa-page-cat-arrow" />
              </div>
            ))}
          </section>

          {/* -- Products Grid -------------------------------- */}
          <section className="nexa-page-products">
            <div className="nexa-page-products-top">
              <div>
                <h2 className="nexa-page-h2">Best Sellers & Products</h2>
                <p className="nexa-page-products-sub">
                  Click any product to open details, or click <b>Buy Now</b> to purchase
                </p>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="nexa-page-filters">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={`nexa-page-filter-btn ${
                    cat === c.id ? "nexa-page-filter-btn--active" : ""
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="nexa-page-grid">
              {list.map((p) => (
                <div
                  key={p.id}
                  className="nexa-page-card cursor-pointer group"
                  onClick={() => setSelectedProduct(p)}
                >
                  <div className="nexa-page-card-img-wrap">
                    <img src={p.img} alt={p.name} className="nexa-page-card-img" />
                    {p.badge && <span className="nexa-page-badge">{p.badge}</span>}
                    <button
                      className="nexa-page-heart-btn"
                      title="Add to wishlist"
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast(`Saved ${p.name} to wishlist`);
                      }}
                    >
                      <Heart size={16} />
                    </button>
                  </div>
                  <div className="nexa-page-card-body">
                    <div className="nexa-page-card-name group-hover:text-white transition-colors">
                      {p.name}
                    </div>
                    <div className="nexa-page-card-tagline">{p.tagline}</div>
                    <div className="nexa-page-card-bottom">
                      <div className="nexa-page-card-price-row">
                        <span className="nexa-page-price">{p.price}</span>
                        {p.was && <span className="nexa-page-was">{p.was}</span>}
                      </div>
                      <span className="nexa-page-rating">
                        <Star size={12} className="nexa-page-star" /> {p.rating}
                        <span className="nexa-page-reviews">({p.reviews})</span>
                      </span>
                    </div>

                    {/* DUAL BUTTON ROW: Buy Now & Add to Cart */}
                    <div className="nexa-page-btn-row" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => buyNow(p.id)}
                        className="nexa-page-buy-btn"
                      >
                        <Zap size={14} /> Buy Now
                      </button>
                      <button
                        onClick={() => addToCart(p.id)}
                        className="nexa-page-add-btn"
                      >
                        <ShoppingBag size={14} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ======================================================== */}
      {/* CART DRAWER                                              */}
      {/* ======================================================== */}
      {isCartOpen && (
        <div className="nexa-drawer-scrim" onClick={() => setIsCartOpen(false)}>
          <div className="nexa-cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="nexa-drawer-header">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-white" />
                <span className="font-semibold text-white text-base">
                  Your Cart ({totalCartCount})
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-md text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="nexa-drawer-body">
              {cart.length === 0 ? (
                <div className="py-16 text-center text-white/50 text-sm">
                  <ShoppingBag size={42} className="mx-auto mb-3 opacity-30 text-white" />
                  <p>Your cart is empty.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 text-xs font-medium cursor-pointer"
                  >
                    Browse Best Sellers
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const prod = getProduct(item.id);
                  if (!prod) return null;
                  return (
                    <div key={item.id} className="nexa-cart-item">
                      <img
                        src={prod.img}
                        alt={prod.name}
                        className="nexa-cart-item-img cursor-pointer"
                        onClick={() => {
                          setSelectedProduct(prod);
                          setIsCartOpen(false);
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-xs font-semibold text-white truncate cursor-pointer hover:underline"
                          onClick={() => {
                            setSelectedProduct(prod);
                            setIsCartOpen(false);
                          }}
                        >
                          {prod.name}
                        </div>
                        <div className="text-[11px] text-white/50">{prod.price}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="nexa-qty-btn"
                            title="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-mono font-medium text-white px-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="nexa-qty-btn"
                            title="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between self-stretch">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-white/30 hover:text-red-400 transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={13} />
                        </button>
                        <span className="text-xs font-semibold text-white font-mono">
                          ₹{(prod.numericPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {cart.length > 0 && (
              <div className="nexa-drawer-footer">
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-white/60">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">
                      ₹{checkoutSubtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-white/60">
                    <span>Shipping</span>
                    <span className="text-emerald-400 font-medium font-mono">FREE</span>
                  </div>
                  <div className="flex items-center justify-between text-white font-semibold pt-2 border-t border-white/10 text-sm">
                    <span>Total Amount</span>
                    <span className="font-mono">
                      ₹{checkoutSubtotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleStartCheckout}
                  className="w-full py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CHECKOUT MODAL & REALISTIC PAYMENT ERROR SIMULATION      */}
      {/* ======================================================== */}
      {isCheckoutOpen && (
        <div className="nexa-modal-scrim" onClick={() => setIsCheckoutOpen(false)}>
          <div className="nexa-checkout-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-400" />
                <span className="font-semibold text-white text-sm tracking-wide">
                  NEXA SECURE CHECKOUT
                </span>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* SCREEN 1: PAYMENT SUCCESS (ORDER CONFIRMED) */}
            {paymentStatus === "success" && (
              <div className="py-8 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Payment Confirmed!</h3>
                  <p className="text-xs text-white/60 mt-1">
                    Thank you, {customer.name}. Your order has been placed.
                  </p>
                </div>

                <div className="w-full rounded-xl bg-white/5 p-4 border border-white/10 text-left space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-white/60">
                    <span>Order Reference</span>
                    <span className="text-white font-bold">{orderId}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Amount Paid</span>
                    <span className="text-emerald-400 font-bold">
                      ₹{checkoutSubtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Payment Gateway</span>
                    <span className="text-white">payments-service v2.13.8 (Nominal)</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Estimated Delivery</span>
                    <span className="text-white">2 Business Days</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full pt-2">
                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setPaymentStatus("idle");
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                  <Link
                    to="/app-dashboard"
                    className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-xs hover:bg-white/20 transition-all text-center"
                  >
                    View in Opsight Dashboard
                  </Link>
                </div>
              </div>
            )}

            {/* SCREEN 2: PAYMENT FAILURE (THE REALISTIC 504 ERROR MESSAGE) */}
            {paymentStatus === "failed" && (
              <div className="py-6 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 animate-pulse">
                  <AlertTriangle size={36} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Payment Failed</h3>
                  <p className="text-xs text-red-400 font-mono mt-1 font-semibold">
                    HTTP 504 Gateway Timeout: NEXA Payment Service Degraded
                  </p>
                </div>

                {/* Detailed Error Box */}
                <div className="w-full rounded-xl bg-black/60 p-4 border border-red-500/30 text-left space-y-2.5 text-xs">
                  <div className="text-[10px] font-mono text-red-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                    PRODUCTION SEV-1 TELEMETRY ALERT
                  </div>
                  <div className="space-y-1 text-neutral-300 font-mono text-[11px] leading-relaxed bg-black/40 p-2.5 rounded border border-white/5">
                    <p className="text-red-400 font-semibold">
                      • Error Code: ERR_GATEWAY_TIMEOUT_504
                    </p>
                    <p>• Service: payments-service on cluster node-us-east-2</p>
                    <p>
                      • Root Cause: Database connection pool exhaustion (98/100 connections in use)
                    </p>
                    <p className="text-white/50">
                      • Transaction POST /v2/checkout stalled after 30000ms
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 text-[11px] text-purple-300 flex items-center justify-between">
                    <span>Hindsight Precedent Match:</span>
                    <b className="font-mono text-white">#INC-014 (94% Match)</b>
                  </div>
                </div>

                {/* SRE Self-Healing & Investigation Action Buttons */}
                <div className="flex flex-col gap-2 w-full pt-1">
                  <button
                    disabled={isResolving}
                    onClick={handleRemediateAndRetry}
                    className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isResolving ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" /> Remediating with Opsight SRE...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} /> Auto-Remediate via Opsight & Complete Payment
                      </>
                    )}
                  </button>

                  <Link
                    to="/dashboard"
                    className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-all text-center font-mono"
                  >
                    Open Opsight 3D Incident Investigation →
                  </Link>
                </div>
              </div>
            )}

            {/* SCREEN 3: CHECKOUT FORM & PAYMENT SELECTION */}
            {(paymentStatus === "idle" || paymentStatus === "processing") && (
              <>
                {/* Items Summary Banner */}
                <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                  <div className="text-[11px] font-medium text-white/60 mb-2">
                    Order Items ({activeCheckoutItems.length})
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                    {activeCheckoutItems.map((item) => {
                      const prod = getProduct(item.id);
                      if (!prod) return null;
                      return (
                        <div key={item.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <img
                              src={prod.img}
                              alt={prod.name}
                              className="w-8 h-8 rounded object-cover"
                            />
                            <div>
                              <span className="text-white font-medium">{prod.name}</span>
                              <span className="text-white/40 ml-1.5 font-mono text-[10px]">
                                x{item.quantity}
                              </span>
                            </div>
                          </div>
                          <span className="text-white font-mono font-medium">
                            ₹{(prod.numericPrice * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold text-white pt-2.5 mt-2 border-t border-white/10">
                    <span>Total Amount Payable</span>
                    <span className="text-sm font-mono text-emerald-400">
                      ₹{checkoutSubtotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-white tracking-wide">
                    SHIPPING DETAILS
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder="Full Name"
                      className="col-span-1 p-2.5 rounded-lg bg-black/60 border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-white/40"
                    />
                    <input
                      type="email"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="Email"
                      className="col-span-1 p-2.5 rounded-lg bg-black/60 border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-white/40"
                    />
                    <input
                      type="text"
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      placeholder="Street Address"
                      className="col-span-2 p-2.5 rounded-lg bg-black/60 border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-white/40"
                    />
                    <input
                      type="text"
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      placeholder="City, State, Zip"
                      className="col-span-2 p-2.5 rounded-lg bg-black/60 border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-white/40"
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-white tracking-wide">
                    PAYMENT METHOD
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomer({ ...customer, paymentMode: "card" })}
                      className={`p-2.5 rounded-xl border text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        customer.paymentMode === "card"
                          ? "bg-white text-black border-white font-semibold"
                          : "bg-white/5 border-white/15 text-white/70 hover:text-white"
                      }`}
                    >
                      <CreditCard size={16} />
                      <span className="text-[11px]">Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomer({ ...customer, paymentMode: "upi" })}
                      className={`p-2.5 rounded-xl border text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        customer.paymentMode === "upi"
                          ? "bg-white text-black border-white font-semibold"
                          : "bg-white/5 border-white/15 text-white/70 hover:text-white"
                      }`}
                    >
                      <Zap size={16} />
                      <span className="text-[11px]">Instant UPI</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomer({ ...customer, paymentMode: "cod" })}
                      className={`p-2.5 rounded-xl border text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        customer.paymentMode === "cod"
                          ? "bg-white text-black border-white font-semibold"
                          : "bg-white/5 border-white/15 text-white/70 hover:text-white"
                      }`}
                    >
                      <ShieldCheck size={16} />
                      <span className="text-[11px]">Pay on Deliv</span>
                    </button>
                  </div>
                </div>

                {/* Pay Action Button */}
                <button
                  disabled={paymentStatus === "processing"}
                  onClick={handleProcessPayment}
                  className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl"
                >
                  {paymentStatus === "processing" ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Contacting Payment Gateway...
                    </>
                  ) : (
                    <>
                      Pay ₹{checkoutSubtotal.toLocaleString()} Now <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* OPSIGHT SRE SIDEBAR DRAWER                               */}
      {/* ======================================================== */}
      {isOpsightSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end"
          onClick={() => setIsOpsightSidebarOpen(false)}
        >
          <div
            className="w-[min(440px,94vw)] h-full bg-[#0a0a0f] border-l border-purple-500/30 shadow-2xl flex flex-col overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2.5">
                <img src="/favicon.ico" alt="Opsight" className="w-6 h-6 object-contain" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">OPSIGHT SRE</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase border ${
                        isSystemDegraded
                          ? "bg-red-950/80 text-red-300 border-red-500/40"
                          : "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                      }`}
                    >
                      {isSystemDegraded ? "SEV-1 OUTAGE" : "ALL NOMINAL"}
                    </span>
                  </div>
                  <span className="text-[10px] text-white/50 font-mono">
                    NEXA Storefront Edge Copilot
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpsightSidebarOpen(false)}
                className="p-1 rounded-md text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Animated Agent Orb Hero inside Sidebar */}
            <div className="p-5 border-b border-purple-500/20 bg-gradient-to-b from-purple-950/30 via-[#0a0a0f] to-transparent flex flex-col items-center justify-center text-center">
              <AgentOrb
                size="md"
                status={isSystemDegraded ? "incident" : "healthy"}
                message={
                  isSystemDegraded
                    ? "SEV-1 Outage: HikariCP connection pool exhausted on checkout-service. 504 Gateway Timeout returned on payments."
                    : "Autonomous SRE Copilot active. 200 OK across all NEXA edge nodes. PostgreSQL pool nominal at 24% capacity."
                }
              />
            </div>

            <div className="p-5 flex-1 flex flex-col gap-4">
              {/* Telemetry Status Card */}
              <div className="rounded-xl bg-white/[0.03] p-4 border border-white/10 space-y-3">
                <div className="text-[10px] font-mono text-purple-300 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Radio size={12} className="animate-pulse" /> LIVE TELEMETRY STREAM
                  </span>
                  <span className="text-white/40">node-us-east-2</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-white/40 text-[10px] block">CHECKOUT FLOW</span>
                    <strong className={isSystemDegraded ? "text-red-400" : "text-emerald-400"}>
                      {isSystemDegraded ? "504 TIMEOUT" : "200 OK (22ms)"}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-white/40 text-[10px] block">DB CONNECTIONS</span>
                    <strong className={isSystemDegraded ? "text-red-400" : "text-emerald-400"}>
                      {isSystemDegraded ? "98 / 100 (98%)" : "24 / 100 (24%)"}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-white/40 text-[10px] block">PAYMENT P99</span>
                    <strong className={isSystemDegraded ? "text-red-400" : "text-emerald-400"}>
                      {isSystemDegraded ? "3,800ms ↑" : "28ms ✓"}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-white/40 text-[10px] block">ERROR RATE</span>
                    <strong className={isSystemDegraded ? "text-red-400" : "text-emerald-400"}>
                      {isSystemDegraded ? "8.4% ↑" : "0.01% ✓"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Hindsight Episodic Precedent */}
              <div className="rounded-xl bg-purple-950/20 p-4 border border-purple-500/30 space-y-2.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-purple-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={12} /> HINDSIGHT CORRELATION
                  </span>
                  <span className="text-white font-bold bg-purple-500/30 px-1.5 py-0.5 rounded">
                    94% Match
                  </span>
                </div>
                <div className="text-xs text-white font-semibold">
                  Ticket #INC-014: Payment 504 Timeout & DB Pool Starvation
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed font-mono">
                  Release commit <code className="text-purple-300">a8f3c1b</code> leaked unclosed PostgreSQL transactions. Under checkout load, HikariCP exhausted all available handles.
                </p>
                <div className="text-[11px] text-emerald-300 bg-emerald-950/30 p-2 rounded border border-emerald-500/20">
                  <b>Proven Fix:</b> Rescale pool capacity, drain stale connections, rollback to payments release <code className="text-white">v2.13.8</code>.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {isSystemDegraded ? (
                  <button
                    onClick={() => {
                      setIsResolving(true);
                      setTimeout(() => {
                        setIsResolving(false);
                        setIsSystemDegraded(false);
                        showToast("Opsight SRE: Remediated outage & restored payment gateway!");
                      }, 1200);
                    }}
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isResolving ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" /> Remediating NEXA Outage...
                      </>
                    ) : (
                      <>
                        <Zap size={14} /> Auto-Remediate Production Outage
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsSystemDegraded(true);
                      showToast("Triggered SEV-1 payment failure simulation on NEXA");
                    }}
                    className="w-full py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/70 border border-red-500/40 text-red-200 font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    Simulate SEV-1 Payment Incident
                  </button>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    to="/dashboard"
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium text-center transition-all flex items-center justify-center gap-1.5"
                  >
                    <Layers size={13} /> 3D Spline Agent
                  </Link>
                  <Link
                    to="/environment"
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium text-center transition-all flex items-center justify-center gap-1.5"
                  >
                    <Cpu size={13} /> 3D Mesh
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -- Footer ---------------------------------- */}
      <footer className="nexa-page-footer">
        <div className="nexa-page-footer-inner">
          <div>
            <div className="nexa-page-footer-logo">NEXA</div>
            <p className="nexa-page-footer-tagline">
              Premium products for a smarter, modern lifestyle.
            </p>
          </div>
          <div>
            <div className="nexa-page-footer-title">Shop</div>
            <div
              className="nexa-page-footer-link"
              onClick={() => {
                setSelectedProduct(null);
                setCat("all");
              }}
            >
              All Products
            </div>
            <div
              className="nexa-page-footer-link"
              onClick={() => {
                setSelectedProduct(null);
                setCat("audio");
              }}
            >
              Audio Deals
            </div>
          </div>
          <div>
            <div className="nexa-page-footer-title">Company</div>
            <div className="nexa-page-footer-link" onClick={() => setSelectedProduct(null)}>
              About NEXA
            </div>
            <div className="nexa-page-footer-link" onClick={() => setIsCartOpen(true)}>
              Your Cart
            </div>
          </div>
          <div>
            <div className="nexa-page-footer-title">Stay in the loop</div>
            <div className="nexa-page-footer-link">New drops, first.</div>
          </div>
        </div>
        <div className="nexa-page-footer-copy">© 2026 NEXA. All rights reserved.</div>
      </footer>
    </div>
  );
}

export default NexaStore;
