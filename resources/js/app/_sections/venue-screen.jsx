import React from 'react';
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

export function VenueScreen({ activeVenue, selectedPlanId, setSelectedPlanId, dateIndex, setDateIndex, cart = [], onToggleCartItem, onGo }) {
    // Graceful fallback UI when activeVenue has not resolved yet
    if (!activeVenue) {
        return (
            <div className="screen-anim max-w-5xl mx-auto px-4 sm:px-6 py-16 flex-1 w-full text-center">
                <button
                    onClick={() => onGo("home")}
                    className="text-xs font-bold text-gray-400 hover:text-[#0f172a] flex items-center gap-1.5 mb-6 transition-colors mx-auto"
                >
                    ← Back to Listing
                </button>
                <div className="bg-white rounded-3xl border border-gray-100 p-12 shadow-xs">
                    <h2 className="text-xl font-bold text-gray-700">Venue Information Unavailable</h2>
                    <p className="text-sm text-gray-400 mt-2">The requested venue details could not be loaded or found.</p>
                    <button
                        onClick={() => onGo("home")}
                        className="mt-6 px-6 py-2.5 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-purple-700 transition-all"
                    >
                        Browse All Venues
                    </button>
                </div>
            </div>
        );
    }

    // Generate hours dynamically from active venue's start_time and end_time
    const availableHours = generateHoursFromVenue(activeVenue?.start_time, activeVenue?.end_time);
    const defaultCover = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";

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

            // Extract ONLY 'YYYY-MM-DD' from backend string
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

    const selectedDate = nextDates(7)[dateIndex] || new Date();
    const dateLabel = fmtFullDate(selectedDate);
    const catName = activeVenue?.category?.name || "Space";
    const catKey = activeVenue?.category?.key || "sports";
    const price = activeVenue?.base_price || activeVenue?.price || "25.00";

    return (
        <div className="screen-anim max-w-5xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
            {/* Top Navigation */}
            <button
                onClick={() => onGo("home")}
                className="text-xs font-bold text-gray-400 hover:text-[#0f172a] flex items-center gap-1.5 mb-6 transition-colors"
            >
                ← Back to Listing
            </button>

            {/* Venue Hero Banner Header */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 mb-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden relative">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 z-10">
                    <img
                        src={activeVenue?.image_url || defaultCover}
                        alt={activeVenue?.name || "Venue"}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 border border-gray-100 shadow-xs"
                    />
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span
                                className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-white shadow-xs"
                                style={{ background: CATEGORY_COLORS[catKey] || "var(--amber, #f59e0b)" }}
                            >
                                {catName}
                            </span>
                            <span className="text-xs font-bold text-yellow-500">★ {activeVenue?.rating || "5.0"}</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight">{activeVenue?.name || "Selected Venue"}</h1>
                        <p className="text-xs text-gray-400 mt-1">{activeVenue?.area || "Central District"} • {activeVenue?.address || activeVenue?.addr || "123 Main Street"}</p>
                    </div>
                </div>

                <div className="text-left md:text-right shrink-0 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0 w-full md:w-auto flex md:flex-col justify-between items-center md:items-end z-10">
                    <span className="text-xs text-gray-400 block font-medium">Standard Rate</span>
                    <div>
                        <span className="text-2xl font-black text-[#0f172a]">${price}</span>
                        <span className="text-xs text-gray-400 font-normal">/{activeVenue?.unitLabel || activeVenue?.unit_label || 'Hour'}</span>
                    </div>
                </div>
            </div>

            {/* Step 1: Select Date */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-extrabold text-[#0f172a]">1. Select Reservation Date</h3>
                    <span className="text-xs text-gray-400 font-medium">{dateLabel}</span>
                </div>

                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                    {nextDates(7).map((d, i) => {
                        const isSelected = dateIndex === i;
                        return (
                            <button
                                key={i}
                                onClick={() => setDateIndex(i)}
                                className={`flex-shrink-0 min-w-[76px] px-4 py-3 rounded-2xl border text-center transition-all ${isSelected
                                    ? "bg-gradient-to-tr from-purple-600 to-purple-500 text-white border-purple-500 shadow-md shadow-purple-500/20 scale-105"
                                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                <div className={`text-[10px] font-bold uppercase ${isSelected ? "text-purple-100" : "text-gray-400"}`}>
                                    {i === 0 ? "Today" : DAY_LABELS[d.getDay()]}
                                </div>
                                <div className="text-xl font-black mt-0.5">{d.getDate()}</div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Step 2: Choose Time Slots */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-extrabold text-[#0f172a]">2. Choose Time & Add to Cart</h3>
                    <span className="text-xs text-gray-400 font-medium">{availableHours.length} slots available</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                    {availableHours.map((h) => {
                        const booked = isSlotBooked(selectedDate, h);
                        const itemKey = `${activeVenue?.id}-${dateLabel}-${h}`;
                        const inCart = Array.isArray(cart) && cart.some(c => c.key === itemKey);

                        return (
                            <button
                                key={h}
                                disabled={booked || !activeVenue?.id}
                                onClick={() => {
                                    if (!activeVenue) return;
                                    onToggleCartItem(activeVenue, dateLabel, h);
                                }}
                                className={`p-4 rounded-2xl border text-center transition-all ${booked
                                    ? "opacity-40 bg-gray-100 cursor-not-allowed border-gray-200"
                                    : inCart
                                        ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20"
                                        : "bg-white text-gray-800 border-gray-200 hover:border-purple-400"
                                    }`}
                            >
                                <div className="text-base font-extrabold">{h}</div>
                                <div className="text-[10px] font-bold uppercase tracking-wider mt-1">
                                    {booked ? "Unavailable" : inCart ? "In Cart ✓" : "Available"}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Floating Cart Notification Bar */}
            {cart.length > 0 && (
                <div className="sticky bottom-6 bg-[#0f172a] text-white p-4 sm:p-5 rounded-3xl flex items-center justify-between shadow-2xl border border-gray-800 backdrop-blur-md animate-fadeIn z-30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                            {cart.length}
                        </div>
                        <div>
                            <span className="font-bold text-sm block">Reservation(s) in Cart</span>
                            <span className="text-xs text-gray-400">
                                Tier: {SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId)?.name || 'Standard'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => onGo("cart")}
                        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center gap-2"
                    >
                        <span>Checkout</span>
                        <span>→</span>
                    </button>
                </div>
            )}
        </div>
    );
}