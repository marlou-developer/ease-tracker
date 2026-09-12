import { CATEGORY_COLORS, SUBSCRIPTION_PLANS, HOURS, DAY_LABELS, VENUES, nextDates, fmtFullDate, isBooked } from "../_constants/mockData";


export function VenueScreen({ activeVenue, selectedPlanId, setSelectedPlanId, dateIndex, setDateIndex, cart, onToggleCartItem, onGo }) {
    return (
        <div className="screen-anim max-w-5xl mx-auto px-6 py-10 flex-1 w-full">
            <button onClick={() => onGo("category-view")} className="text-sm font-bold text-[var(--ink-dim)] mb-6 hover:text-[var(--pitch)]">
                ← Back to Listing
            </button>

            <div className="bg-white rounded-3xl border border-[var(--line-dark-strong)] p-8 mb-8 shadow-sm flex flex-col sm:flex-row justify-between gap-6">
                <div>
                    <span className="text-xs font-bold uppercase px-2.5 py-1 rounded text-white" style={{ background: CATEGORY_COLORS[activeVenue.category] || "var(--amber)" }}>
                        {activeVenue.category}
                    </span>
                    <h1 className="mp-display text-3xl text-[var(--pitch)] mt-2">{activeVenue.name}</h1>
                    <p className="text-sm text-[var(--ink-dim)]">{activeVenue.area} • {activeVenue.addr}</p>
                </div>

                <div className="bg-[var(--chalk)] p-4 rounded-2xl border border-[var(--line-dark)] min-w-[260px]">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--pitch)] mb-2">
                        Subscription Tier Per Booking
                    </label>
                    <select
                        value={selectedPlanId}
                        onChange={e => setSelectedPlanId(e.target.value)}
                        className="w-full text-xs font-bold p-2.5 rounded-xl border border-[var(--line-dark-strong)] bg-white outline-none"
                    >
                        {SUBSCRIPTION_PLANS.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.name} ({p.badge})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <h3 className="mp-display text-xl text-[var(--pitch)] mb-3">1. Select Date</h3>
            <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
                {nextDates(7).map((d, i) => (
                    <button
                        key={i}
                        onClick={() => setDateIndex(i)}
                        className={`lift-hover flex-shrink-0 px-5 py-3 rounded-2xl border text-center transition-all ${dateIndex === i ? "bg-[var(--pitch)] text-white border-[var(--pitch)]" : "bg-white text-[var(--ink)] border-[var(--line-dark-strong)]"}`}
                    >
                        <div className="text-[10px] font-bold uppercase opacity-70">{i === 0 ? "Today" : DAY_LABELS[d.getDay()]}</div>
                        <div className="mp-display text-xl">{d.getDate()}</div>
                    </button>
                ))}
            </div>

            <h3 className="mp-display text-xl text-[var(--pitch)] mb-3">2. Choose Time & Add to Cart</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
                {HOURS.map((h, hi) => {
                    const booked = isBooked(VENUES.findIndex(v => v.id === activeVenue.id), dateIndex, hi);
                    const dateLabel = fmtFullDate(nextDates(7)[dateIndex]);
                    const itemKey = `${activeVenue.id}-${dateLabel}-${h}`;
                    const inCart = cart.some(c => c.key === itemKey);

                    return (
                        <button
                            key={h}
                            disabled={booked}
                            onClick={() => onToggleCartItem(activeVenue, dateLabel, h)}
                            className={`p-4 rounded-2xl border text-center transition-all ${booked ? "opacity-30 bg-gray-100 cursor-not-allowed" : inCart ? "bg-[var(--amber)] text-white border-[var(--amber)] shadow-md" : "bg-white hover:border-[var(--amber)]"}`}
                        >
                            <div className="mp-display text-lg">{h}</div>
                            <div className="text-[11px] font-bold uppercase mt-1">
                                {booked ? "Unavailable" : inCart ? "In Cart ✓" : "Available"}
                            </div>
                        </button>
                    );
                })}
            </div>

            {cart.length > 0 && (
                <div className="sticky bottom-6 bg-[var(--pitch)] text-white p-4 rounded-2xl flex items-center justify-between shadow-2xl">
                    <div>
                        <span className="font-bold text-sm block">{cart.length} Reservation(s) in Cart</span>
                        <span className="text-xs text-white/70">Selected tier: {SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId)?.name}</span>
                    </div>
                    <button onClick={() => onGo("cart")} className="px-6 py-2.5 bg-[var(--amber)] text-white font-bold text-sm rounded-xl shadow">
                        View Cart & Checkout →
                    </button>
                </div>
            )}
        </div>
    );
}