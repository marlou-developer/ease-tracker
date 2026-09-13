import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export default function LesseeList({ onLesseeClick }) {
    // Redux store selector with fallback array
    const rawLessees = useSelector((store) => store.app?.lessees);
    const lessees = Array.isArray(rawLessees) ? rawLessees : [];

    const [searchTerm, setSearchTerm] = useState('');
    const [expandedLesseeId, setExpandedLesseeId] = useState(true);

    // Dynamic stock image resolver based on category key or venue name
    const getVenueImage = (categoryKey, venueName) => {
        const key = categoryKey?.toLowerCase() || '';
        const name = venueName?.toLowerCase() || '';

        if (key.includes('sport') || name.includes('court') || name.includes('tennis') || name.includes('turf')) {
            return "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=400&q=80";
        }
        if (key.includes('hotel') || key.includes('suite') || name.includes('suite') || name.includes('resort')) {
            return "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80";
        }
        if (key.includes('work') || key.includes('office') || name.includes('hub') || name.includes('desk')) {
            return "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80";
        }
        if (key.includes('studio') || name.includes('hall') || name.includes('stage')) {
            return "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80";
        }
        if (key.includes('fit') || key.includes('gym') || name.includes('fitness')) {
            return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80";
        }
        if (key.includes('spa') || key.includes('well') || name.includes('sauna')) {
            return "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80";
        }
        return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80";
    };

    // Active client-side search filtering
    const filteredLessees = lessees.filter((lessee) => {
        const nameMatch = lessee.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = lessee.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || emailMatch;
    });

    const toggleExpand = (e, id) => {
        e.stopPropagation(); // Stop card click handler from firing when clicking expand toggle
        setExpandedLesseeId(expandedLesseeId === id ? null : id);
    };

    const handleCardClick = (lessee) => {
        if (typeof onLesseeClick === 'function') {
            onLesseeClick(lessee);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-4 space-y-6">
            {/* Top Bar: Search & Metrics */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                <div>
                    <h3 className="text-xl font-bold text-[#0f172a]">Lessee Directory</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Manage platform subscribers, business profiles, and venue listings</p>
                </div>
                <div className="w-full sm:w-80 relative">
                    <input
                        type="text"
                        placeholder="Search lessee by business or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0f172a] transition-all"
                    />
                    <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Lessee Cards List */}
            <div className="space-y-4">
                {filteredLessees.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                            🏢
                        </div>
                        <p className="text-gray-500 font-medium text-sm">
                            {lessees.length === 0 ? "Loading lessees..." : `No lessees found matching "${searchTerm}"`}
                        </p>
                    </div>
                ) : (
                    filteredLessees.map((lessee) => {
                        const totalCategories = lessee.categories?.length || 0;
                        const totalVenues = lessee.categories?.reduce((acc, cat) => acc + (cat.venues?.length || 0), 0) || 0;
                        const isExpanded = expandedLesseeId === lessee.id;

                        // Pick first venue image as primary business banner avatar
                        const firstCategory = lessee.categories?.[0];
                        const firstVenue = firstCategory?.venues?.[0];
                        const businessCoverImg = firstVenue?.image_url || getVenueImage(firstCategory?.key, firstVenue?.name);

                        return (
                            <div
                                key={lessee.id}
                                onClick={() => handleCardClick(lessee)}
                                className={`bg-white rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden ${isExpanded
                                        ? 'border-[#f59e0b] shadow-xl ring-1 ring-[#f59e0b]/20'
                                        : 'border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'
                                    }`}
                            >
                                {/* Lessee Main Header Row */}
                                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        {/* Business Banner Thumbnail */}
                                        <div className="relative group shrink-0">
                                            <img
                                                src={lessee.avatar_url || businessCoverImg}
                                                alt={lessee.name}
                                                className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md bg-slate-100"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = getVenueImage('', '');
                                                }}
                                            />
                                            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-[#0f172a] text-base hover:text-[#f59e0b] transition-colors">
                                                    {lessee.name}
                                                </h4>
                                                <span className="px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200">
                                                    {lessee.role || 'Subscriber'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">{lessee.email}</p>
                                        </div>
                                    </div>

                                    {/* Stats & Action Buttons */}
                                    <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                                        <div className="text-center px-2">
                                            <span className="block text-[11px] text-gray-400 font-medium uppercase tracking-wider">Categories</span>
                                            <span className="text-sm font-bold text-[#0f172a]">{totalCategories}</span>
                                        </div>
                                        <div className="text-center px-2 border-x border-gray-100">
                                            <span className="block text-[11px] text-gray-400 font-medium uppercase tracking-wider">Venues</span>
                                            <span className="text-sm font-bold text-[#f59e0b]">{totalVenues}</span>
                                        </div>

                                        {/* Expand Toggle Button */}
                                        <button
                                            type="button"
                                            onClick={(e) => toggleExpand(e, lessee.id)}
                                            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${isExpanded
                                                    ? 'bg-[#0f172a] text-white shadow-md'
                                                    : 'bg-gray-100 text-[#0f172a] hover:bg-gray-200'
                                                }`}
                                        >
                                            {isExpanded ? 'Hide Properties' : 'Explore Business'}
                                            <span className={`text-[10px] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                                ▼
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* Expandable Category & Venue Drawer */}
                                {isExpanded && (
                                    <div className="bg-slate-50 border-t border-gray-100 p-6 space-y-4 animate-fadeIn">
                                        <div className="flex justify-between items-center">
                                            <h5 className="text-xs font-extrabold text-[#0f172a] uppercase tracking-wider">
                                                Managed Portfolios & Properties
                                            </h5>
                                            <span className="text-xs text-gray-400 font-medium">
                                                Click any property card to view details
                                            </span>
                                        </div>

                                        {totalCategories === 0 ? (
                                            <p className="text-xs text-gray-500 italic">No categories or property spaces assigned yet.</p>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {lessee.categories.map((cat) => (
                                                    <div
                                                        key={cat.id}
                                                        className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-[#f59e0b] transition-all flex flex-col justify-between"
                                                    >
                                                        <div>
                                                            <div className="flex justify-between items-center mb-3">
                                                                <span className="font-bold text-xs text-[#0f172a] uppercase tracking-wide">
                                                                    {cat.name}
                                                                </span>
                                                                <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-md border border-amber-200">
                                                                    {cat.venues?.length || 0} Listed
                                                                </span>
                                                            </div>

                                                            {/* Venue Visual Items */}
                                                            {cat.venues && cat.venues.length > 0 ? (
                                                                <div className="space-y-2.5">
                                                                    {cat.venues.map((v) => {
                                                                        const venueImg = v.image_url || getVenueImage(cat.key, v.name);
                                                                        const price = v.base_price || v.price || "0.00";

                                                                        return (
                                                                            <div
                                                                                key={v.id}
                                                                                className="group/item text-xs bg-gray-50 p-2 rounded-xl border border-gray-100 hover:bg-white hover:shadow-xs transition-all flex items-center justify-between gap-3"
                                                                            >
                                                                                <div className="flex items-center gap-2.5 min-w-0">
                                                                                    <img
                                                                                        src={venueImg}
                                                                                        alt={v.name}
                                                                                        className="w-9 h-9 rounded-lg object-cover shrink-0 border border-gray-200"
                                                                                        onError={(e) => {
                                                                                            e.target.onerror = null;
                                                                                            e.target.src = getVenueImage(cat.key, v.name);
                                                                                        }}
                                                                                    />
                                                                                    <div className="truncate">
                                                                                        <p className="font-semibold text-gray-800 truncate group-hover/item:text-[#f59e0b] transition-colors">
                                                                                            {v.name}
                                                                                        </p>
                                                                                        <p className="text-[10px] text-gray-400 truncate">
                                                                                            {v.area || "Main Facility"}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                                <span className="font-extrabold text-[#0f172a] shrink-0 bg-white px-2 py-1 rounded-md border border-gray-100">
                                                                                    ${price}/hr
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            ) : (
                                                                <div className="py-4 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                                                    <p className="text-[11px] text-gray-400 italic">No active venues listed</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}