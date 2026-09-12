import { CATEGORIES, CATEGORY_COLORS, VENUES }  from "../_constants/mockData";
import { ServiceCategoryIcon } from "./service-category-icon";

export function CategoryScreen({ categoryFilter, searchText, setSearchText, onGo, onOpenVenue }) {
    const activeCategoryObj = CATEGORIES.find(c => c.key === categoryFilter) || CATEGORIES[0];

    const filteredVenues = VENUES.filter(v => categoryFilter === "all" || v.category === categoryFilter)
        .filter(v => {
            const q = searchText.trim().toLowerCase();
            return !q || v.name.toLowerCase().includes(q) || v.area.toLowerCase().includes(q);
        });

    return (
        <div className="screen-anim max-w-7xl mx-auto px-6 py-10 flex-1 w-full">
            <button onClick={() => onGo("home")} className="text-sm font-bold text-[var(--ink-dim)] mb-6 hover:text-[var(--pitch)] flex items-center gap-1">
                ← Back to Categories
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                        style={{ background: CATEGORY_COLORS[activeCategoryObj.key] || "var(--amber)" }}
                    >
                        <ServiceCategoryIcon category={activeCategoryObj.key} className="w-6 h-6 stroke-white" />
                    </div>
                    <div>
                        <h1 className="mp-display text-3xl text-[var(--pitch)]">{activeCategoryObj.label} Spaces</h1>
                        <p className="text-sm text-[var(--ink-dim)]">Browse and reserve from our active locations</p>
                    </div>
                </div>

                <div className="flex gap-2 bg-white p-2 rounded-2xl border border-[var(--line-dark-strong)] min-w-[280px]">
                    <input
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        placeholder={`Search ${activeCategoryObj.label}...`}
                        className="w-full bg-transparent px-3 py-1.5 text-sm text-[var(--ink)] outline-none"
                    />
                </div>
            </div>

            {filteredVenues.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-[var(--line-dark)] my-8">
                    <p className="text-[var(--ink-dim)]">No available spaces found under this category.</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
                    {filteredVenues.map(v => (
                        <div key={v.id} onClick={() => onOpenVenue(v.id)} className="venue-card-hover bg-white rounded-3xl border border-[var(--line-dark-strong)] p-6 cursor-pointer flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-white" style={{ background: CATEGORY_COLORS[v.category] || "var(--amber)" }}>
                                        {v.category}
                                    </span>
                                    <span className="text-xs font-bold text-yellow-500">★ {v.rating}</span>
                                </div>
                                <h3 className="mp-display text-xl text-[var(--pitch)] mb-1">{v.name}</h3>
                                <p className="text-xs text-[var(--ink-dim)] mb-4">{v.area} • {v.dist}</p>
                            </div>

                            <div className="pt-4 border-t border-[var(--line-dark)] flex items-center justify-between">
                                <div>
                                    <span className="text-xs text-[var(--ink-dim)] block">Standard Rate</span>
                                    <span className="mp-display text-xl text-[var(--pitch)]">${v.price}<span className="text-xs font-normal">/{v.unitLabel}</span></span>
                                </div>
                                <button className="px-4 py-2 rounded-xl bg-[var(--chalk)] text-[var(--pitch)] font-bold text-xs hover:bg-[var(--pitch)] hover:text-white">
                                    Reserve Slot
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}