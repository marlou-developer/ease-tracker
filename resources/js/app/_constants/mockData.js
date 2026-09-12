export const CATEGORIES = [
    { key: "all", label: "All", isBadge: false },
    { key: "sports", label: "Sports", isBadge: false },
    { key: "hotel", label: "Hotels", isBadge: false },
    { key: "workspace", label: "Workspaces", isBadge: false },
    { key: "studio", label: "Studios", isBadge: false },
    { key: "fitness", label: "Gym & Fitness", isBadge: true, badgeText: "New" },
    { key: "wellness", label: "Spa & Wellness", isBadge: false },
    { key: "equipment", label: "Gear Rental", isBadge: false },
];

export const CATEGORY_COLORS = {
    all: "#8B5CF6",
    sports: "#8B5CF6",
    hotel: "#06B6D4",
    workspace: "#10B981",
    studio: "#F59E0B",
    fitness: "#EC4899",
    wellness: "#3B82F6",
    equipment: "#6366F1",
};

export const SUBSCRIPTION_PLANS = [
    {
        id: "single",
        name: "One-Time Booking",
        discount: 0,
        badge: "Standard",
        desc: "Pay standard rate for single usage without recurring commitment.",
        period: "one-time",
    },
    {
        id: "monthly_pass",
        name: "Flex Pass Subscription",
        discount: 0.15,
        badge: "15% OFF",
        desc: "Monthly subscription auto-renews. Unlimited access with 15% off all sessions.",
        period: "/month",
    },
    {
        id: "vip_membership",
        name: "VIP Elite Club Subscription",
        discount: 0.3,
        badge: "30% OFF • VIP",
        desc: "Full membership including priority booking windows and 30% discount per reservation.",
        period: "/month",
    },
];

export const VENUES = [
    {
        id: "v1",
        category: "sports",
        name: "Riverside Tennis Club",
        area: "Riverside Park",
        addr: "12 Riverside Ave",
        price: 25,
        rating: 4.8,
        dist: "1.2 km",
        unitLabel: "court",
    },
    {
        id: "v2",
        category: "hotel",
        name: "Grand Vista Resort & Spa",
        area: "Downtown",
        addr: "450 Ocean Parkway",
        price: 180,
        rating: 4.9,
        dist: "0.5 km",
        unitLabel: "suite",
    },
    {
        id: "v3",
        category: "workspace",
        name: "Nexus Co-Working Hub",
        area: "Tech District",
        addr: "101 Innovation Way",
        price: 15,
        rating: 4.7,
        dist: "2.1 km",
        unitLabel: "desk",
    },
    {
        id: "v4",
        category: "studio",
        name: "Lumina Photography Studio",
        area: "Arts Quarter",
        addr: "88 Canvas St",
        price: 65,
        rating: 4.6,
        dist: "3.4 km",
        unitLabel: "hall",
    },
    {
        id: "v5",
        category: "sports",
        name: "Greenfield Turf Field",
        area: "Greenfield",
        addr: "5 Greenfield Way",
        price: 60,
        rating: 4.7,
        dist: "2.1 km",
        unitLabel: "pitch",
    },
    {
        id: "v6",
        category: "hotel",
        name: "Urban Boutique Hotel",
        area: "Central District",
        addr: "128 Main St",
        price: 120,
        rating: 4.5,
        dist: "1.8 km",
        unitLabel: "room",
    },
    {
        id: "v7",
        category: "fitness",
        name: "Pulse CrossFit & Gym",
        area: "Metro Center",
        addr: "14 Power St",
        price: 20,
        rating: 4.9,
        dist: "0.9 km",
        unitLabel: "day pass",
    },
    {
        id: "v8",
        category: "wellness",
        name: "Serenity Sauna & Spa",
        area: "Lakeside",
        addr: "90 Calm Water Rd",
        price: 50,
        rating: 4.8,
        dist: "3.1 km",
        unitLabel: "session",
    },
];

export const HOURS = [
    "08:00",
    "10:00",
    "12:00",
    "14:00",
    "16:00",
    "18:00",
    "20:00",
];
export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function seedRand(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}
export function isBooked(venueIndex, dateIndex, hourIndex) {
    return (
        seedRand(venueIndex * 137 + dateIndex * 31 + hourIndex * 7 + 1) < 0.25
    );
}
export function nextDates(n) {
    const out = [];
    const today = new Date();
    for (let i = 0; i < n; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        out.push(d);
    }
    return out;
}
export function fmtFullDate(d) {
    return d.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}
