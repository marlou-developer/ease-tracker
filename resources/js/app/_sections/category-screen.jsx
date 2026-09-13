import { CATEGORY_COLORS, VENUES } from "../_constants/mockData";
import { ServiceCategoryIcon } from "./service-category-icon";

export function CategoryScreen({ categoryFilter, searchText, setSearchText, onGo, onOpenVenue, selected }) {
    // 1. Safe extraction of selected key and venues array with fallbacks
    const selectedKey = selected?.key || selected?.category?.key || "sports";
    const selectedName = selected?.name || "Category";
    const rawVenues = Array.isArray(selected?.venues) ? selected.venues : [];

    // 2. Filter venues by searchText input
    const filteredVenues = rawVenues.filter(v =>
        v?.name?.toLowerCase().includes((searchText || '').toLowerCase()) ||
        v?.area?.toLowerCase().includes((searchText || '').toLowerCase())
    );

    return (
        <div className="screen-anim max-w-7xl mx-auto px-6 py-10 flex-1 w-full">
            {/* Back Button */}
            <button
                onClick={() => onGo("home")}
                className="text-sm font-bold text-[var(--ink-dim)] mb-6 hover:text-[var(--pitch)] flex items-center gap-1 transition-colors"
            >
                ← Back to Categories
            </button>

            {/* Header and Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm"
                        style={{ background: CATEGORY_COLORS[selectedKey] || "var(--amber)" }}
                    >
                        <ServiceCategoryIcon category={selectedKey} className="w-6 h-6 stroke-white" />
                    </div>
                    <div>
                        <h1 className="mp-display text-3xl text-[var(--pitch)]">{selectedName} Spaces</h1>
                        <p className="text-sm text-[var(--ink-dim)]">Browse and reserve from our active locations</p>
                    </div>
                </div>

                <div className="flex gap-2 bg-white p-2 rounded-2xl border border-[var(--line-dark-strong)] min-w-[280px]">
                    <input
                        value={searchText || ""}
                        onChange={e => setSearchText(e.target.value)}
                        placeholder={`Search ${selectedName}...`}
                        className="w-full bg-transparent px-3 py-1.5 text-sm text-[var(--ink)] outline-none"
                    />
                </div>
            </div>

            {/* Empty State vs Venues Grid */}
            {filteredVenues.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-[var(--line-dark)] my-8">
                    <p className="text-[var(--ink-dim)]">No available spaces found under this category.</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
                    {filteredVenues.map(v => {
                        const catKey = v?.category?.key || selectedKey;
                        const catName = v?.category?.name || selectedName;
                        const price = v?.base_price || v?.price || "0.00";

                        return (
                            <div
                                key={v.id}
                                onClick={() => onOpenVenue(v.id)}
                                className="venue-card-hover bg-white rounded-3xl border border-[var(--line-dark-strong)] p-6 cursor-pointer flex flex-col justify-between transition-all hover:shadow-lg"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <span
                                            className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-white"
                                            style={{ background: CATEGORY_COLORS[catKey] || "var(--amber)" }}
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
            )}
        </div>
    );
}