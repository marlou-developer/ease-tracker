export function ConfirmScreen({ cart, form, setForm, formErrors = {}, onFinalize, onGo }) {
  // Safe calculation to prevent NaN issues
  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      const price = parseFloat(item.venue?.base_price || item.finalPrice || 0);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
  };

  return (
    <div className="screen-anim max-w-3xl mx-auto px-6 py-10 flex-1 w-full">
      <button onClick={() => onGo("cart")} className="text-sm font-bold text-[var(--ink-dim)] mb-6 hover:text-[var(--pitch)]">
        ← Back to Cart
      </button>
      <h1 className="mp-display text-3xl text-[var(--pitch)] mb-6">Confirm Checkout</h1>

      <div className="bg-white rounded-3xl p-8 border border-[var(--line-dark-strong)] shadow-sm space-y-6">
        <div>
          <h3 className="mp-display text-lg text-[var(--pitch)] mb-4">Guest Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--pitch)] mb-1">Full Name *</label>
              <input
                value={form.name || ""}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Alex Morgan"
                className={`w-full p-3 rounded-xl border text-sm outline-none transition-all ${
                  formErrors.name ? "border-red-500 bg-red-50/50" : "border-[var(--line-dark-strong)] focus:border-[var(--pitch)]"
                }`}
              />
              {formErrors.name && <span className="text-xs text-red-500 font-bold mt-1 block">{formErrors.name}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--pitch)] mb-1">Email Address *</label>
              <input
                type="email"
                value={form.email || ""}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="alex@example.com"
                className={`w-full p-3 rounded-xl border text-sm outline-none transition-all ${
                  formErrors.email ? "border-red-500 bg-red-50/50" : "border-[var(--line-dark-strong)] focus:border-[var(--pitch)]"
                }`}
              />
              {formErrors.email && <span className="text-xs text-red-500 font-bold mt-1 block">{formErrors.email}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--pitch)] mb-1">Phone Number (Optional)</label>
              <input
                type="tel"
                value={form.phone || ""}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full p-3 rounded-xl border border-[var(--line-dark-strong)] text-sm outline-none focus:border-[var(--pitch)]"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--line-dark)]">
          <h3 className="mp-display text-lg text-[var(--pitch)] mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            {cart.map(c => {
              const price = parseFloat(c.venue?.base_price || c.finalPrice || 0);

              return (
                <div key={c.key} className="flex justify-between items-center text-[var(--ink-dim)]">
                  <span>
                    {c.venue?.name} <span className="text-xs opacity-70">({c.dateLabel} • {c.hour})</span>
                  </span>
                  <span className="font-bold text-[var(--pitch)]">${price.toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between font-bold text-xl text-[var(--pitch)] pt-4 mt-4 border-t border-[var(--line-dark)]">
            <span>Total Due Now</span>
            <span className="text-[var(--amber)]">${calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        <button onClick={onFinalize} className="w-full py-4 bg-[var(--pitch)] text-white font-bold rounded-xl text-base shadow-lg hover:scale-[1.01] transition-transform">
          Confirm & Pay Reservations
        </button>
      </div>
    </div>
  );
}