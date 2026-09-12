import { CATEGORY_COLORS, SUBSCRIPTION_PLANS, DAY_LABELS, nextDates, fmtFullDate } from "../_constants/mockData";

/**
 * Parses time strings like "08:00:00", "08:00", or "8" into an integer hour (0-23)
 */
const parseStartEndHour = (timeStr, defaultHour) => {
    if (!timeStr) return defaultHour;
    const clean = String(timeStr).trim();
    const parts = clean.split(":");
    const parsed = parseInt(parts[0], 10);
    return isNaN(parsed) ? defaultHour : parsed;
};

/**
 * Dynamically generates 1-hour time slots with AM/PM labels based on venue operating hours
 */
const generateHoursFromVenue = (startTime, endTime) => {
    const startHour = parseStartEndHour(startTime, 8);
    const endHour = parseStartEndHour(endTime, 20);

    const slots = [];
    for (let h = startHour; h <= endHour; h++) {
        const period = h >= 12 ? "PM" : "AM";
        const hour12 = h % 12 === 0 ? 12 : h % 12;
        const formattedHour = String(hour12).padStart(2, "0");
        slots.push(`${formattedHour}:00 ${period}`);
    }
    return slots;
};

export function VenueScreen({ activeVenue, selectedPlanId, setSelectedPlanId, dateIndex, setDateIndex, cart, onToggleCartItem, onGo }) {
    // Generate hours dynamically from active venue's start_time and end_time
    const availableHours = generateHoursFromVenue(activeVenue?.start_time, activeVenue?.end_time);

    /**
     * Converts any time format ("02:00 PM", "14:00:00", "14:00") to standard 24-hour "HH:MM"
     */
    const to24Hour = (timeStr) => {
        if (!timeStr) return "";
        let str = String(timeStr).trim().toUpperCase();

        const isPM = str.includes("PM");
        const isAM = str.includes("AM");

        // Remove AM/PM suffix
        str = str.replace(/(AM|PM)/g, "").trim();
        const parts = str.split(":");

        let hours = parseInt(parts[0], 10);
        const minutes = parts[1] ? parts[1].padStart(2, "0") : "00";

        if (isPM && hours < 12) hours += 12;
        if (isAM && hours === 12) hours = 0;

        return `${String(hours).padStart(2, "0")}:${minutes}`;
    };

    /**
     * Check if a slot is booked using dynamic backend reservation data
     */
    const isSlotBooked = (dateObj, timeSlot) => {
        if (!activeVenue?.reservations || !Array.isArray(activeVenue.reservations)) {
            return false;
        }

        // 1. Format local selected calendar date to 'YYYY-MM-DD'
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const selectedDateStr = `${year}-${month}-${day}`;

        // 2. Convert UI slot (e.g., "02:00 PM") to 24h ("14:00")
        const target24h = to24Hour(timeSlot);

        return activeVenue.reservations.some((res) => {
            if (!res.reservation_date) return false;

            // Extract ONLY 'YYYY-MM-DD' from backend string (ignores timezone shifts)
            const resDateStr = String(res.reservation_date).split('T')[0];

            // Convert DB slot (e.g., "14:00:00" or "14:00") to 24h ("14:00")
            const res24h = to24Hour(res.slot_time);

            return (
                resDateStr === selectedDateStr &&
                res24h === target24h &&
                res.status !== 'cancelled'
            );
        });
    };

    const selectedDate = nextDates(7)[dateIndex];
    const dateLabel = fmtFullDate(selectedDate);

    return (
        <div className="screen-anim max-w-5xl mx-auto px-6 py-10 flex-1 w-full">
            <button onClick={() => onGo("category-view")} className="text-sm font-bold text-[var(--ink-dim)] mb-6 hover:text-[var(--pitch)]">
                ← Back to Listing
            </button>

            <div className="bg-white rounded-3xl border border-[var(--line-dark-strong)] p-8 mb-8 shadow-sm flex flex-col sm:flex-row justify-between gap-6">
                <div>
                    <span className="text-xs font-bold uppercase px-2.5 py-1 rounded text-white" style={{ background: CATEGORY_COLORS[activeVenue?.category?.name] || "var(--amber)" }}>
                        {activeVenue?.category?.name}
                    </span>
                    <h1 className="mp-display text-3xl text-[var(--pitch)] mt-2">{activeVenue?.name}</h1>
                    <p className="text-sm text-[var(--ink-dim)]">{activeVenue?.area} • {activeVenue?.address || activeVenue?.addr}</p>
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
                {availableHours.map((h) => {
                    const booked = isSlotBooked(selectedDate, h);
                    const itemKey = `${activeVenue?.id}-${dateLabel}-${h}`;
                    const inCart = cart.some(c => c.key === itemKey);

                    return (
                        <button
                            key={h}
                            disabled={booked}
                            onClick={() => onToggleCartItem(activeVenue, dateLabel, h)}
                            className={`p-4 rounded-2xl border text-center transition-all ${booked
                                ? "opacity-30 bg-gray-100 cursor-not-allowed border-gray-200"
                                : inCart
                                    ? "bg-[var(--amber)] text-white border-[var(--amber)] shadow-md"
                                    : "bg-white hover:border-[var(--amber)]"
                                }`}
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