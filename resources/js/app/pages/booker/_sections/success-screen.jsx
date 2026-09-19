export function SuccessScreen({ onGo }) {
  return (
    <div className="screen-anim max-w-xl mx-auto px-6 py-16 text-center flex-1 w-full">
      <div className="w-20 h-20 bg-gradient-to-br from-[var(--amber)] to-[var(--pitch)] rounded-full mx-auto flex items-center justify-center text-white text-3xl shadow-xl mb-6">
        ✓
      </div>
      <h1 className="mp-display text-3xl text-[var(--pitch)]">Subscriptions Active!</h1>
      <p className="text-sm text-[var(--ink-dim)] mt-2 mb-8">
        Your multiple reservations have been secured under your chosen subscription tiers.
      </p>

      <div className="flex justify-center gap-4">
        <button onClick={() => onGo("my-bookings")} className="px-6 py-3 bg-[var(--pitch)] text-white font-bold text-sm rounded-xl">
          View My Bookings
        </button>
        <button onClick={() => onGo("home")} className="px-6 py-3 bg-white border border-[var(--line-dark-strong)] font-bold text-sm rounded-xl">
          Back to Home
        </button>
      </div>
    </div>
  );
}