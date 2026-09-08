import { useRef, useState } from "react";

/* ============================================================
   DESIGN TOKENS - PURPLE THEME & INTERACTIVE
   Tailwind core utilities handle layout/spacing/type-scale.
   Custom brand colors + a few animations that core Tailwind
   can't express live in this injected stylesheet.
============================================================ */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    :root{
      /* Deep Purples for headers/dark sections */
      --pitch: #2E1065; 
      --pitch-2: #3B0764; 
      --pitch-3: #4C1D95;
      
      /* Light backgrounds */
      --chalk: #FAF5FF; 
      --chalk-2: #FFFFFF;
      
      /* Text colors */
      --ink: #1E1B4B; 
      --ink-dim: #6B7280;
      
      /* Vibrant Purple Accent */
      --amber: #8B5CF6; 
      --amber-ink: #FFFFFF;
      
      /* Borders & Lines */
      --line: rgba(139, 92, 246, 0.15); 
      --line-strong: rgba(139, 92, 246, 0.30);
      --line-dark: rgba(46, 16, 101, 0.10); 
      --line-dark-strong: rgba(46, 16, 101, 0.25);
    }
    
    .mp-root{ font-family:'Plus Jakarta Sans', sans-serif; background:var(--chalk); color:var(--ink); }
    .mp-display{ font-family:'Outfit', sans-serif; font-weight:700; letter-spacing:-0.02em; }
    .mp-root ::selection{ background:var(--amber); color:var(--amber-ink); }
    
    .mp-root button:focus-visible, .mp-root input:focus-visible, .mp-root dialog:focus-visible{
      outline:3px solid rgba(139, 92, 246, 0.5); outline-offset:2px;
    }
    
    /* Global Interactive Button Styles */
    .mp-root button{ 
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
    }
    .mp-root button:active:not(:disabled){ transform:scale(0.94); }

    /* Animations */
    @keyframes screenIn{ 
      from{opacity:0; transform:translateY(15px) scale(0.98);} 
      to{opacity:1; transform:translateY(0) scale(1);} 
    }
    .screen-anim{ animation:screenIn .4s cubic-bezier(0.16, 1, 0.3, 1) both; }

    @keyframes popIn{ 
      0%{transform:scale(1);} 
      40%{transform:scale(1.1) rotate(2deg);} 
      100%{transform:scale(1) rotate(0);} 
    }
    .pop-anim{ animation:popIn .3s cubic-bezier(0.34, 1.56, 0.64, 1); }

    @keyframes scrollBoard{ 0%{transform:translateY(0);} 100%{transform:translateY(-50%);} }
    .board-track{ animation:scrollBoard 20s linear infinite; }
    .board-viewport:hover .board-track{ animation-play-state:paused; }

    @keyframes pulseDot{ 0%,100%{transform:scale(1); opacity:1; box-shadow: 0 0 0 0 rgba(139,92,246,0.7);} 50%{transform:scale(1.2); opacity:.7; box-shadow: 0 0 0 6px rgba(139,92,246,0);} }
    .pulse-dot{ animation:pulseDot 2s ease-in-out infinite; }

    @keyframes toastIn{ 
      from{opacity:0; transform:translate(-50%, 20px) scale(0.9);} 
      to{opacity:1; transform:translate(-50%, 0) scale(1);} 
    }
    .toast-anim{ animation:toastIn .4s cubic-bezier(0.16, 1, 0.3, 1) both; }

    /* Interactive Cards */
    .venue-card-hover{ 
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }
    .venue-card-hover:hover{ 
      transform:translateY(-6px); 
      box-shadow: 0 20px 25px -5px rgba(139, 92, 246, 0.15), 0 10px 10px -5px rgba(139, 92, 246, 0.04);
      border-color: var(--amber);
    }
    
    .lift-hover{ transition: all 0.2s ease; }
    .lift-hover:hover:not(:disabled){ 
      transform:translateY(-2px); 
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
    }

    /* Layout Grids */
    .grid-hero{ display:grid; gap:4rem; grid-template-columns:1fr; align-items:center; }
    .grid-confirm{ display:grid; gap:3.5rem; grid-template-columns:1fr; align-items:start; }
    @media (min-width:768px){
      .grid-hero{ grid-template-columns:1.2fr 0.8fr; }
      .grid-confirm{ grid-template-columns:1fr 1.15fr; }
    }

    /* Glassmorphism Dialog */
    dialog.mp-dialog{ 
      border:none; border-radius:20px; padding:0; width:360px; max-width:90vw; 
      box-shadow:0 25px 50px -12px rgba(46, 16, 101, 0.5); 
      background: rgba(255,255,255,0.95); backdrop-filter: blur(10px);
    }
    dialog.mp-dialog::backdrop{ background:rgba(15, 2, 38, 0.6); backdrop-filter: blur(4px); }

    /* Glass Nav */
    .glass-nav {
      background: rgba(250, 245, 255, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    @media (prefers-reduced-motion: reduce){
      .board-track, .pulse-dot, .screen-anim, .pop-anim, .toast-anim{ animation:none !important; }
      .mp-root button:active:not(:disabled), .venue-card-hover:hover, .lift-hover:hover:not(:disabled){ transform:none !important; }
    }
  `}</style>
);

const SPORT_COLOR = {
  tennis:"#F59E0B", soccer:"#10B981", basketball:"#F97316",
  badminton:"#3B82F6", swimming:"#06B6D4", padel:"#8B5CF6", volleyball:"#EC4899",
};

const SPORTS = [
  { key:"tennis", label:"Tennis" },
  { key:"soccer", label:"Soccer" },
  { key:"basketball", label:"Basketball" },
  { key:"badminton", label:"Badminton" },
  { key:"swimming", label:"Swimming" },
  { key:"padel", label:"Padel" },
  { key:"volleyball", label:"Volleyball" },
];

const VENUES = [
  { id:"v1", name:"Riverside Tennis Club", sport:"tennis", area:"Riverside Park", addr:"12 Riverside Ave", price:18, rating:4.8, dist:"1.2 km", courts:4 },
  { id:"v2", name:"Lakeside Tennis Academy", sport:"tennis", area:"Lakeside", addr:"88 Lakeside Rd", price:22, rating:4.6, dist:"3.4 km", courts:3 },
  { id:"v3", name:"Greenfield Pitch", sport:"soccer", area:"Greenfield", addr:"5 Greenfield Way", price:60, rating:4.7, dist:"2.1 km", courts:2 },
  { id:"v4", name:"Union Street Turf", sport:"soccer", area:"Union District", addr:"201 Union St", price:55, rating:4.5, dist:"4.0 km", courts:1 },
  { id:"v5", name:"Oakwood Courts", sport:"basketball", area:"Oakwood", addr:"40 Oakwood Blvd", price:25, rating:4.9, dist:"0.8 km", courts:3 },
  { id:"v6", name:"Metro Badminton Hall", sport:"badminton", area:"Metro Center", addr:"9 Metro Plaza", price:14, rating:4.6, dist:"1.9 km", courts:6 },
  { id:"v7", name:"Harbor Aquatics Center", sport:"swimming", area:"Harbor District", addr:"77 Harbor Rd", price:12, rating:4.7, dist:"2.6 km", courts:8 },
  { id:"v8", name:"Sunset Padel Club", sport:"padel", area:"Sunset Hills", addr:"23 Sunset Ln", price:30, rating:4.8, dist:"3.1 km", courts:3 },
  { id:"v9", name:"Dunecrest Volleyball", sport:"volleyball", area:"Dunecrest Beach", addr:"1 Shoreline Dr", price:20, rating:4.5, dist:"5.2 km", courts:2 },
];

const HOURS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"];
const DAY_LABELS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const STEP_LABELS = ["Pick a time", "Your details", "Confirmed"];

function sportInfo(key){ return SPORTS.find(s => s.key === key); }
function venueInfo(id){ return VENUES.find(v => v.id === id); }
function seedRand(seed){ const x = Math.sin(seed) * 10000; return x - Math.floor(x); }
function isBooked(venueIndex, dateIndex, hourIndex){ return seedRand(venueIndex*137 + dateIndex*31 + hourIndex*7 + 1) < 0.32; }
function courtFor(hourIndex, courts){ return (hourIndex % courts) + 1; }
function nextDates(n){ const out=[]; const today=new Date(); for(let i=0;i<n;i++){ const d=new Date(today); d.setDate(today.getDate()+i); out.push(d);} return out; }
function fmtFullDate(d){ return d.toLocaleDateString(undefined, { weekday:"long", month:"long", day:"numeric" }); }

/* ============================================================
   ICONS — small stroke-based glyphs, one per sport
============================================================ */
function Icon({ sport, className, style }) {
  const common = { viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"1.75", strokeLinecap:"round", strokeLinejoin:"round", className, style };
  switch (sport) {
    case "tennis": return (
      <svg {...common}><circle cx="12" cy="12" r="8"/><path d="M4.5 6.5C7 8 9 11 9.5 17.5M19.5 6.5C17 8 15 11 14.5 17.5"/></svg>
    );
    case "soccer": return (
      <svg {...common}><circle cx="12" cy="12" r="8"/><path d="M12 7l3.5 2.5-1.3 4.1H9.8L8.5 9.5z"/><path d="M12 7V4.5M15.5 9.5l2.3-1.4M13.7 13.6l1.2 2.4M10.3 13.6l-1.2 2.4M8.5 9.5L6.2 8.1"/></svg>
    );
    case "basketball": return (
      <svg {...common}><circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4v16M6.3 6.3c3.5 3 3.5 8.4 0 11.4M17.7 6.3c-3.5 3-3.5 8.4 0 11.4"/></svg>
    );
    case "badminton": return (
      <svg {...common}><path d="M12 3l3 6-8 10-2-2 10-8z"/><path d="M12 3l-2.5 1M12 3l1 3M7 15l-3.5 3.5"/></svg>
    );
    case "swimming": return (
      <svg {...common}><path d="M3 15c1.5-1.4 3-1.4 4.5 0s3 1.4 4.5 0 3-1.4 4.5 0 3 1.4 4.5 0"/><path d="M3 19c1.5-1.4 3-1.4 4.5 0s3 1.4 4.5 0 3-1.4 4.5 0 3 1.4 4.5 0"/><circle cx="15" cy="6" r="1.6"/><path d="M8 12.5l4-2 2 2.2 3-1.4"/></svg>
    );
    case "padel": return (
      <svg {...common}><rect x="8" y="3" width="8" height="11" rx="4"/><path d="M12 14v7"/><circle cx="10.3" cy="7.5" r=".5" fill="currentColor"/><circle cx="13.7" cy="7.5" r=".5" fill="currentColor"/><circle cx="12" cy="10" r=".5" fill="currentColor"/></svg>
    );
    case "volleyball": return (
      <svg {...common}><circle cx="12" cy="12" r="8"/><path d="M12 4c3 2.4 3 15.6 0 16M4.5 9c4.2 1 15 1 15 0M4.5 15c4.2-1 15-1 15 0"/></svg>
    );
    default: return null;
  }
}

/* ============================================================
   SMALL SHARED PIECES
============================================================ */
function Stepper({ activeIndex, center }) {
  return (
    <div className={`flex items-center my-8 ${center ? "justify-center" : ""}`}>
      {STEP_LABELS.map((label, i) => {
        const done = i < activeIndex, now = i === activeIndex;
        return (
          <div className="flex items-center" key={label}>
            <div className="flex items-center gap-3">
              <span
                className={`mp-display flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm flex-shrink-0 transition-all duration-300 ${now ? 'shadow-[0_0_15px_rgba(139,92,246,0.4)] scale-110' : ''}`}
                style={{
                  borderColor: done || now ? "var(--amber)" : "var(--line-dark-strong)",
                  background: now ? "var(--amber)" : done ? "var(--pitch)" : "var(--chalk-2)",
                  color: now ? "var(--amber-ink)" : done ? "var(--chalk-2)" : "var(--ink-dim)",
                }}
              >
                {done ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 13l4 4L19 7"/></svg>
                ) : (
                  i + 1
                )}
              </span>
              <span
                className="text-sm hidden sm:inline tracking-wide transition-colors duration-300"
                style={{ color: now ? "var(--amber)" : done ? "var(--ink)" : "var(--ink-dim)", fontWeight: now ? 700 : 500 }}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className="h-[2px] mx-4 rounded-full transition-colors duration-300" style={{ background: done ? "var(--amber)" : "var(--line-dark-strong)", minWidth: 32, maxWidth: 80, width: "100%" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function BackButton({ onClick, children }) {
  return (
    <button onClick={onClick} className="group flex items-center gap-2 text-sm mb-6 font-semibold transition-colors duration-200" style={{ color: "var(--ink-dim)" }}>
      <span className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:-translate-x-1 transition-transform duration-200 border" style={{ borderColor: "var(--line-dark)" }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M15 18l-6-6 6-6"/></svg>
      </span>
      <span className="group-hover:text-[var(--ink)]">{children}</span>
    </button>
  );
}

function ToastStack({ toasts }) {
  return (
    <div className="fixed bottom-8 left-1/2 z-50 flex flex-col items-center gap-3 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className="toast-anim flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium"
          style={{ background: "rgba(30, 27, 75, 0.95)", backdropFilter: "blur(8px)", color: "var(--chalk-2)", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)", transform: "translateX(-50%)", position: "relative", left: "50%" }}
        >
          <span className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse" style={{ background: "var(--amber)" }} />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   MAIN APP
============================================================ */
export default function App() {
  const [screen, setScreen] = useState("home");
  const [sportFilter, setSportFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [venueId, setVenueId] = useState(null);
  const [dateIndex, setDateIndex] = useState(0);
  const [slot, setSlot] = useState(null); // {hourIndex, hour, court}
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [nameErr, setNameErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [checkDrawn, setCheckDrawn] = useState(false);

  const signinRef = useRef(null);
  const venueGridRef = useRef(null);
  const stepsRef = useRef(null);

  function toast(msg) {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }

  function go(name) {
    setScreen(name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openVenue(id) {
    setVenueId(id);
    setDateIndex(0);
    setSlot(null);
    go("venue");
  }

  function openMyBookings() { go("bookings"); }

  function scrollToVenues() {
    venueGridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function scrollToSteps() {
    if (screen !== "home") { go("home"); setTimeout(() => stepsRef.current?.scrollIntoView({ behavior: "smooth" }), 300); }
    else stepsRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function doSignin(name) {
    if (!name.trim()) { toast("Please enter your name to continue."); return; }
    setUser(name.trim());
    signinRef.current?.close();
    toast(`Welcome back, ${name.trim().split(" ")[0]}!`);
  }
  
  function toggleSignin() {
    if (user) { setUser(null); toast("You have successfully signed out."); return; }
    signinRef.current?.showModal();
  }

  function cancelBooking(i) {
    const b = bookings[i];
    setBookings(bs => bs.filter((_, idx) => idx !== i));
    toast(`Cancelled ${b.venueName} on ${b.dateLabel}.`);
  }

  function validEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function confirmBooking() {
    const okName = !!form.name.trim();
    const okEmail = validEmail(form.email.trim());
    setNameErr(!okName);
    setEmailErr(!okEmail);
    if (!okName || !okEmail) { toast("Please check the highlighted fields."); return; }

    const v = venueInfo(venueId);
    const d = nextDates(7)[dateIndex];
    const code = "MP-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    const dateLabel = fmtFullDate(d);

    setBookings(bs => [{ sport: v.sport, venueName: v.name, dateLabel, time: slot.hour, court: slot.court, code, addr: v.addr, area: v.area }, ...bs]);
    setCheckDrawn(false);
    go("success");
    toast("Awesome! Your booking is confirmed.");
    setTimeout(() => setCheckDrawn(true), 150);
  }

  const filteredVenues = VENUES.filter(v => (sportFilter === "all" || v.sport === sportFilter))
    .filter(v => {
      const q = searchText.trim().toLowerCase();
      if (!q) return true;
      return v.name.toLowerCase().includes(q) || v.area.toLowerCase().includes(q);
    });

  const lastBooking = bookings[0];

  return (
    <div className="mp-root min-h-screen">
      <GlobalStyle />

      {/* NAV */}
      <nav className="sticky top-0 z-40 glass-nav border-b border-[var(--line-dark)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-6 py-4">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => go("home")}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[var(--amber)] to-[var(--pitch-3)] shadow-lg shadow-[var(--amber)]/20 group-hover:scale-105 transition-transform duration-300">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--chalk-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4v16"/></svg>
            </div>
            <span className="mp-display text-2xl tracking-tight text-[var(--pitch)]">MatchPoint</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-semibold text-[15px]" style={{ color: "var(--ink-dim)" }}>
            <button onClick={() => go("home")} className="hover:text-[var(--amber)] transition-colors py-2">Explore</button>
            <button onClick={scrollToSteps} className="hover:text-[var(--amber)] transition-colors py-2">How it works</button>
            <button onClick={openMyBookings} className="hover:text-[var(--amber)] transition-colors py-2 flex items-center gap-2">
              My bookings 
              {bookings.length > 0 && <span className="bg-[var(--amber)] text-white text-xs px-2 py-0.5 rounded-full">{bookings.length}</span>}
            </button>
          </div>
          <button
            onClick={toggleSignin}
            className="px-6 py-2.5 text-[15px] font-bold rounded-full shadow-md hover:shadow-lg transition-all border border-transparent hover:border-[var(--line-strong)]"
            style={{ background: user ? "var(--chalk-2)" : "var(--pitch)", color: user ? "var(--pitch)" : "var(--chalk-2)" }}
          >
            {user ? `Hey, ${user.split(" ")[0]}` : "Sign In"}
          </button>
        </div>
      </nav>

      {/* SIGN-IN DIALOG */}
      <dialog ref={signinRef} className="mp-dialog">
        <SigninForm onCancel={() => signinRef.current?.close()} onSubmit={doSignin} />
      </dialog>

      <ToastStack toasts={toasts} />

      {/* ================= HOME ================= */}
      {screen === "home" && (
        <div className="screen-anim">
          <section className="pt-20 pb-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--pitch) 0%, var(--pitch-3) 100%)", color: "var(--chalk-2)" }}>
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--amber)] rounded-full blur-[120px] opacity-20 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--pitch-2)] rounded-full blur-[100px] opacity-40 -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 grid-hero relative z-10">
              <div>
                <span className="inline-block py-1.5 px-4 rounded-full text-sm font-bold mb-6 border border-[var(--amber)] text-[var(--amber)] bg-[var(--amber)]/10 backdrop-blur-sm shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                  Live Court Availability
                </span>
                <h1 className="mp-display" style={{ fontSize: "clamp(46px,6vw,72px)", lineHeight: 1.05, maxWidth: "12ch" }}>
                  Find your court. <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--amber)] to-[#D8B4FE]">Play instantly.</span>
                </h1>
                <p className="mt-6 text-lg max-w-lg leading-relaxed" style={{ color: "rgba(247,245,239,0.75)" }}>
                  Tennis, football, basketball, swimming and more — see real openings across your city and lock in a slot in under a minute.
                </p>

                <div className="flex flex-wrap gap-3 mt-10">
                  <SportChip active={sportFilter === "all"} onClick={() => setSportFilter("all")} label="All sports" />
                  {SPORTS.map(s => (
                    <SportChip key={s.key} active={sportFilter === s.key} onClick={() => setSportFilter(s.key)} sport={s.key} label={s.label} />
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mt-8 p-3 rounded-2xl shadow-2xl backdrop-blur-md" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div className="flex-1 min-w-[200px] bg-white/10 rounded-xl flex items-center px-4 focus-within:ring-2 ring-[var(--amber)] transition-shadow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-white/50"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
                    <input
                      value={searchText}
                      onChange={e => setSearchText(e.target.value)}
                      placeholder="Search neighborhood or venue..."
                      className="w-full bg-transparent border-none text-[15px] font-medium px-3 py-3.5 outline-none placeholder-white/50"
                      style={{ color: "var(--chalk-2)" }}
                    />
                  </div>
                  <button
                    onClick={scrollToVenues}
                    className="px-8 py-3.5 text-[15px] font-bold rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:scale-105 transition-all"
                    style={{ background: "var(--amber)", color: "var(--amber-ink)" }}
                  >
                    Search Courts
                  </button>
                </div>
              </div>

              <LiveBoard />
            </div>
          </section>

          <section className="py-24 relative" ref={venueGridRef}>
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
                <div>
                  <h2 className="mp-display text-4xl text-[var(--pitch)]">Available Venues</h2>
                  <p className="text-[var(--ink-dim)] mt-2 font-medium">Explore premium courts and facilities</p>
                </div>
                <span className="text-sm font-bold bg-[var(--chalk-2)] px-4 py-2 rounded-full shadow-sm border border-[var(--line-dark)] text-[var(--amber)]">
                  {filteredVenues.length} {filteredVenues.length === 1 ? "Result" : "Results"} found
                </span>
              </div>
              
              {filteredVenues.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-[var(--line-dark)] border-dashed">
                  <div className="w-16 h-16 bg-[var(--chalk)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--ink-dim)" strokeWidth="2" className="w-8 h-8"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
                  </div>
                  <h3 className="mp-display text-xl text-[var(--pitch)]">No venues found</h3>
                  <p style={{ color: "var(--ink-dim)" }} className="mt-2 text-[15px]">Try adjusting your filters or searching a different area.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredVenues.map((v, i) => (
                    <div key={v.id} style={{ animationDelay: `${i * 50}ms` }} className="screen-anim">
                      <VenueCard v={v} onOpen={() => openVenue(v.id)} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="py-24 relative overflow-hidden" style={{ background: "var(--pitch)", color: "var(--chalk-2)" }} ref={stepsRef}>
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--amber)] to-transparent opacity-50"></div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-[var(--amber)] font-bold tracking-wider uppercase text-sm">How it works</span>
                <h2 className="mp-display text-4xl mt-3">Book your game in minutes</h2>
              </div>
              <div className="grid gap-8 md:grid-cols-3 relative">
                {/* Connecting Line behind numbers */}
                <div className="hidden md:block absolute top-10 left-12 right-12 h-0.5 bg-[var(--pitch-3)] -z-10"></div>
                
                {[
                  ["Discover your sport", "Filter by sport and area, then browse real-time openings instead of calling around."],
                  ["Compare & choose", "Compare venues by distance, price, and surface, and select your exact time slot."],
                  ["Lock it in instantly", "Get an instant confirmation with your unique booking code — just show it at the venue."],
                ].map(([title, body], i) => (
                  <div key={title} className="bg-[var(--pitch-2)] p-8 rounded-3xl border border-[var(--line-strong)] hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-20 h-20 bg-gradient-to-br from-[var(--amber)] to-[var(--pitch)] rounded-2xl flex items-center justify-center mp-display text-4xl shadow-lg mb-6 border border-white/10">
                      {i + 1}
                    </div>
                    <h3 className="mp-display text-2xl mb-3">{title}</h3>
                    <p className="text-[15px] leading-relaxed text-white/60">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <footer className="bg-[var(--chalk-2)] pt-16 pb-8 border-t border-[var(--line-dark)]">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--pitch)] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2.5" className="w-4 h-4"><circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4v16"/></svg>
                </div>
                <span className="mp-display text-xl text-[var(--pitch)]">MatchPoint</span>
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--ink-dim)" }}>
                A booking platform prototype designed for speed.
              </p>
              <div className="text-sm font-bold text-[var(--pitch)]">
                © {new Date().getFullYear()}
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* ================= VENUE DETAIL ================= */}
      {screen === "venue" && venueId && (
        <VenueDetailScreen
          venue={venueInfo(venueId)}
          dateIndex={dateIndex}
          setDateIndex={i => { setDateIndex(i); setSlot(null); }}
          slot={slot}
          setSlot={setSlot}
          onBack={() => go("home")}
          onContinue={() => go("confirm")}
        />
      )}

      {/* ================= CONFIRM ================= */}
      {screen === "confirm" && venueId && slot && (
        <ConfirmScreen
          venue={venueInfo(venueId)}
          date={nextDates(7)[dateIndex]}
          slot={slot}
          form={form}
          setForm={setForm}
          nameErr={nameErr}
          emailErr={emailErr}
          onBack={() => go("venue")}
          onConfirm={confirmBooking}
        />
      )}

      {/* ================= SUCCESS ================= */}
      {screen === "success" && lastBooking && (
        <SuccessScreen booking={lastBooking} email={form.email} checkDrawn={checkDrawn} onHome={() => go("home")} onBookings={openMyBookings} />
      )}

      {/* ================= MY BOOKINGS ================= */}
      {screen === "bookings" && (
        <div className="screen-anim max-w-4xl mx-auto px-6 pt-12 pb-24">
          <BackButton onClick={() => go("home")}>Back to Explore</BackButton>
          <div className="flex items-center justify-between mb-8 mt-2">
            <h2 className="mp-display text-4xl text-[var(--pitch)]">My Bookings</h2>
            <span className="bg-[var(--pitch)] text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md">
              {bookings.length} {bookings.length === 1 ? 'Session' : 'Sessions'}
            </span>
          </div>
          
          {bookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[var(--line-dark)] border-dashed">
              <div className="w-16 h-16 bg-[var(--chalk)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--ink-dim)" strokeWidth="2" className="w-8 h-8"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <h3 className="mp-display text-xl text-[var(--pitch)]">No upcoming matches</h3>
              <p style={{ color: "var(--ink-dim)" }} className="mt-2 mb-6 text-[15px]">You haven't booked any courts yet.</p>
              <button onClick={() => go("home")} className="px-6 py-3 bg-[var(--amber)] text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform">Find a Court</button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b, i) => (
                <div key={b.code} className="group bg-white rounded-2xl p-6 border border-[var(--line-dark)] shadow-sm hover:shadow-xl hover:border-[var(--amber)] transition-all duration-300 flex flex-col sm:flex-row justify-between gap-6">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner" style={{ background: SPORT_COLOR[b.sport] }}>
                      <Icon sport={b.sport} style={{ stroke: "white", width: 28, height: 28 }} />
                    </div>
                    <div>
                      <div className="mp-display text-2xl text-[var(--pitch)]">{b.venueName}</div>
                      <div className="text-[15px] mt-1 font-medium text-[var(--ink-dim)] flex flex-wrap gap-x-2 gap-y-1 items-center">
                        <span className="text-[var(--amber)] font-bold">{b.dateLabel}</span>
                        <span>•</span>
                        <span className="text-[var(--ink)]">{b.time}</span>
                        <span>•</span>
                        <span>Court {b.court}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 sm:border-l border-[var(--line-dark)] pt-4 sm:pt-0 sm:pl-6">
                    <div className="text-center sm:text-right">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink-dim)]">Booking ID</div>
                      <div className="mp-display text-lg tracking-wider text-[var(--pitch)] bg-[var(--chalk)] px-3 py-1 rounded-lg mt-1 border border-[var(--line-dark)]">{b.code}</div>
                    </div>
                    <button onClick={() => cancelBooking(i)} className="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">
                      Cancel Booking
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   SIGN-IN FORM (inside dialog)
============================================================ */
function SigninForm({ onCancel, onSubmit }) {
  const [name, setName] = useState("");
  return (
    <div className="p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--amber)] rounded-full blur-[60px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
      <div className="w-12 h-12 bg-[var(--chalk)] rounded-full flex items-center justify-center mb-6 border border-[var(--line-dark)]">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2.5" className="w-6 h-6"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>
      <h3 className="mp-display text-2xl mb-2 text-[var(--pitch)]">Welcome Back</h3>
      <p className="text-[15px] text-[var(--ink-dim)] mb-6">Enter your name to manage your bookings and speed up checkout.</p>
      
      <label className="block text-sm font-bold mb-2 text-[var(--pitch)]">Full Name</label>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onSubmit(name)}
        placeholder="e.g. Jordan Cruz"
        className="w-full px-4 py-3.5 text-[15px] font-medium rounded-xl mb-8 focus:ring-4 ring-[var(--amber)]/20 transition-shadow"
        style={{ border: "2px solid var(--line-dark-strong)", background: "white", color: "var(--ink)" }}
        autoFocus
      />
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 px-5 py-3.5 text-[15px] font-bold rounded-xl bg-white hover:bg-[var(--chalk)] transition-colors" style={{ border: "2px solid var(--line-dark)" }}>Cancel</button>
        <button onClick={() => onSubmit(name)} className="flex-1 px-5 py-3.5 text-[15px] font-bold rounded-xl hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all" style={{ background: "var(--pitch)", color: "white" }}>Sign In</button>
      </div>
    </div>
  );
}

/* ============================================================
   SPORT CHIP
============================================================ */
function SportChip({ active, onClick, label, sport }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`group flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full text-[15px] font-bold transition-all duration-300 ${active ? 'shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'hover:bg-white/10'}`}
      style={{
        border: `2px solid ${active ? "var(--amber)" : "rgba(255,255,255,0.2)"}`,
        background: active ? "var(--amber)" : "transparent",
        color: active ? "var(--amber-ink)" : "var(--chalk-2)",
      }}
    >
      {sport && (
        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${active ? 'bg-white' : 'bg-white/10 group-hover:bg-white/20'}`}>
          <Icon sport={sport} className="w-4 h-4" style={{ stroke: active ? "var(--amber)" : "var(--chalk-2)" }} />
        </div>
      )}
      {label}
    </button>
  );
}

/* ============================================================
   LIVE BOARD
============================================================ */
function LiveBoard() {
  const rows = [];
  VENUES.forEach((v, vi) => {
    [2, 6, 10].forEach(hi => rows.push({ venue: v, hour: HOURS[hi], booked: isBooked(vi, 0, hi) }));
  });
  const rowsDup = [...rows, ...rows];

  return (
    <div className="rounded-3xl overflow-hidden shadow-2xl relative border border-white/10" style={{ background: "rgba(59, 7, 100, 0.6)", backdropFilter: "blur(20px)" }}>
      {/* Decorative Glow inside board */}
      <div className="absolute top-0 right-0 w-full h-1/2 bg-[var(--amber)] opacity-[0.03] blur-2xl"></div>
      
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-black/20">
        <span className="text-[13px] font-bold tracking-widest uppercase flex items-center" style={{ color: "rgba(255,255,255,0.9)" }}>
          <span className="pulse-dot inline-block w-2.5 h-2.5 rounded-full mr-3 bg-[var(--amber)]" />
          Live Radar
        </span>
      </div>
      <div className="relative overflow-hidden board-viewport" style={{ height: 280 }}>
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{ background: "linear-gradient(to bottom, rgba(59,7,100,1) 0%, transparent 15%, transparent 85%, rgba(59,7,100,1) 100%)" }}
        />
        <div className="board-track">
          {rowsDup.map((r, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-3.5 border-b border-white/5 hover:bg-white/5 transition-colors cursor-default">
              <span className="mp-display w-14 flex-shrink-0 text-white/90" style={{ fontSize: 16 }}>{r.hour}</span>
              <span className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm" style={{ background: SPORT_COLOR[r.venue.sport] }} />
              <span className="flex-1 truncate font-medium text-white/80">{r.venue.name}</span>
              <span
                className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg flex-shrink-0 shadow-inner"
                style={r.booked
                  ? { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }
                  : { background: "rgba(139,92,246,0.15)", color: "var(--amber)", border: "1px solid rgba(139,92,246,0.3)" }}
              >
                {r.booked ? "Booked" : "Open"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   VENUE CARD
============================================================ */
function VenueCard({ v, onOpen }) {
  const color = SPORT_COLOR[v.sport];
  const sp = sportInfo(v.sport);
  return (
    <button onClick={onOpen} className="venue-card-hover group text-left rounded-3xl overflow-hidden flex flex-col bg-white border-2 border-[var(--line-dark)] relative w-full">
      <div className="relative h-36 flex items-center justify-center overflow-hidden" style={{ background: color }}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
        <span className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full text-white backdrop-blur-md bg-white/20 border border-white/30 shadow-sm z-10">
          {sp.label}
        </span>
        <div className="transform group-hover:scale-110 transition-transform duration-500 z-10 relative bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/30 shadow-lg">
          <Icon sport={v.sport} className="w-10 h-10" style={{ stroke: "white" }} />
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col gap-3">
        <div className="mp-display text-2xl text-[var(--pitch)] group-hover:text-[var(--amber)] transition-colors">{v.name}</div>
        <div className="text-[14px] font-medium flex gap-2 flex-wrap items-center text-[var(--ink-dim)]">
          <span>{v.area}</span> <span className="w-1 h-1 rounded-full bg-[var(--line-dark-strong)]"></span> 
          <span>{v.dist}</span> <span className="w-1 h-1 rounded-full bg-[var(--line-dark-strong)]"></span> 
          <span className="flex items-center text-yellow-500"><svg className="w-4 h-4 mr-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>{v.rating}</span>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--line-dark)]">
          <div className="mp-display text-2xl text-[var(--pitch)]">${v.price}<span className="ml-1 text-sm font-semibold text-[var(--ink-dim)]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>/hr</span></div>
          <span className="text-[13px] font-bold px-4 py-2 rounded-xl transition-colors bg-[var(--chalk)] text-[var(--pitch)] group-hover:bg-[var(--pitch)] group-hover:text-white">
            View Times
          </span>
        </div>
      </div>
    </button>
  );
}

/* ============================================================
   VENUE DETAIL SCREEN
============================================================ */
function VenueDetailScreen({ venue, dateIndex, setDateIndex, slot, setSlot, onBack, onContinue }) {
  const vi = VENUES.findIndex(x => x.id === venue.id);
  const sp = sportInfo(venue.sport);
  const dates = nextDates(7);

  return (
    <div className="screen-anim pb-24">
      <div className="max-w-5xl mx-auto px-6 pt-10">
        <BackButton onClick={onBack}>Back to Explore</BackButton>
        <Stepper activeIndex={0} />

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[var(--line-dark)] shadow-sm mb-10 mt-6 relative overflow-hidden">
          {/* Abstract corner decor */}
          <div className="absolute top-0 right-0 w-48 h-48 rounded-bl-[100px] opacity-10 pointer-events-none" style={{ background: SPORT_COLOR[venue.sport] }}></div>
          
          <div className="flex gap-6 items-start flex-wrap justify-between relative z-10">
            <div className="flex items-center gap-5">
              <span className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg" style={{ background: SPORT_COLOR[venue.sport] }}>
                <Icon sport={venue.sport} style={{ stroke: "white", width: 32, height: 32 }} />
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md mb-2 inline-block text-white" style={{ background: SPORT_COLOR[venue.sport] }}>{sp.label}</span>
                <h2 className="mp-display text-3xl sm:text-4xl text-[var(--pitch)] leading-tight">{venue.name}</h2>
                <p className="text-[15px] mt-2 font-medium text-[var(--ink-dim)]">{venue.area} · {venue.addr} · <span className="text-yellow-500 font-bold">★ {venue.rating}</span></p>
              </div>
            </div>
            <div className="mp-display text-4xl whitespace-nowrap text-[var(--pitch)] bg-[var(--chalk)] px-6 py-4 rounded-2xl border border-[var(--line-dark)]">
              ${venue.price}<span className="ml-1 text-[16px] font-semibold text-[var(--ink-dim)]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>/hr</span>
            </div>
          </div>
        </div>

        <h3 className="mp-display text-2xl mb-4 text-[var(--pitch)]">1. Select Date</h3>
        <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide -mx-6 px-6 sm:mx-0 sm:px-0">
          {dates.map((d, i) => {
            const active = dateIndex === i;
            return (
              <button
                key={i}
                onClick={() => setDateIndex(i)}
                className={`lift-hover flex-shrink-0 text-center rounded-2xl px-5 py-4 transition-all border-2 ${active ? 'shadow-[0_10px_20px_-5px_rgba(46,16,101,0.3)] scale-105' : 'hover:border-[var(--pitch-3)]'}`}
                style={{ 
                  borderColor: active ? "var(--pitch)" : "var(--line-dark-strong)", 
                  background: active ? "var(--pitch)" : "var(--chalk-2)", 
                  color: active ? "var(--chalk-2)" : "var(--ink)",
                  minWidth: 90
                }}
              >
                <div className="text-[12px] font-bold uppercase tracking-wider" style={{ color: active ? "rgba(255,255,255,0.7)" : "var(--ink-dim)" }}>
                  {i === 0 ? "Today" : DAY_LABELS[d.getDay()]}
                </div>
                <div className="mp-display text-3xl mt-1">{d.getDate()}</div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-6 mb-4">
          <h3 className="mp-display text-2xl text-[var(--pitch)]">2. Select Time</h3>
          <div className="flex gap-4 text-sm font-bold bg-white px-4 py-2 rounded-full border border-[var(--line-dark)] shadow-sm">
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[var(--chalk-2)] border-2 border-[var(--line-dark-strong)]" />Open</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[var(--amber)] shadow-[0_0_8px_rgba(139,92,246,0.5)]" />Selected</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[var(--chalk)] border border-[var(--line-dark)]" />Booked</span>
          </div>
        </div>

        <div className="grid gap-3 mb-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))" }}>
          {HOURS.map((h, hi) => {
            const booked = isBooked(vi, dateIndex, hi);
            const court = courtFor(hi, venue.courts);
            const selected = slot && slot.hourIndex === hi;
            return (
              <button
                key={h}
                disabled={booked}
                onClick={() => setSlot({ hourIndex: hi, hour: h, court })}
                className={`text-center rounded-2xl px-2 py-4 transition-all border-2 ${booked ? "opacity-40 cursor-not-allowed bg-[var(--chalk)] border-[var(--line-dark)]" : "lift-hover hover:border-[var(--amber)] bg-white border-[var(--line-dark-strong)]"} ${selected ? "pop-anim shadow-[0_5px_15px_rgba(139,92,246,0.3)]" : ""}`}
                style={selected ? { borderColor: "var(--amber)", background: "var(--amber)" } : {}}
              >
                <div className={`mp-display text-xl ${selected ? 'text-white' : (booked ? 'text-[var(--ink-dim)] line-through decoration-2' : 'text-[var(--pitch)]')}`}>{h}</div>
                <div className={`mt-1 font-bold text-[11px] uppercase tracking-wider ${selected ? 'text-white/90' : 'text-[var(--ink-dim)]'}`}>
                  {booked ? "Booked" : `Court ${court}`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-4 pointer-events-none">
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-xl border border-[var(--line-dark-strong)] rounded-2xl p-4 flex justify-between items-center gap-4 shadow-[0_-10px_40px_rgba(46,16,101,0.15)] pointer-events-auto transform transition-transform duration-300 translate-y-0">
          <div className="flex-1 px-2">
            {slot ? (
              <div className="animate-fade-in">
                <span className="block text-[12px] font-bold text-[var(--ink-dim)] uppercase tracking-wider mb-0.5">Selected Session</span>
                <span className="text-[16px] text-[var(--pitch)] font-medium">
                  <b className="mp-display text-xl text-[var(--amber)] mr-2">{slot.hour}</b> 
                  on {fmtFullDate(dates[dateIndex])} <span className="mx-2 text-[var(--line-dark-strong)]">|</span> <span className="font-bold">Court {slot.court}</span>
                </span>
              </div>
            ) : (
              <span className="text-[15px] font-semibold text-[var(--ink-dim)] flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[var(--chalk)] flex items-center justify-center animate-pulse">👆</span>
                Select a time slot above to continue
              </span>
            )}
          </div>
          <button
            disabled={!slot}
            onClick={onContinue}
            className="px-8 py-4 text-[16px] font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center gap-2 group hover:scale-105 active:scale-95"
            style={slot ? { background: "var(--pitch)", color: "var(--chalk-2)", boxShadow: "0 10px 20px -5px rgba(46,16,101,0.4)" } : { background: "var(--chalk)", color: "var(--ink-dim)", boxShadow: "none" }}
          >
            Review Booking
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TICKET (shared by confirm + success)
============================================================ */
function Ticket({ sportKey, venueName, addr, area, date, time, court }) {
  const sp = sportInfo(sportKey);
  return (
    <div className="rounded-3xl relative overflow-hidden shadow-2xl" style={{ background: "linear-gradient(135deg, var(--pitch) 0%, var(--pitch-3) 100%)", color: "var(--chalk-2)" }}>
      {/* Ticket pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "16px 16px" }}></div>
      
      <div className="p-8 relative z-10">
        <div className="flex items-center gap-3 text-[13px] font-bold uppercase tracking-wider mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>
          <span className="w-8 h-8 rounded-lg flex items-center justify-center shadow-inner" style={{ background: SPORT_COLOR[sportKey] }}>
            <Icon sport={sportKey} style={{ stroke: "white", width: 18, height: 18 }} />
          </span>
          {sp.label}
        </div>
        <div className="mp-display text-4xl mb-2">{venueName}</div>
        <div className="text-[15px] font-medium flex items-center gap-2" style={{ color: "rgba(255,255,255,0.6)" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {addr}, {area}
        </div>
      </div>
      
      {/* Perforated divider */}
      <div className="relative h-0 mx-4 z-10" style={{ borderTop: "2px dashed rgba(255,255,255,0.2)" }}>
        <span className="absolute rounded-full shadow-inner" style={{ top: -16, left: -32, width: 32, height: 32, background: "var(--chalk)" }} />
        <span className="absolute rounded-full shadow-inner" style={{ top: -16, right: -32, width: 32, height: 32, background: "var(--chalk)" }} />
      </div>
      
      <div className="grid grid-cols-2 gap-x-6 gap-y-6 p-8 relative z-10 bg-black/10">
        <div><div className="uppercase tracking-widest font-bold mb-1" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Date</div><div className="mp-display" style={{ fontSize: 20 }}>{date}</div></div>
        <div><div className="uppercase tracking-widest font-bold mb-1" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Time</div><div className="mp-display text-[var(--amber)]" style={{ fontSize: 20 }}>{time}</div></div>
        {court !== undefined && (
          <>
            <div><div className="uppercase tracking-widest font-bold mb-1" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Court</div><div className="mp-display" style={{ fontSize: 20 }}>Court {court}</div></div>
            <div><div className="uppercase tracking-widest font-bold mb-1" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Duration</div><div className="mp-display" style={{ fontSize: 20 }}>1 hour</div></div>
          </>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   CONFIRM SCREEN
============================================================ */
function ConfirmScreen({ venue, date, slot, form, setForm, nameErr, emailErr, onBack, onConfirm }) {
  const service = Math.round(venue.price * 0.1 * 100) / 100;
  return (
    <div className="screen-anim max-w-6xl mx-auto px-6 pt-10 pb-20">
      <BackButton onClick={onBack}>Back to Selection</BackButton>
      <Stepper activeIndex={1} />

      <div className="grid-confirm mt-8">
        <div className="order-2 md:order-1">
          <Ticket sportKey={venue.sport} venueName={venue.name} addr={venue.addr} area={venue.area} date={fmtFullDate(date)} time={slot.hour} court={slot.court} />
        </div>

        <div className="order-1 md:order-2 bg-white p-8 rounded-3xl border border-[var(--line-dark)] shadow-xl shadow-[var(--line-dark)]">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[var(--line-dark)]">
            <div className="w-12 h-12 bg-[var(--chalk)] rounded-full flex items-center justify-center border border-[var(--line-dark-strong)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--pitch)" strokeWidth="2" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <h3 className="mp-display text-2xl text-[var(--pitch)]">Player Details</h3>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[13px] font-bold uppercase tracking-wider mb-2 text-[var(--pitch)]">Full Name <span className="text-red-500">*</span></label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Jordan Cruz"
                className="w-full px-4 py-3.5 text-[15px] font-medium rounded-xl transition-shadow focus:ring-4 ring-[var(--amber)]/20 outline-none"
                style={{ border: `2px solid ${nameErr ? "#EF4444" : "var(--line-dark-strong)"}`, background: "var(--chalk)", color: "var(--ink)" }}
              />
              {nameErr && <div className="text-[13px] font-bold mt-2 flex items-center gap-1" style={{ color: "#EF4444" }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>Name is required.</div>}
            </div>

            <div>
              <label className="block text-[13px] font-bold uppercase tracking-wider mb-2 text-[var(--pitch)]">Email Address <span className="text-red-500">*</span></label>
              <input
                value={form.email}
                type="email"
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="jordan@example.com"
                className="w-full px-4 py-3.5 text-[15px] font-medium rounded-xl transition-shadow focus:ring-4 ring-[var(--amber)]/20 outline-none"
                style={{ border: `2px solid ${emailErr ? "#EF4444" : "var(--line-dark-strong)"}`, background: "var(--chalk)", color: "var(--ink)" }}
              />
              {emailErr && <div className="text-[13px] font-bold mt-2 flex items-center gap-1" style={{ color: "#EF4444" }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>Valid email required.</div>}
            </div>

            <div>
              <label className="block text-[13px] font-bold uppercase tracking-wider mb-2 text-[var(--pitch)]">Phone Number <span className="text-[var(--ink-dim)] normal-case font-medium tracking-normal">(Optional)</span></label>
              <input
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+63 900 000 0000"
                className="w-full px-4 py-3.5 text-[15px] font-medium rounded-xl transition-shadow focus:ring-4 ring-[var(--amber)]/20 outline-none"
                style={{ border: "2px solid var(--line-dark-strong)", background: "var(--chalk)", color: "var(--ink)" }}
              />
            </div>
          </div>

          <div className="rounded-2xl p-6 mt-8 border-2 border-[var(--line-dark)] bg-[var(--chalk)]">
            <div className="flex justify-between text-[15px] font-medium py-1.5 text-[var(--ink-dim)]"><span>Court fee (1 hr)</span><span>${venue.price.toFixed(2)}</span></div>
            <div className="flex justify-between text-[15px] font-medium py-1.5 text-[var(--ink-dim)]"><span>Service fee</span><span>${service.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold pt-4 mt-3 border-t-2 border-[var(--line-dark)] text-[var(--pitch)] mp-display text-2xl">
              <span>Total Pay</span>
              <span className="text-[var(--amber)]">${(venue.price + service).toFixed(2)}</span>
            </div>
          </div>

          <button onClick={onConfirm} className="w-full mt-6 px-6 py-4 text-[16px] font-bold rounded-xl hover:scale-105 active:scale-95 shadow-[0_10px_20px_-5px_rgba(46,16,101,0.4)] transition-all flex justify-center items-center gap-2" style={{ background: "var(--pitch)", color: "var(--chalk-2)" }}>
            Confirm & Pay
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SUCCESS SCREEN
============================================================ */
function SuccessScreen({ booking, email, checkDrawn, onHome, onBookings }) {
  return (
    <div className="screen-anim mx-auto px-6 pt-12 pb-24 text-center relative" style={{ maxWidth: 540 }}>
      {/* Confetti-like abstract shapes could go here in a full app */}
      <Stepper activeIndex={2} center />
      
      <div className="relative w-24 h-24 mx-auto mb-6">
        <div className="absolute inset-0 bg-[var(--amber)] rounded-full blur-[20px] opacity-30 animate-pulse"></div>
        <div className="relative w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-[var(--amber)] to-[var(--pitch)] shadow-2xl border-4 border-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
            <path
              d="M5 13l4 4L19 7"
              style={{
                strokeDasharray: 24,
                strokeDashoffset: checkDrawn ? 0 : 24,
                transition: "stroke-dashoffset 0.6s cubic-bezier(0.65, 0, 0.45, 1) 0.2s",
              }}
            />
          </svg>
        </div>
      </div>
      
      <h2 className="mp-display text-4xl text-[var(--pitch)]">You're All Set!</h2>
      <p className="mt-4 text-[16px] leading-relaxed" style={{ color: "var(--ink-dim)" }}>
        Your court is secured. <br className="hidden sm:block"/>
        {email ? `We've sent the complete details and receipt to ` : "Your confirmation has been sent to your email."}
        {email && <b className="text-[var(--pitch)]">{email}</b>}
      </p>

      <div className="mt-10 text-left relative transform hover:scale-[1.02] transition-transform duration-300">
        <Ticket sportKey={booking.sport} venueName={booking.venueName} addr={booking.addr} area={booking.area} date={booking.dateLabel} time={booking.time} />
        
        {/* Code Box attached to ticket */}
        <div className="rounded-b-3xl px-8 pb-8 pt-2 -mt-2 bg-gradient-to-b from-[var(--pitch-3)] to-[var(--pitch)] border-t border-white/10 relative z-0">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="uppercase tracking-widest font-bold text-[11px] mb-2 text-white/50">Show this code at reception</div>
            <div className="mp-display text-4xl tracking-widest text-[var(--amber)] bg-black/30 px-6 py-3 rounded-2xl border border-white/10 shadow-inner">
              {booking.code}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
        <button onClick={onBookings} className="px-8 py-4 text-[16px] font-bold rounded-xl shadow-[0_10px_20px_-5px_rgba(46,16,101,0.3)] hover:scale-105 transition-transform order-1 sm:order-2" style={{ background: "var(--pitch)", color: "var(--chalk-2)" }}>
          View My Bookings
        </button>
        <button onClick={onHome} className="px-8 py-4 text-[16px] font-bold rounded-xl bg-white hover:bg-[var(--chalk)] transition-colors order-2 sm:order-1" style={{ border: "2px solid var(--line-dark)" }}>
          Book Another
        </button>
      </div>
    </div>
  );
}