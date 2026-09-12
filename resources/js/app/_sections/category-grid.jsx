import { CATEGORIES, CATEGORY_COLORS }  from "../_constants/mockData";
import { ServiceCategoryIcon } from "./service-category-icon";

export function CategoryGrid({ visibleCategories, showAllServices, onToggleShowAll, onCategoryClick }) {
    return (
        <section className="max-w-7xl mx-auto px-6 pt-10 pb-16 relative z-20">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[var(--line-dark-strong)] shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="mp-display text-lg text-[var(--pitch)]">Select Category</h3>
                        <p className="text-xs text-[var(--ink-dim)]">Tap any category to open venue listing</p>
                    </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-y-6 gap-x-3">
                    {visibleCategories.map(cat => {
                        const color = CATEGORY_COLORS[cat.key] || "var(--amber)";
                        return (
                            <button
                                key={cat.key}
                                onClick={() => onCategoryClick(cat.key)}
                                className="group flex flex-col items-center justify-start text-center outline-none"
                            >
                                <div className="relative mb-2">
                                    {cat.isBadge && (
                                        <span className="absolute -top-1.5 -right-2 z-10 bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full shadow-sm animate-pulse">
                                            {cat.badgeText}
                                        </span>
                                    )}
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 bg-[var(--chalk)] border border-[var(--line-dark-strong)] group-hover:border-[var(--amber)]">
                                        <ServiceCategoryIcon
                                            category={cat.key}
                                            className="w-7 h-7 sm:w-8 sm:h-8 transition-colors"
                                            style={{ stroke: color }}
                                        />
                                    </div>
                                </div>
                                <span className="text-xs font-semibold tracking-tight text-[var(--ink-dim)] group-hover:text-[var(--pitch)] line-clamp-1">
                                    {cat.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-8 pt-4 border-t border-[var(--line-dark)] text-center">
                    <button
                        onClick={onToggleShowAll}
                        className="text-sm font-bold text-[var(--amber)] hover:text-[var(--pitch)] transition-colors inline-flex items-center gap-1.5"
                    >
                        <span>{showAllServices ? "Show Fewer Categories" : "View All Services"}</span>
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            className={`w-4 h-4 transition-transform ${showAllServices ? "rotate-180" : ""}`}
                        >
                            <path d="M6 9l6 6 6-6" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}