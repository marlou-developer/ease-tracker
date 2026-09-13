import React, { useState, useRef } from 'react';
import { CATEGORY_COLORS } from "../_constants/mockData";
import { ServiceCategoryIcon } from "./service-category-icon";

export function CategoryGrid({
    visibleCategories = [],
    showAllServices,
    onToggleShowAll,
    onCategoryClick,
    onOpenVenue,
    onGo
}) {
    const [selectedCatKey, setSelectedCatKey] = useState('all');
    const selectedVenueSectionRef = useRef(null);

    // 1. Normalize categories (Handles flat array or nested lessee objects)
    let categoriesToDisplay = [];
    if (Array.isArray(visibleCategories)) {
        categoriesToDisplay = visibleCategories.flatMap(item => item?.categories ? item.categories : item);
    } else if (visibleCategories && Array.isArray(visibleCategories.categories)) {
        categoriesToDisplay = visibleCategories.categories;
    }

    // 2. Extract all venues across available categories with parent reference
    const allVenues = categoriesToDisplay.flatMap(cat =>
        (cat.venues || []).map(v => ({
            ...v,
            categoryKey: cat.key || cat.name?.toLowerCase().replace(/\s+/g, '_'),
            parentCategory: cat
        }))
    );

    // Filter venues based on selected service category pill
    const filteredVenues = selectedCatKey === 'all'
        ? allVenues
        : allVenues.filter(v => v.categoryKey === selectedCatKey);

    const defaultCover = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80";

    // Handle Service Pill Click: Filters & Scrolls to "Selected Venue" section
    const handleServicePillClick = (catKey) => {
        setSelectedCatKey(catKey);

        if (selectedVenueSectionRef.current) {
            selectedVenueSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleVenueSelect = (venueId, venueObj) => {
        if (typeof onOpenVenue === 'function' && venueId) {
            onOpenVenue(venueId);
        } else if (typeof onCategoryClick === 'function' && venueObj) {
            onCategoryClick(venueObj.parentCategory || venueObj);
        }
    };

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-16 relative z-20">
            {/* Top Navigation & Location Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <button
                        onClick={() => onGo && onGo("lessee")}
                        className="text-xs font-bold text-gray-400 hover:text-[#0f172a] flex items-center gap-1 mb-1 transition-colors"
                    >
                        ← Back to Lessee
                    </button>
                    {/* <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider block">Location</span>
                        <svg className="w-3.5 h-3.5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                    </div> */}
                    <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">Discover Spaces</h2>
                </div>

                {/* Filter Icon Action Button */}
                {/* <button className="w-11 h-11 bg-gradient-to-tr from-purple-600 to-purple-500 text-white rounded-2xl flex items-center justify-center shadow-md shadow-purple-500/20 hover:scale-105 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                </button> */}
            </div>

            {/* Service Category Pills */}
            <div className="flex gap-2.5 flex-wrap pb-3 mb-8">
                <button
                    onClick={() => handleServicePillClick('all')}
                    className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${selectedCatKey === 'all'
                            ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md shadow-purple-500/20 scale-105'
                            : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
                        }`}
                >
                    All Services
                </button>

                {categoriesToDisplay.map((cat, index) => {
                    const catKey = cat.key || cat.name?.toLowerCase().replace(/\s+/g, '_') || index;
                    const isSelected = selectedCatKey === catKey;

                    return (
                        <button
                            key={cat.id || catKey}
                            onClick={() => handleServicePillClick(catKey)}
                            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${isSelected
                                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md shadow-purple-500/20 scale-105'
                                    : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
                                }`}
                        >
                            <ServiceCategoryIcon
                                category={catKey}
                                className={`w-4 h-4 ${isSelected ? 'stroke-white' : 'stroke-gray-500'}`}
                            />
                            <span>{cat.name}</span>
                        </button>
                    );
                })}
            </div>
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#0f172a]">Best for you</h3>
                    <span className="text-xs text-gray-400 font-medium">{filteredVenues.length} spaces listed</span>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredVenues.map((v, idx) => {
                        const catKey = v.categoryKey || v.category?.key || "sports";
                        const catName = v.parentCategory?.name || v.category?.name || "Venue";
                        const price = v.base_price || v.price || "25.00";

                        return (
                            <div
                                key={v.id || idx}
                                // onClick={() => handleVenueSelect(v.id, v)}

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
                    })}
                </div>
            </div>
        </section>
    );
}