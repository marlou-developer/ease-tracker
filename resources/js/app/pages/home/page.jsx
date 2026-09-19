import React, { useState, useRef, useEffect } from "react";
import {
  FcCalendar,
  FcClock,
  FcManager,
  FcAddressBook,
  FcConferenceCall,
  FcApproval,
  FcDiploma1,
  FcCheckmark,
  FcInspection,
  FcDepartment,
  FcKey,
  FcGlobe,
  FcPhone,
  FcRating,
  FcRules,
  FcLike,
  FcSearch,
  FcInfo,
} from "react-icons/fc";


// 1. ShinyText Component
const ShinyText = ({ text, disabled = false, speed = 3, className = "" }) => {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent bg-no-repeat ${disabled ? '' : 'shiny-text-animation'} ${className}`}
      style={{
        backgroundImage: 'linear-gradient(120deg, rgba(147, 51, 234, 1) 40%, rgba(255, 255, 255, 0.9) 50%, rgba(147, 51, 234, 1) 60%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        animationDuration: `${speed}s`,
      }}
    >
      {text}
    </span>
  );
};

// 2. SpotlightCard Component
const SpotlightCard = ({ children, className = "", spotlightColor = "rgba(168, 85, 247, 0.15)" }) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => { setIsFocused(true); setOpacity(1); };
  const handleBlur = () => { setIsFocused(false); setOpacity(0); };
  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden group ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out z-0"
        style={{
          opacity,
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};


// 3. Inline CursorGrid (Native Canvas Implementation)
const CursorGrid = ({
  cellSize = 70,
  color = "#D946EF",
  radius = 140,
  lineWidth = 1.2,
  maxOpacity = 1,
  clickPulse = true,
  pulseSpeed = 600,
}) => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const pulse = useRef({ active: false, x: 0, y: 0, startTime: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = (e) => {
      if (clickPulse) {
        pulse.current = {
          active: true,
          x: e.clientX,
          y: e.clientY,
          startTime: performance.now(),
        };
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    handleResize();

    const drawGrid = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw standard grid
      ctx.beginPath();
      for (let x = 0; x <= canvas.width; x += cellSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y <= canvas.height; y += cellSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();

      // Mask with radial gradient (destination-in retains pixels where the gradient is drawn)
      ctx.globalCompositeOperation = "destination-in";
      const gradient = ctx.createRadialGradient(
        mouse.current.x, mouse.current.y, 0,
        mouse.current.x, mouse.current.y, radius
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${maxOpacity})`);
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Handle the Click Pulse Effect
      if (pulse.current.active) {
        const elapsed = time - pulse.current.startTime;
        if (elapsed < pulseSpeed) {
          const progress = elapsed / pulseSpeed;
          const pulseRadius = progress * radius * 2.5; // Expanding radius
          const pulseOpacity = maxOpacity * (1 - progress); // Fades out

          const pulseGradient = ctx.createRadialGradient(
            pulse.current.x, pulse.current.y, pulseRadius * 0.8,
            pulse.current.x, pulse.current.y, pulseRadius
          );
          pulseGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
          pulseGradient.addColorStop(0.5, `rgba(255, 255, 255, ${pulseOpacity})`);
          pulseGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx.fillStyle = pulseGradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          pulse.current.active = false;
        }
      }

      ctx.globalCompositeOperation = "source-over"; // Reset for next frame
      animationFrameId = requestAnimationFrame(drawGrid);
    };

    drawGrid(performance.now());

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [cellSize, color, radius, lineWidth, maxOpacity, clickPulse, pulseSpeed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};


const SERVICES = [
  {
    id: "s1",
    name: "Executive Penthouse Suite",
    category: "Venues",
    price: 350,
    unit: "per night",
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    description: "Panoramic skyline views with private terrace, king bedroom, infinity jacuzzi, and 24/7 dedicated butler service.",
    features: ["Skyline Terrace", "King Bed", "Private Spa", "24/7 Butler"],
  },
  {
    id: "s2",
    name: "Luxury Wellness & Spa Day",
    category: "Wellness",
    price: 180,
    unit: "per session",
    rating: 4.8,
    reviews: 94,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
    description: "Full-body aromatherapy massage, thermal bath access, organic facial, and private herbal tea ceremony.",
    features: ["Aromatherapy", "Thermal Bath", "Organic Tea", "90 Minutes"],
  },
  {
    id: "s3",
    name: "Glasshouse Boardroom",
    category: "Venues",
    price: 120,
    unit: "per hour",
    rating: 4.9,
    reviews: 62,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    description: "High-tech meeting room with smart presentation displays, fiber WiFi, ergonomic seating, and barista catering.",
    features: ["16 Person Cap", "Smart Board", "4K Video Conferencing", "Coffee Bar"],
  },
  {
    id: "s4",
    name: "Gourmet Chef's Table",
    category: "Dining",
    price: 220,
    unit: "per guest",
    rating: 5.0,
    reviews: 215,
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
    description: "Exclusive 7-course tasting menu prepared live by Michelin-trained chefs, paired with sommelier vintage wines.",
    features: ["7-Course Menu", "Wine Pairing", "Private Chef", "Max 8 Guests"],
  },
  {
    id: "s5",
    name: "Private Yacht Charter",
    category: "Experiences",
    price: 850,
    unit: "per half-day",
    rating: 4.9,
    reviews: 47,
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80",
    description: "Cruise the coastline on a 50ft luxury motor yacht with private captain, crew, champagne, and water sports.",
    features: ["Private Crew", "Champagne Bar", "Snorkeling Gear", "Up to 12 Guests"],
  },
  {
    id: "s6",
    name: "VIP Helicopter Coastal Tour",
    category: "Experiences",
    price: 490,
    unit: "per flight",
    rating: 4.8,
    reviews: 83,
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80",
    description: "Breathtaking aerial photography flight across mountain ranges, ocean coastlines, and iconic city landmarks.",
    features: ["45 Min Flight", "Pilot Commentary", "GoPro Recording", "4 Passengers"],
  },
];

const AFFILIATES = [
  { name: "Grand Luxe Hotels", logo: "🏛️", type: "Hospitality Partner" },
  { name: "Apex Aviation", logo: "✈️", type: "Air Transport" },
  { name: "Serene Spa Group", logo: "🌿", type: "Wellness Network" },
  { name: "Michelin Select", logo: "🍷", type: "Fine Dining" },
  { name: "Marina Blue Charters", logo: "🛥️", type: "Yachting & Marine" },
];


export default function App() {
  // State Management
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [quickViewService, setQuickViewService] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState("2026-10-15");
  const [bookingTime, setBookingTime] = useState("10:00 AM");
  const [guests, setGuests] = useState(2);
  const [specialNotes, setSpecialNotes] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPriceFilter, setMaxPriceFilter] = useState(1000);
  const [sortBy, setSortBy] = useState("recommended");

  const categories = ["All", "Venues", "Wellness", "Dining", "Experiences"];
  const availableTimeSlots = ["09:00 AM", "11:30 AM", "02:00 PM", "05:00 PM", "08:00 PM"];


  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredServices = SERVICES.filter((s) => {
    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPrice = s.price <= maxPriceFilter;
    return matchesCategory && matchesSearch && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") || "guest@aurabook.com";
    const name = email.split("@")[0];
    setUser({ name, email });
    setIsLoginModalOpen(false);
    showToast(`Welcome back, ${name}! You are now signed in.`);
  };

  const toggleFavorite = (serviceId) => {
    if (favorites.includes(serviceId)) {
      setFavorites(favorites.filter((id) => id !== serviceId));
      showToast("Removed from saved wishlist.");
    } else {
      setFavorites([...favorites, serviceId]);
      showToast("Added experience to your saved wishlist!");
    }
  };

  const handleBookClick = (service) => {
    if (!user) {
      setIsLoginModalOpen(true);
      showToast("Please sign in to proceed with your reservation.");
      return;
    }
    setSelectedService(service);
  };

  const handleConfirmReservation = (e) => {
    e.preventDefault();
    if (!selectedService) return;

    const bookingRef = `AURA-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedBooking({
      ref: bookingRef,
      service: selectedService,
      date: bookingDate,
      time: bookingTime,
      guests,
      notes: specialNotes,
      total: selectedService.price,
    });
    setSelectedService(null);
    showToast(`Reservation ${bookingRef} successfully confirmed!`);
  };


  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-purple-600 selection:text-white relative overflow-x-hidden">
      
      {/* Dynamic Keyframes Injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shine {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .shiny-text-animation {
          animation: shine 4s linear infinite;
        }
        @keyframes aurora-blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-aurora-1 { animation: aurora-blob 12s infinite alternate cubic-bezier(0.4, 0, 0.2, 1); }
        .animate-aurora-2 { animation: aurora-blob 15s infinite alternate-reverse cubic-bezier(0.4, 0, 0.2, 1); animation-delay: 2s; }
        .animate-aurora-3 { animation: aurora-blob 18s infinite alternate cubic-bezier(0.4, 0, 0.2, 1); animation-delay: 4s; }
      `}} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 backdrop-blur-md text-white text-xs font-semibold px-5 py-3.5 rounded-full shadow-2xl border border-purple-500/30 flex items-center gap-3 animate-bounce">
          <FcInfo className="text-lg shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-purple-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-400 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <FcCalendar className="text-2xl" />
            </div>
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-500 bg-clip-text text-transparent tracking-tight">
                AuraBook
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-black tracking-widest text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full ml-2 border border-purple-200 shadow-inner">
                Reservations
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {favorites.length > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 bg-white/50 backdrop-blur-sm border border-purple-200 text-purple-700 text-xs font-bold px-4 py-2 rounded-full shadow-sm">
                <FcLike className="text-base animate-pulse" />
                <span>{favorites.length} Saved</span>
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-1.5 pr-4 rounded-full border border-purple-200 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <p className="font-bold text-slate-800">{user.name}</p>
                  <p className="text-purple-600 text-[10px] font-semibold">{user.email}</p>
                </div>
                <button
                  onClick={() => { setUser(null); showToast("Signed out successfully."); }}
                  className="ml-2 text-xs font-bold text-purple-700 hover:text-white bg-purple-50 hover:bg-purple-600 px-4 py-2 rounded-full border border-purple-200 transition-all duration-300 active:scale-95"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm px-7 py-3 rounded-full shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 active:scale-95"
              >
                <FcManager className="text-lg" />
                <span>Log In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {}
      
      {/* 
        Native HTML5 Canvas implementation of the requested ReactBits component.
        Using fixed position and negative/low z-index to stay below the relative content elements.
      */}
      <CursorGrid
        cellSize={70}
        color="#D946EF"
        radius={140}
        falloff="smooth"
        holdTime={400}
        fadeDuration={800}
        lineWidth={1.2}
        maxOpacity={1}
        clickPulse={true}
        pulseSpeed={600}
      />

      {}

      <section className="relative overflow-hidden py-24 lg:py-36">
        {/* Animated Aurora Mesh Background */}
        <div className="absolute inset-0 w-full h-full -z-10 bg-slate-50 overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-purple-300/40 rounded-full blur-[120px] mix-blend-multiply animate-aurora-1" />
          <div className="absolute top-[20%] -right-[10%] w-[45vw] h-[45vw] bg-indigo-300/30 rounded-full blur-[100px] mix-blend-multiply animate-aurora-2" />
          <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[40vw] bg-pink-200/40 rounded-full blur-[120px] mix-blend-multiply animate-aurora-3" />
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/60 backdrop-blur-md border border-purple-200/60 text-purple-800 text-xs font-bold mb-8 shadow-sm">
            <FcDiploma1 className="text-xl" />
            <span className="tracking-wide">Instant Premier Reservations</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight max-w-5xl mx-auto leading-[1.1]">
            Reserve Exceptional Spaces in <ShinyText text="One Touch" speed={4} className="font-extrabold" />
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Discover luxury penthouses, private yacht charters, executive boardrooms, and wellness retreats with instant booking confirmation.
          </p>

        </div>
      </section>


      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Featured Listings</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Select an option below. Unauthenticated users will be prompted to log in before booking.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full border border-purple-200 shadow-sm">
              {filteredServices.length} Results
            </span>
          </div>
        </div>

        {filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-white/50 backdrop-blur-md rounded-[2rem] border border-purple-100 shadow-xl shadow-purple-900/5">
            <FcInfo className="text-6xl mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-extrabold text-slate-800">No experiences match your filters</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Try adjusting your max price budget slider or clearing the search keywords.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setMaxPriceFilter(1000);
              }}
              className="mt-6 px-6 py-3 bg-purple-600 text-white text-sm font-bold rounded-full shadow-lg hover:shadow-purple-500/30 hover:bg-purple-700 transition-all active:scale-95"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => {
              const isFav = favorites.includes(service.id);
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-[2rem] overflow-hidden border border-purple-100/50 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1.5 transition-all duration-500 flex flex-col group relative"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-extrabold text-purple-700 shadow-lg z-10">
                      {service.category}
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(service.id); }}
                      className={`absolute top-5 right-5 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 active:scale-75 z-10 ${
                        isFav ? "bg-purple-600 text-white shadow-lg shadow-purple-500/40 scale-110" : "bg-white/80 hover:bg-white text-slate-600 shadow-md hover:scale-110"
                      }`}
                    >
                      <FcLike className={`text-xl ${isFav ? "brightness-125" : "grayscale opacity-70"}`} />
                    </button>

                    <button
                      onClick={() => setQuickViewService(service)}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out bg-white/95 backdrop-blur-md text-purple-700 text-xs font-bold px-6 py-2.5 rounded-full shadow-2xl hover:bg-purple-600 hover:text-white active:scale-95 z-10"
                    >
                      Quick View
                    </button>
                  </div>

                  <div className="p-7 flex-1 flex flex-col justify-between bg-white relative z-10">
                    <div>
                      <div className="flex justify-between items-start gap-3 mb-3">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-700 transition-colors duration-300 leading-tight">
                          {service.name}
                        </h3>
                        <div className="bg-purple-50 text-purple-800 px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0 shadow-sm border border-purple-100/50">
                          <FcRating className="text-sm" />
                          <span>{service.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium">{service.description}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {service.features.map((feat, idx) => (
                          <span key={idx} className="text-[10px] font-bold uppercase tracking-wide bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1.5 rounded-lg">
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-black text-purple-700">${service.price}</span>
                        <span className="text-xs font-semibold text-slate-400 ml-1 block sm:inline">/ {service.unit}</span>
                      </div>
                      <button
                        onClick={() => handleBookClick(service)}
                        className="bg-slate-900 hover:bg-purple-700 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-2 active:scale-95"
                      >
                        <FcCalendar className="text-lg" />
                        <span>Book Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>


      <section className="py-24 bg-white/70 backdrop-blur-md border-y border-purple-100/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider mb-6 border border-purple-200">
                <FcDepartment className="text-lg" />
                <span>About AuraBook</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Redefining How Luxury Experiences Are Reserved
              </h2>
              <p className="mt-6 text-slate-500 leading-relaxed text-base font-medium">
                Founded with a mission to eliminate friction in booking high-end accommodations and exclusive events, AuraBook connects discerning clients directly with penthouse suites, executive boardrooms, wellness retreats, and VIP charters.
              </p>
              <div className="mt-10 grid grid-cols-3 gap-8 pt-8 border-t border-slate-100">
                <div>
                  <p className="text-4xl font-black text-purple-600 tracking-tighter">99.8%</p>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mt-2">Instant Fulfillment</p>
                </div>
                <div>
                  <p className="text-4xl font-black text-purple-600 tracking-tighter">150+</p>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mt-2">Global Venues</p>
                </div>
                <div>
                  <p className="text-4xl font-black text-purple-600 tracking-tighter">24/7</p>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mt-2">Concierge Desk</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-5">
                <SpotlightCard className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                  <FcInspection className="text-5xl mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300" />
                  <h4 className="font-extrabold text-slate-900 text-lg">Vetted Listings</h4>
                  <p className="text-sm text-slate-500 mt-2 font-medium">Every luxury property and experience undergoes strict quality inspection.</p>
                </SpotlightCard>
                <SpotlightCard className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                  <FcKey className="text-5xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
                  <h4 className="font-extrabold text-slate-900 text-lg">Instant Access</h4>
                  <p className="text-sm text-slate-500 mt-2 font-medium">Receive your digital reservation voucher seconds after booking.</p>
                </SpotlightCard>
              </div>
              <div className="space-y-5 pt-8">
                <SpotlightCard className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                  <FcConferenceCall className="text-5xl mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300" />
                  <h4 className="font-extrabold text-slate-900 text-lg">Dedicated Host</h4>
                  <p className="text-sm text-slate-500 mt-2 font-medium">Personal hosts to manage special requests and dietary details.</p>
                </SpotlightCard>
                <SpotlightCard className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                  <FcApproval className="text-5xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
                  <h4 className="font-extrabold text-slate-900 text-lg">Guaranteed Rates</h4>
                  <p className="text-sm text-slate-500 mt-2 font-medium">Transparent pricing with no unexpected hidden surcharge fees.</p>
                </SpotlightCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <p className="text-xs font-black uppercase tracking-widest text-purple-500">Our Trusted Ecosystem</p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2">Affiliated Partners & Hosts</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {AFFILIATES.map((aff, i) => (
            <SpotlightCard key={i} className="p-6 bg-white/70 backdrop-blur-md rounded-[2rem] border border-slate-100 shadow-sm hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/10 transition-transform duration-300 text-center flex flex-col items-center justify-center hover:-translate-y-1">
              <span className="text-4xl mb-4 group-hover:scale-125 group-hover:rotate-6 transition-transform duration-500">{aff.logo}</span>
              <p className="font-extrabold text-sm text-slate-800 relative z-10">{aff.name}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-purple-500 mt-1.5 relative z-10">{aff.type}</p>
            </SpotlightCard>
          ))}
        </div>
      </section>


      <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 mt-20 relative overflow-hidden z-10">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-purple-900/50">
                  A
                </div>
                <span className="text-2xl font-black text-white tracking-tight">AuraBook</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                The premier platform for reserving penthouses, private yachts, executive meeting rooms, and wellness retreats worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6">Quick Links</h4>
              <ul className="space-y-3.5 text-sm text-slate-400 font-medium">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Penthouse Suites</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Wellness & Spa Days</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Yacht Charters</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6">Support & Terms</h4>
              <ul className="space-y-3.5 text-sm text-slate-400 font-medium">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Reservation Guidelines</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Cancellation Policy</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6">Concierge Desk</h4>
              <div className="space-y-4 text-sm text-slate-300 font-medium">
                <div className="flex items-center gap-3">
                  <FcPhone className="text-xl" />
                  <span className="hover:text-white transition-colors cursor-pointer">+1 (800) 555-AURA</span>
                </div>
                <div className="flex items-center gap-3">
                  <FcAddressBook className="text-xl" />
                  <span className="hover:text-white transition-colors cursor-pointer">concierge@aurabook.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium">
            <p>© {new Date().getFullYear()} AuraBook Inc. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Enhanced with HTML5 Canvas Custom Animations.</p>
          </div>
        </div>
      </footer>


      {quickViewService && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 transition-opacity">
          <div className="bg-white rounded-[2.5rem] max-w-3xl w-full overflow-hidden shadow-2xl shadow-purple-900/20 border border-white/20 relative animate-in zoom-in-95 duration-300">
            <button onClick={() => setQuickViewService(null)} className="absolute top-5 right-5 z-20 text-slate-600 hover:text-slate-900 bg-white/90 backdrop-blur-xl w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg hover:scale-110 active:scale-95 transition-all">✕</button>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-72 md:h-full relative overflow-hidden group">
                <img src={quickViewService.image} alt={quickViewService.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent md:hidden" />
                <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md text-purple-700 text-xs font-extrabold px-4 py-1.5 rounded-full shadow-lg z-10">{quickViewService.category}</div>
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-between bg-white relative z-10 -mt-6 md:mt-0 rounded-t-[2.5rem] md:rounded-none">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-purple-700 mb-2">
                    <FcRating className="text-base" />
                    <span>{quickViewService.rating} Rating</span>
                    <span className="text-slate-400 font-medium">({quickViewService.reviews} reviews)</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">{quickViewService.name}</h3>
                  <p className="text-sm text-slate-500 mt-4 leading-relaxed font-medium">{quickViewService.description}</p>
                  <div className="mt-8">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Included Features</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {quickViewService.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                          <FcCheckmark className="text-base shrink-0 bg-purple-50 rounded-full p-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-black text-purple-700">${quickViewService.price}</span>
                    <span className="text-xs font-semibold text-slate-400 ml-1">/ {quickViewService.unit}</span>
                  </div>
                  <button
                    onClick={() => {
                      const target = quickViewService;
                      setQuickViewService(null);
                      handleBookClick(target);
                    }}
                    className="bg-slate-900 hover:bg-purple-700 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-xl hover:shadow-purple-500/30 transition-all duration-300 active:scale-95"
                  >
                    Proceed to Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-10 shadow-2xl border border-white/20 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center transition-colors active:scale-95">✕</button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner border border-purple-100">
                <FcManager className="text-4xl" />
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sign In</h3>
              <p className="text-sm text-slate-500 mt-2 font-medium">Log in to securely manage your reservations.</p>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                <input type="email" name="email" required placeholder="alex.smith@example.com" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 focus:bg-white transition-all placeholder:font-normal" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Password</label>
                <input type="password" required placeholder="••••••••" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 focus:bg-white transition-all placeholder:font-normal" />
              </div>
              <button type="submit" className="w-full mt-2 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-purple-500/30 transition-all duration-300 active:scale-95">
                Sign In & Continue
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedService && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-8 sm:p-10 shadow-2xl border border-white/20 relative max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-10 zoom-in-95 duration-300">
            <button onClick={() => setSelectedService(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center transition-colors active:scale-95 z-10">✕</button>
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100 mb-8 pr-12">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0 border border-purple-100 shadow-inner">
                <FcCalendar className="text-3xl" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 leading-tight">{selectedService.name}</h3>
                <p className="text-sm text-purple-600 font-bold mt-1">
                  ${selectedService.price} <span className="text-slate-400 font-medium">/ {selectedService.unit.replace('per ', '')}</span>
                </p>
              </div>
            </div>
            <form onSubmit={handleConfirmReservation} className="space-y-6">
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><FcCalendar className="text-sm" /> Select Date</label>
                <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all cursor-pointer" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5"><FcClock className="text-sm" /> Preferred Time Slot</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {availableTimeSlots.map((slot) => (
                    <button key={slot} type="button" onClick={() => setBookingTime(slot)} className={`py-3 px-2 text-xs font-extrabold rounded-2xl border transition-all duration-200 active:scale-95 ${bookingTime === slot ? "bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/30" : "bg-white text-slate-600 border-slate-200 hover:border-purple-300 hover:bg-purple-50"}`}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><FcConferenceCall className="text-sm" /> Party Size (Guests)</label>
                <div className="flex items-center gap-4 bg-slate-50 w-max p-2 rounded-2xl border border-slate-200">
                  <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} className="w-10 h-10 rounded-xl bg-white text-slate-700 font-black text-lg shadow-sm border border-slate-100 hover:bg-purple-50 hover:text-purple-700 transition-colors active:scale-90">-</button>
                  <div className="flex flex-col items-center justify-center w-12"><span className="font-extrabold text-slate-900 text-lg leading-none">{guests}</span></div>
                  <button type="button" onClick={() => setGuests(guests + 1)} className="w-10 h-10 rounded-xl bg-white text-slate-700 font-black text-lg shadow-sm border border-slate-100 hover:bg-purple-50 hover:text-purple-700 transition-colors active:scale-90">+</button>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><FcRules className="text-sm" /> Special Notes & Requests</label>
                <textarea rows="3" value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)} placeholder="Anniversary champagne setup, dietary needs, window seating..." className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all placeholder:font-normal placeholder:text-slate-400" />
              </div>
              <div className="bg-purple-50 p-5 rounded-3xl border border-purple-200/60 flex items-center justify-between shadow-inner">
                <div>
                  <p className="text-xs text-purple-800 font-black uppercase tracking-wider">Total Charge</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Includes taxes & fees</p>
                </div>
                <p className="text-3xl font-black text-purple-700 tracking-tight">${selectedService.price}</p>
              </div>
              <button type="submit" className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-sm uppercase tracking-wide rounded-2xl shadow-xl shadow-purple-500/30 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 active:scale-95">
                Confirm Reservation
              </button>
            </form>
          </div>
        </div>
      )}

      {confirmedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full p-10 shadow-2xl border border-white/20 text-center relative animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-purple-100">
              <FcCheckmark className="text-5xl animate-bounce" />
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Confirmed!</h3>
            <p className="text-sm text-slate-500 mt-2 font-medium">Your digital voucher has been sent to your email.</p>
            <div className="my-8 p-5 bg-slate-50 rounded-3xl border border-slate-100 text-left space-y-3 shadow-inner">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-bold">Ref Code:</span>
                <span className="font-mono font-bold text-purple-700 bg-purple-100/50 px-2.5 py-1 rounded-lg border border-purple-200/50">{confirmedBooking.ref}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-slate-200/60 pt-3">
                <span className="text-slate-500 font-bold">Service:</span>
                <span className="font-extrabold text-slate-800 text-right max-w-[60%] truncate">{confirmedBooking.service.name}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-slate-200/60 pt-3">
                <span className="text-slate-500 font-bold">Schedule:</span>
                <span className="font-extrabold text-slate-800">{confirmedBooking.date} / {confirmedBooking.time}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-slate-200/60 pt-3">
                <span className="text-slate-500 font-bold">Guests:</span>
                <span className="font-extrabold text-slate-800">{confirmedBooking.guests} Person(s)</span>
              </div>
            </div>
            <button onClick={() => setConfirmedBooking(null)} className="w-full py-4 bg-slate-900 hover:bg-purple-700 text-white font-extrabold text-sm uppercase tracking-wide rounded-2xl shadow-xl hover:shadow-purple-500/30 transition-all duration-300 active:scale-95">
              Return to Catalog
            </button>
          </div>
        </div>
      )}
    </div>
  );
}