import { ServiceCategoryIcon } from "./service-category-icon";


export function Navbar({ cartCount, bookingsCount, user, onGo, onSignOut, onOpenSignIn }) {
  return (
    <nav className="sticky top-0 z-40 glass-nav border-b border-[var(--line-dark)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onGo("home")}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[var(--amber)] to-[var(--pitch-3)] shadow-md group-hover:scale-105 transition-transform">
            <ServiceCategoryIcon category="sports" className="w-5 h-5 stroke-white" />
          </div>
          <div>
            <span className="mp-display text-2xl tracking-tight text-[var(--pitch)]">OmniReserve</span>
            <span className="block text-[10px] font-bold text-[var(--amber)] uppercase tracking-wider -mt-1">Subscription Bookings</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => onGo("cart")} className="relative px-4 py-2 rounded-xl bg-white border border-[var(--line-dark-strong)] text-sm font-bold flex items-center gap-2 hover:border-[var(--amber)]">
            <span>🛒 Cart</span>
            {cartCount > 0 && (
              <span className="bg-[var(--amber)] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </button>

          <button onClick={() => onGo("my-bookings")} className="hidden sm:block text-sm font-bold text-[var(--ink-dim)] hover:text-[var(--pitch)]">
            My Subscriptions ({bookingsCount})
          </button>

          <button
            onClick={() => user ? onSignOut() : onOpenSignIn()}
            className="px-5 py-2 text-sm font-bold rounded-full shadow border transition-all"
            style={{ background: user ? "white" : "var(--pitch)", color: user ? "var(--pitch)" : "white" }}
          >
            {user ? `Hey, ${user.split(" ")[0]}` : "Sign In"}
          </button>
        </div>
      </div>
    </nav>
  );
}