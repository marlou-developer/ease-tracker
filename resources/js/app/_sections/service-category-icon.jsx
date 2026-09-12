export function ServiceCategoryIcon({ category, className = "w-6 h-6", style }) {
    const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className, style };
    switch (category) {
        case "all":
            return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></svg>;
        case "sports":
            return <svg {...common}><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4v16" /></svg>;
        case "hotel":
            return <svg {...common}><path d="M3 21h18M3 7v14M21 7v14M6 11h4M14 11h4M6 15h4M14 15h4M9 3h6v4H9z" /></svg>;
        case "workspace":
            return <svg {...common}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M2 20h20M7 16v4M17 16v4" /></svg>;
        case "studio":
            return <svg {...common}><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>;
        case "fitness":
            return <svg {...common}><path d="M6.5 6.5h11M6.5 17.5h11M4 9v6M20 9v6M9 6v12M15 6v12" /></svg>;
        case "wellness":
            return <svg {...common}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>;
        case "equipment":
            return <svg {...common}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>;
        default:
            return <svg {...common}><circle cx="12" cy="12" r="10" /></svg>;
    }
}