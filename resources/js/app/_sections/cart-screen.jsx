import { CATEGORY_COLORS } from "../_constants/mockData";

export function CartScreen({ cart, onRemoveCartItem, onCheckout, onGo }) {

  // Calculate total price using base_price from backend venue data
  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      const price = parseFloat(item.venue?.base_price || item.finalPrice || 0);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
  };

  return (
    <div className="screen-anim max-w-4xl mx-auto px-6 py-10 flex-1 w-full">
      <button onClick={() => onGo("home")} className="text-sm font-bold text-[var(--ink-dim)] mb-6 hover:text-[var(--pitch)]">
        ← Continue Browsing
      </button>
      <h1 className="mp-display text-3xl text-[var(--pitch)] mb-6">Reservation Cart</h1>

      {cart.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[var(--line-dark)]">
          <p className="text-[var(--ink-dim)] mb-4">Your cart is currently empty.</p>
          <button onClick={() => onGo("home")} className="px-6 py-3 bg-[var(--pitch)] text-white font-bold rounded-xl text-sm">
            Explore Spaces
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map(item => {
            const itemPrice = parseFloat(item.venue?.base_price || item.finalPrice || 0);

            return (
              <div key={item.key} className="bg-white rounded-2xl border border-[var(--line-dark-strong)] p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded text-white" style={{ background: CATEGORY_COLORS[item.venue?.category?.name] || "var(--amber)" }}>
                    {item.venue?.category?.name}
                  </span>
                  <h3 className="mp-display text-lg text-[var(--pitch)] mt-1">{item.venue?.name}</h3>
                  <div className="text-xs text-[var(--ink-dim)]">
                    {item.dateLabel} • {item.hour}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="mp-display text-xl text-[var(--pitch)]">
                      ${itemPrice.toFixed(2)}
                      <span className="text-xs font-normal text-gray-500"> / {item.venue?.unit_label || "slot"}</span>
                    </span>
                  </div>
                  <button onClick={() => onRemoveCartItem(item.key)} className="text-red-500 font-bold text-xs hover:underline">
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          <div className="bg-white rounded-3xl p-6 border border-[var(--line-dark-strong)] mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-xs text-[var(--ink-dim)] block">Total Amount</span>
              <span className="mp-display text-3xl text-[var(--pitch)]">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
            <button onClick={onCheckout} className="w-full sm:w-auto px-8 py-3.5 bg-[var(--pitch)] text-white font-bold rounded-xl shadow-lg hover:scale-105">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}