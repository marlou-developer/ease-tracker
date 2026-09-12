export function ConfirmScreen({ cart, form, setForm, formErrors, onFinalize, onGo }) {
  return (
    <div className="screen-anim max-w-3xl mx-auto px-6 py-10 flex-1 w-full">
      <button onClick={() => onGo("cart")} className="text-sm font-bold text-[var(--ink-dim)] mb-6 hover:text-[var(--pitch)]">
        ← Back to Cart
      </button>
      <h1 className="mp-display text-3xl text-[var(--pitch)] mb-6">Confirm Checkout</h1>

      <div className="bg-white rounded-3xl p-8 border border-[var(--line-dark-strong)] shadow-sm space-y-6">
        <div>
          <h3 className="mp-display text-lg text-[var(--pitch)] mb-4">Subscriber Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--pitch)] mb-1">Full Name *</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Alex Morgan"
                className={`w-full p-3 rounded-xl border text-sm outline-none ${formErrors.name ? "border-red-500" : "border-[var(--line-dark-strong)]"}`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--pitch)] mb-1">Email Address *</label>
              <input
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="alex@example.com"
                className={`w-full p-3 rounded-xl border text-sm outline-none ${formErrors.email ? "border-red-500" : "border-[var(--line-dark-strong)]"}`}
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--line-dark)]">
          <h3 className="mp-display text-lg text-[var(--pitch)] mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            {cart.map(c => (
              <div key={c.key} className="flex justify-between text-[var(--ink-dim)]">
                <span>{c.venue.name} ({c.hour})</span>
                <span className="font-bold text-[var(--pitch)]">${c.finalPrice}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-xl text-[var(--pitch)] pt-4 mt-4 border-t border-[var(--line-dark)]">
            <span>Total Due Now</span>
            <span className="text-[var(--amber)]">${cart.reduce((s, i) => s + i.finalPrice, 0)}</span>
          </div>
        </div>

        <button onClick={onFinalize} className="w-full py-4 bg-[var(--pitch)] text-white font-bold rounded-xl text-base shadow-lg hover:scale-[1.01]">
          Subscribe & Lock In Reservations
        </button>
      </div>
    </div>
  );
}