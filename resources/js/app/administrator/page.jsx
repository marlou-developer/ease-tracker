import React, { useState } from "react";

/* ============================================================
   DESIGN TOKENS & STYLES (PURPLE THEME)
============================================================ */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    :root{
      --pitch: #2E1065; 
      --pitch-2: #3B0764; 
      --pitch-3: #4C1D95;
      --chalk: #FAF5FF; 
      --chalk-2: #FFFFFF;
      --ink: #1E1B4B; 
      --ink-dim: #6B7280;
      --amber: #8B5CF6; 
      --amber-ink: #FFFFFF;
      --line-dark: rgba(46, 16, 101, 0.10); 
      --line-dark-strong: rgba(46, 16, 101, 0.25);
    }
    
    .mp-root{ font-family:'Plus Jakarta Sans', sans-serif; background:var(--chalk); color:var(--ink); }
    .mp-display{ font-family:'Outfit', sans-serif; font-weight:700; letter-spacing:-0.02em; }
    
    @keyframes screenIn{ 
      from{opacity:0; transform:translateY(12px) scale(0.99);} 
      to{opacity:1; transform:translateY(0) scale(1);} 
    }
    .screen-anim{ animation:screenIn .35s cubic-bezier(0.16, 1, 0.3, 1) both; }
  `}</style>
);

/* ============================================================
   INITIAL MOCK DATA
============================================================ */
const INITIAL_CATEGORIES = [
  { id: 1, name: "Sports Courts", key: "sports", icon: "⚽", count: 8 },
  { id: 2, name: "Hotels & Suites", key: "hotel", icon: "🏨", count: 5 },
  { id: 3, name: "Co-Working Hubs", key: "workspace", icon: "💼", count: 3 },
  { id: 4, name: "Studios & Halls", key: "studio", icon: "📸", count: 2 },
];

const INITIAL_VENUES = [
  { id: 1, name: "Riverside Tennis Club", categoryId: 1, area: "Riverside Park", basePrice: 25, feePercent: 10, unit: "court" },
  { id: 2, name: "Grand Vista Resort", categoryId: 2, area: "Downtown", basePrice: 180, feePercent: 10, unit: "suite" },
  { id: 3, name: "Nexus Co-Working", categoryId: 3, area: "Tech District", basePrice: 15, feePercent: 10, unit: "desk" },
];

const INITIAL_ORDERS = [
  { id: "ORD-X9A7B", guest: "Jordan Cruz", email: "jordan@example.com", total: 85.00, fee: 8.50, discount: 12.75, status: "paid", date: "2026-09-12" },
  { id: "ORD-B4M9P", guest: "Alex Morgan", email: "alex@example.com", total: 180.00, fee: 18.00, discount: 0.00, status: "paid", date: "2026-09-11" },
  { id: "ORD-K2L8R", guest: "Taylor Swift", email: "taylor@example.com", total: 45.00, fee: 4.50, discount: 6.75, status: "pending", date: "2026-09-10" },
];

const INITIAL_RESERVATIONS = [
  { id: 1, venue: "Riverside Tennis Club", category: "Sports", date: "2026-09-15", time: "10:00 AM", passCode: "PASS-X91A2F", status: "confirmed", price: 21.25 },
  { id: 2, venue: "Grand Vista Resort", category: "Hotel", date: "2026-09-20", time: "02:00 PM", passCode: "PASS-B82C9L", status: "confirmed", price: 153.00 },
  { id: 3, venue: "Nexus Co-Working", category: "Workspace", date: "2026-09-05", time: "08:00 AM", passCode: "PASS-M41K8P", status: "completed", price: 12.75 },
];

/* ============================================================
   MAIN CONTAINER WITH PORTAL SWITCHER
============================================================ */
export default function PortalsContainer() {
  const [activePortal, setActivePortal] = useState("admin"); // 'admin' | 'subscriber' | 'booker'

  // Shared application state
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [venues, setVenues] = useState(INITIAL_VENUES);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);

  return (
    <div className="mp-root min-h-screen pb-16">
      <GlobalStyle />

      {/* PORTAL SWITCHER HEADER */}
      <header className="bg-[var(--pitch)] text-white border-b border-white/10 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--amber)] flex items-center justify-center font-bold text-white text-xl shadow">
              OR
            </div>
            <div>
              <span className="mp-display text-xl tracking-tight">OmniReserve</span>
              <span className="block text-[10px] font-bold text-[var(--amber)] uppercase tracking-widest -mt-1">
                Portal Management Engine
              </span>
            </div>
          </div>

          {/* ROLE / PORTAL TOGGLE BUTTONS */}
          <div className="bg-black/30 p-1.5 rounded-2xl border border-white/10 flex items-center gap-1">
            <button
              onClick={() => setActivePortal("admin")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePortal === "admin"
                  ? "bg-[var(--amber)] text-white shadow-md"
                  : "text-white/70 hover:text-white"
              }`}
            >
              🛡️ Admin Portal
            </button>
            <button
              onClick={() => setActivePortal("subscriber")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePortal === "subscriber"
                  ? "bg-[var(--amber)] text-white shadow-md"
                  : "text-white/70 hover:text-white"
              }`}
            >
              ⭐ Subscriber Portal
            </button>
            <button
              onClick={() => setActivePortal("booker")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePortal === "booker"
                  ? "bg-[var(--amber)] text-white shadow-md"
                  : "text-white/70 hover:text-white"
              }`}
            >
              🎟️ Booker Portal
            </button>
          </div>
        </div>
      </header>

      {/* RENDER ACTIVE PORTAL */}
      <main className="max-w-7xl mx-auto px-6 pt-8">
        {activePortal === "admin" && (
          <AdminPortal
            categories={categories}
            setCategories={setCategories}
            venues={venues}
            setVenues={setVenues}
            orders={orders}
            setOrders={setOrders}
          />
        )}
        {activePortal === "subscriber" && <SubscriberPortal />}
        {activePortal === "booker" && (
          <BookerPortal
            reservations={reservations}
            setReservations={setReservations}
          />
        )}
      </main>
    </div>
  );
}

/* ============================================================
   1. ADMIN PORTAL (FULL CRUD & AUDIT)
============================================================ */
function AdminPortal({ categories, setCategories, venues, setVenues, orders, setOrders }) {
  const [tab, setActiveTab] = useState("overview");

  // Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", key: "", icon: "⚽" });
  const [newVenue, setNewVenue] = useState({ name: "", categoryId: 1, area: "", basePrice: 20, feePercent: 10, unit: "court" });

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCat.name) return;
    setCategories([...categories, { ...newCat, id: Date.now(), count: 0 }]);
    setNewCat({ name: "", key: "", icon: "⚽" });
    setShowCategoryModal(false);
  };

  const handleAddVenue = (e) => {
    e.preventDefault();
    if (!newVenue.name) return;
    setVenues([...venues, { ...newVenue, id: Date.now(), categoryId: Number(newVenue.categoryId) }]);
    setNewVenue({ name: "", categoryId: 1, area: "", basePrice: 20, feePercent: 10, unit: "court" });
    setShowVenueModal(false);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalFees = orders.reduce((sum, o) => sum + o.fee, 0);

  return (
    <div className="screen-anim space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--amber)]">Control Center</span>
          <h1 className="mp-display text-3xl text-[var(--pitch)]">Platform Administrator</h1>
        </div>
        <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-[var(--line-dark-strong)] shadow-sm">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${tab === "overview" ? "bg-[var(--pitch)] text-white" : "text-[var(--ink-dim)]"}`}
          >
            Overview & Metrics
          </button>
          <button
            onClick={() => setActiveTab("management")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${tab === "management" ? "bg-[var(--pitch)] text-white" : "text-[var(--ink-dim)]"}`}
          >
            Venues & Categories
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${tab === "orders" ? "bg-[var(--pitch)] text-white" : "text-[var(--ink-dim)]"}`}
          >
            Orders & Revenue
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[var(--line-dark-strong)] shadow-sm">
              <span className="text-xs font-bold text-[var(--ink-dim)] uppercase block">Gross Volume</span>
              <span className="mp-display text-2xl text-[var(--pitch)] mt-1 block">${totalRevenue.toFixed(2)}</span>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-[var(--line-dark-strong)] shadow-sm">
              <span className="text-xs font-bold text-[var(--amber)] uppercase block">Platform Fees (10%)</span>
              <span className="mp-display text-2xl text-[var(--pitch)] mt-1 block">${totalFees.toFixed(2)}</span>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-[var(--line-dark-strong)] shadow-sm">
              <span className="text-xs font-bold text-[var(--ink-dim)] uppercase block">Active Venues</span>
              <span className="mp-display text-2xl text-[var(--pitch)] mt-1 block">{venues.length}</span>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-[var(--line-dark-strong)] shadow-sm">
              <span className="text-xs font-bold text-[var(--ink-dim)] uppercase block">Total Orders</span>
              <span className="mp-display text-2xl text-[var(--pitch)] mt-1 block">{orders.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* MANAGEMENT TAB (CRUD) */}
      {tab === "management" && (
        <div className="space-y-8">
          {/* CATEGORIES SECTION */}
          <div className="bg-white rounded-3xl p-6 border border-[var(--line-dark-strong)] shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="mp-display text-xl text-[var(--pitch)]">Categories</h3>
              <button
                onClick={() => setShowCategoryModal(true)}
                className="px-4 py-2 bg-[var(--amber)] text-white font-bold text-xs rounded-xl shadow"
              >
                + Add Category
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 rounded-2xl bg-[var(--chalk)] border border-[var(--line-dark)] flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm text-[var(--pitch)]">{cat.name}</h4>
                      <span className="text-xs text-[var(--ink-dim)]">{cat.key}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setCategories(categories.filter(c => c.id !== cat.id))}
                    className="text-xs text-red-500 font-bold hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* VENUES SECTION */}
          <div className="bg-white rounded-3xl p-6 border border-[var(--line-dark-strong)] shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="mp-display text-xl text-[var(--pitch)]">Venues & Spaces</h3>
              <button
                onClick={() => setShowVenueModal(true)}
                className="px-4 py-2 bg-[var(--amber)] text-white font-bold text-xs rounded-xl shadow"
              >
                + Add Venue
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--line-dark)] text-xs font-bold uppercase text-[var(--ink-dim)]">
                    <th className="py-3 px-4">Venue Name</th>
                    <th className="py-3 px-4">Area</th>
                    <th className="py-3 px-4">Base Rate</th>
                    <th className="py-3 px-4">Fee %</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line-dark)]">
                  {venues.map((v) => (
                    <tr key={v.id}>
                      <td className="py-3 px-4 font-bold text-[var(--pitch)]">{v.name}</td>
                      <td className="py-3 px-4 text-[var(--ink-dim)]">{v.area}</td>
                      <td className="py-3 px-4 font-semibold">${v.basePrice}/{v.unit}</td>
                      <td className="py-3 px-4 text-[var(--amber)] font-bold">{v.feePercent}%</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setVenues(venues.filter(x => x.id !== v.id))}
                          className="text-xs font-bold text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {tab === "orders" && (
        <div className="bg-white rounded-3xl p-6 border border-[var(--line-dark-strong)] shadow-sm overflow-x-auto">
          <h3 className="mp-display text-xl text-[var(--pitch)] mb-4">Order Audit Ledger</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--line-dark)] text-xs font-bold uppercase text-[var(--ink-dim)]">
                <th className="py-3 px-4">Order Code</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Platform Fee</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Toggle Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line-dark)] text-sm">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-[var(--chalk)]">
                  <td className="py-3 px-4 font-bold text-[var(--pitch)]">{order.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold">{order.guest}</div>
                    <div className="text-xs text-[var(--ink-dim)]">{order.email}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold">${order.total.toFixed(2)}</td>
                  <td className="py-3 px-4 text-green-600 font-semibold">${order.fee.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase ${order.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, order.status === "paid" ? "pending" : "paid")}
                      className="text-xs text-[var(--amber)] font-bold hover:underline"
                    >
                      Set to {order.status === "paid" ? "Pending" : "Paid"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddCategory} className="bg-white p-6 rounded-3xl max-w-sm w-full space-y-4">
            <h3 className="mp-display text-xl text-[var(--pitch)]">Add Category</h3>
            <input
              type="text"
              placeholder="Category Name"
              value={newCat.name}
              onChange={e => setNewCat({ ...newCat, name: e.target.value, key: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              className="w-full p-3 border rounded-xl text-sm outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowCategoryModal(false)} className="px-4 py-2 text-xs font-bold">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-[var(--amber)] text-white font-bold text-xs rounded-xl">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* VENUE MODAL */}
      {showVenueModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddVenue} className="bg-white p-6 rounded-3xl max-w-md w-full space-y-4">
            <h3 className="mp-display text-xl text-[var(--pitch)]">Add Venue</h3>
            <input
              type="text"
              placeholder="Venue Name"
              value={newVenue.name}
              onChange={e => setNewVenue({ ...newVenue, name: e.target.value })}
              className="w-full p-3 border rounded-xl text-sm outline-none"
            />
            <input
              type="text"
              placeholder="Area / Location"
              value={newVenue.area}
              onChange={e => setNewVenue({ ...newVenue, area: e.target.value })}
              className="w-full p-3 border rounded-xl text-sm outline-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Base Price ($)"
                value={newVenue.basePrice}
                onChange={e => setNewVenue({ ...newVenue, basePrice: Number(e.target.value) })}
                className="p-3 border rounded-xl text-sm outline-none"
              />
              <input
                type="number"
                placeholder="Fee Percentage (%)"
                value={newVenue.feePercent}
                onChange={e => setNewVenue({ ...newVenue, feePercent: Number(e.target.value) })}
                className="p-3 border rounded-xl text-sm outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowVenueModal(false)} className="px-4 py-2 text-xs font-bold">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-[var(--amber)] text-white font-bold text-xs rounded-xl">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   2. SUBSCRIBER PORTAL (UPGRADES & PERKS)
============================================================ */
function SubscriberPortal() {
  const [tier, setTier] = useState("monthly_pass"); // 'single' | 'monthly_pass' | 'vip'
  const [autoRenew, setAutoRenew] = useState(true);

  return (
    <div className="screen-anim space-y-8 max-w-4xl mx-auto">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--amber)]">VIP Member Dashboard</span>
        <h1 className="mp-display text-3xl text-[var(--pitch)]">Subscription Settings</h1>
      </div>

      {/* PLAN CARD */}
      <div className="bg-gradient-to-br from-[var(--pitch)] to-[var(--pitch-3)] text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6 mb-6">
          <div>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[var(--amber)] text-white uppercase tracking-wider inline-block mb-2">
              {tier === "vip" ? "30% OFF • VIP" : tier === "monthly_pass" ? "15% OFF" : "Standard"}
            </span>
            <h2 className="mp-display text-3xl">
              {tier === "vip" ? "VIP Elite Membership" : tier === "monthly_pass" ? "Flex Pass Subscription" : "Pay-As-You-Go"}
            </h2>
            <p className="text-xs text-white/70 mt-1">Status: Active ✓</p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-white/60 block uppercase font-bold">Billing Rate</span>
            <span className="mp-display text-2xl text-[var(--amber)]">
              {tier === "vip" ? "$49.00/mo" : tier === "monthly_pass" ? "$29.00/mo" : "$0.00/mo"}
            </span>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="autoRenew"
              checked={autoRenew}
              onChange={() => setAutoRenew(!autoRenew)}
              className="w-4 h-4 accent-[var(--amber)] cursor-pointer"
            />
            <label htmlFor="autoRenew" className="text-xs font-bold text-white/90 cursor-pointer">
              Auto-renew subscription on next billing cycle
            </label>
          </div>

          {/* TIER UPGRADE BUTTONS */}
          <div className="flex gap-2">
            <button
              onClick={() => setTier("monthly_pass")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${tier === "monthly_pass" ? "bg-white text-[var(--pitch)]" : "bg-white/10 text-white"}`}
            >
              Flex Pass
            </button>
            <button
              onClick={() => setTier("vip")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${tier === "vip" ? "bg-white text-[var(--pitch)]" : "bg-white/10 text-white"}`}
            >
              VIP Tier
            </button>
          </div>
        </div>
      </div>

      {/* BILLING HISTORY */}
      <div className="bg-white rounded-3xl p-6 border border-[var(--line-dark-strong)] shadow-sm">
        <h3 className="mp-display text-xl text-[var(--pitch)] mb-4">Subscription Invoices</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-[var(--line-dark)]">
            <div>
              <div className="font-bold text-[var(--pitch)]">September 2026 Renewal</div>
              <div className="text-xs text-[var(--ink-dim)]">Paid via Visa ending in 4242</div>
            </div>
            <span className="font-bold">$29.00</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <div>
              <div className="font-bold text-[var(--pitch)]">August 2026 Renewal</div>
              <div className="text-xs text-[var(--ink-dim)]">Paid via Visa ending in 4242</div>
            </div>
            <span className="font-bold">$29.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   3. BOOKER PORTAL (QR PASS CODES & RECEIPT PRINT)
============================================================ */
function BookerPortal({ reservations, setReservations }) {
  const [activePass, setActivePass] = useState(null);

  const handleCancel = (id) => {
    setReservations(reservations.map(r => r.id === id ? { ...r, status: "cancelled" } : r));
  };

  return (
    <div className="screen-anim space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--amber)]">Customer Account</span>
          <h1 className="mp-display text-3xl text-[var(--pitch)]">My Reservation Passes</h1>
        </div>
        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-[var(--line-dark-strong)] text-[var(--pitch)]">
          {reservations.filter(r => r.status === "confirmed").length} Active Passes
        </span>
      </div>

      {/* RESERVATION LIST */}
      <div className="space-y-4">
        {reservations.map((res) => (
          <div key={res.id} className="bg-white rounded-3xl border border-[var(--line-dark-strong)] p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-sm">
            <div>
              <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded bg-[var(--chalk)] text-[var(--pitch)] border border-[var(--line-dark)]">
                {res.category}
              </span>
              <h3 className="mp-display text-xl text-[var(--pitch)] mt-2">{res.venue}</h3>
              <div className="text-xs text-[var(--ink-dim)] mt-1">
                📅 <b className="text-[var(--ink)]">{res.date}</b> at <b className="text-[var(--ink)]">{res.time}</b> • Paid: <b className="text-green-600">${res.price.toFixed(2)}</b>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-[var(--line-dark)]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePass(res)}
                  className="text-xs font-bold bg-[var(--pitch)] text-white px-3 py-1.5 rounded-xl shadow"
                >
                  View Pass / QR
                </button>
                <span className="mp-display text-sm text-[var(--amber)] bg-[var(--chalk)] px-3 py-1 rounded-xl border border-[var(--line-dark)] font-mono">
                  {res.passCode}
                </span>
              </div>

              {res.status === "confirmed" ? (
                <button
                  onClick={() => handleCancel(res.id)}
                  className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 font-bold text-xs rounded-xl hover:bg-red-100"
                >
                  Cancel Booking
                </button>
              ) : (
                <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${res.status === "completed" ? "bg-gray-100 text-gray-600" : "bg-red-100 text-red-600"}`}>
                  {res.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* PASS / QR MODAL */}
      {activePass && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl relative">
            <button
              onClick={() => setActivePass(null)}
              className="absolute top-4 right-4 text-xs font-bold text-gray-400 hover:text-black"
            >
              ✕ Close
            </button>
            <div>
              <span className="text-xs font-bold text-[var(--amber)] uppercase tracking-wider block">Entry Pass</span>
              <h3 className="mp-display text-2xl text-[var(--pitch)] mt-1">{activePass.venue}</h3>
            </div>

            {/* GENERATED SVG QR CODE MOCK */}
            <div className="w-44 h-44 mx-auto bg-gray-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-[var(--amber)] p-4">
              <div className="grid grid-cols-4 gap-2 w-full h-full opacity-80">
                <div className="bg-black rounded"></div><div className="bg-black rounded"></div><div className="bg-transparent"></div><div className="bg-black rounded"></div>
                <div className="bg-transparent"></div><div className="bg-black rounded"></div><div className="bg-black rounded"></div><div className="bg-transparent"></div>
                <div className="bg-black rounded"></div><div className="bg-transparent"></div><div className="bg-black rounded"></div><div className="bg-black rounded"></div>
                <div className="bg-black rounded"></div><div className="bg-black rounded"></div><div className="bg-transparent"></div><div className="bg-black rounded"></div>
              </div>
            </div>

            <div>
              <span className="text-xs text-[var(--ink-dim)] block">Show code at reception</span>
              <span className="mp-display text-xl text-[var(--pitch)] font-mono">{activePass.passCode}</span>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-3 bg-[var(--pitch)] text-white text-xs font-bold rounded-xl"
            >
              🖨️ Print Pass Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}