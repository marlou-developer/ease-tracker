import { CATEGORY_COLORS } from "../_constants/mockData";


export function MyBookingsScreen({ confirmedBookings, onGo }) {
  return (
    <div className="screen-anim max-w-4xl mx-auto px-6 py-10 flex-1 w-full">
      <button onClick={() => onGo("home")} className="text-sm font-bold text-[var(--ink-dim)] mb-6 hover:text-[var(--pitch)]">
        ← Back to Home
      </button>
      <h1 className="mp-display text-3xl text-[var(--pitch)] mb-6">My Subscriptions & Bookings</h1>

      {confirmedBookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[var(--line-dark)]">
          <p className="text-[var(--ink-dim)] mb-4">No active subscriptions found.</p>
          <button onClick={() => onGo("home")} className="px-6 py-3 bg-[var(--pitch)] text-white font-bold rounded-xl text-sm">
            Book a Space
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {confirmedBookings.map((b, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-[var(--line-dark-strong)] p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded text-white" style={{ background: CATEGORY_COLORS[b.venue.category] || "var(--amber)" }}>
                  {b.venue.category}
                </span>
                <h3 className="mp-display text-xl text-[var(--pitch)] mt-1">{b.venue.name}</h3>
                <div className="text-xs text-[var(--ink-dim)] mt-1">
                  {b.dateLabel} at {b.hour} • Plan: <b className="text-[var(--pitch)]">{b.plan.name}</b>
                </div>
              </div>

              <div className="text-right border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-dim)] block">Pass Code</span>
                <span className="mp-display text-lg text-[var(--amber)] bg-[var(--chalk)] px-3 py-1 rounded-lg border border-[var(--line-dark)] inline-block mt-0.5">
                  {b.code}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}