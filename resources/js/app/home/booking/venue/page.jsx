import React from 'react';
import { CATEGORY_COLORS } from "../../../_constants/mockData";

export function VenueScreen({ searchText, onOpenVenue, selected, onGo }) {
    const defaultCover = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80";
    const rawVenues = Array.isArray(selected?.venues) ? selected.venues : [];

    // Filter venues by search text input
    const filteredVenues = rawVenues.filter(v =>
        v?.name?.toLowerCase().includes((searchText || '').toLowerCase()) ||
        v?.area?.toLowerCase().includes((searchText || '').toLowerCase())
    );

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-16 relative z-20">
            {/* Header & Back Navigation */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => onGo && onGo("home")}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 font-bold text-sm"
                >
                    ← Back
                </button>
                <div>
                    <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">
                        {selected?.name || "Category Spaces"}
                    </h2>
                    <p className="text-xs text-gray-400 font-medium">{filteredVenues.length} spaces listed</p>
                </div>
            </div>

            {/* Spaces Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVenues.length > 0 ? (
                    filteredVenues.map((v, idx) => {
                        const catKey = v.categoryKey || selected?.key || "sports";
                        const catName = selected?.name || v.category?.name || "Venue";
                        const price = v.base_price || v.price || "25.00";

                        return (
                            <div
                                key={v.id || idx}
                                onClick={() => onOpenVenue(v.id)}
                                className="venue-card-hover bg-white rounded-3xl border border-[var(--line-dark-strong)] p-6 cursor-pointer flex flex-col justify-between transition-all hover:shadow-lg"
                            >
                                <div>
                                    <div className="relative mb-4 overflow-hidden rounded-2xl h-44">
                                        <img
                                            src={v.image_url || defaultCover}
                                            alt={v.name}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>

                                    <div className="flex justify-between items-start mb-4">
                                        <span
                                            className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-white"
                                            style={{ background: CATEGORY_COLORS[catKey] || "var(--amber, #f59e0b)" }}
                                        >
                                            {catName}
                                        </span>
                                        <span className="text-xs font-bold text-yellow-500">★ {v.rating || "5.0"}</span>
                                    </div>

                                    <h3 className="mp-display text-xl text-[var(--pitch)] mb-1">{v.name}</h3>
                                    <p className="text-xs text-[var(--ink-dim)] mb-4">{v.area || "Main Location"} • {v.distance || v.dist || "Nearby"}</p>
                                </div>

                                <div className="pt-4 border-t border-[var(--line-dark)] flex items-center justify-between">
                                    <div>
                                        <span className="text-xs text-[var(--ink-dim)] block">Standard Rate</span>
                                        <span className="mp-display text-xl text-[var(--pitch)]">
                                            ${price}<span className="text-xs font-normal">/{v.unitLabel || v.unit_label || 'Hour'}</span>
                                        </span>
                                    </div>
                                    <button className="px-4 py-2 rounded-xl bg-[var(--chalk)] text-[var(--pitch)] font-bold text-xs hover:bg-[var(--pitch)] hover:text-white transition-colors">
                                        Reserve Slot
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-12 text-center text-gray-400">
                        No venues available for this category.
                    </div>
                )}
            </div>
        </section>
    );
}