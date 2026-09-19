import React, { useState } from 'react';
import { ServiceCategoryIcon } from "./service-category-icon";

export function CategoryGrid({
    visibleCategories = [],
    onCategoryClick,
    showAllServices = false,
    onToggleShowAll
}) {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [activeId, setActiveId] = useState(null);

    // Normalize categories array
    let categoriesToDisplay = [];
    if (Array.isArray(visibleCategories)) {
        categoriesToDisplay = visibleCategories.flatMap(item => item?.categories ? item.categories : item);
    } else if (visibleCategories && Array.isArray(visibleCategories.categories)) {
        categoriesToDisplay = visibleCategories.categories;
    }

    const handleClick = (cat) => {
        setActiveId(cat.id || cat.key);
        if (typeof onCategoryClick === 'function') {
            onCategoryClick(cat);
        }
    };

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-16 relative z-20">
            {/* Header with Counter Badge */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">Services</h2>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Explore available venue categories</p>
                </div>
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100/60 shadow-sm">
                    {categoriesToDisplay.length} Available
                </span>
            </div>

            {/* Interactive Circular Category Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-y-7 gap-x-2 mb-10">
                {categoriesToDisplay.map((cat, index) => {
                    const catKey = cat.key || cat.name?.toLowerCase().replace(/\s+/g, '_') || index;
                    const catId = cat.id || catKey;
                    const isHovered = hoveredIndex === index;
                    const isActive = activeId === catId;

                    return (
                        <button
                            key={catId}
                            onClick={() => handleClick(cat)}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="flex flex-col items-center cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-2xl p-1 transition-all"
                        >
                            {/* Inner Circle Container */}
                            <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 transform border border-purple-500/30 ${isActive
                                    ? 'bg-gradient-to-tr from-purple-600 to-indigo-500 scale-105 shadow-lg shadow-purple-500/30 text-white ring-4 ring-purple-200 border-transparent'
                                    : isHovered
                                        ? 'bg-purple-100 scale-110 shadow-md shadow-purple-200/50 -translate-y-1 border-purple-500'
                                        : 'bg-purple-50/80 hover:bg-purple-100 shadow-sm'
                                }`}>
                                {/* Animated Pulsing Background Ring on Hover */}
                                {isHovered && !isActive && (
                                    <span className="absolute inset-0 rounded-full bg-purple-400/20 animate-ping pointer-events-none" />
                                )}

                                {/* Animated 'New' Badge */}
                                {cat.isNew && (
                                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-red-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md animate-bounce z-10">
                                        New
                                    </span>
                                )}

                                {/* Icon Component */}
                                <ServiceCategoryIcon
                                    category={catKey}
                                    className={`w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300 ${isActive
                                            ? 'stroke-white scale-110'
                                            : isHovered
                                                ? 'stroke-purple-700 rotate-6 scale-110'
                                                : 'stroke-purple-600'
                                        }`}
                                />
                            </div>

                            {/* Dynamic Text Label */}
                            <span className={`text-xs font-semibold mt-3 text-center line-clamp-1 transition-colors duration-200 ${isActive
                                    ? 'text-purple-700 font-black'
                                    : isHovered
                                        ? 'text-purple-600 font-bold'
                                        : 'text-gray-700 group-hover:text-purple-900'
                                }`}>
                                {cat.name}
                            </span>
                        </button>
                    );
                })}

                {/* Interactive Show More / Show Less Toggle Button */}
                {typeof onToggleShowAll === 'function' && (
                    <button
                        onClick={onToggleShowAll}
                        className="flex flex-col items-center cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-2xl p-1 transition-all"
                    >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-50/80 hover:bg-purple-600 hover:text-white flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-md group-hover:shadow-purple-300/50 shadow-sm text-purple-600 border border-purple-500/30 group-hover:border-transparent">
                            <svg
                                className={`w-6 h-6 transition-transform duration-500 ease-in-out ${showAllServices ? 'rotate-180' : 'group-hover:translate-y-0.5'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        <span className="text-xs font-semibold mt-3 text-center text-gray-700 group-hover:text-purple-600 transition-colors">
                            {showAllServices ? 'Show Less' : 'More'}
                        </span>
                    </button>
                )}
            </div>
        </section>
    );
}