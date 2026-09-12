import { CATEGORIES, SUBSCRIPTION_PLANS } from "../_constants/mockData";
import { ServiceCategoryIcon } from "./service-category-icon";


export function Footer({ onNavigate }) {
  return (
    <footer className="bg-[var(--pitch)] text-white border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--amber)] flex items-center justify-center">
                <ServiceCategoryIcon category="sports" className="w-4 h-4 stroke-white" />
              </div>
              <span className="mp-display text-xl">OmniReserve</span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Multi-category venue and space booking platform with per-reservation subscriptions.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--amber)] mb-3">Categories</h4>
            <ul className="space-y-2 text-xs text-white/70">
              {CATEGORIES.slice(1, 5).map(c => (
                <li key={c.key}>
                  <button onClick={() => onNavigate(c.key)} className="hover:text-white transition-colors">
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--amber)] mb-3">Subscriptions</h4>
            <ul className="space-y-2 text-xs text-white/70">
              {SUBSCRIPTION_PLANS.map(p => (
                <li key={p.id}>{p.name}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--amber)] mb-3">Support & Legal</h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>Help Center</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs text-white/50 gap-4">
          <div>© {new Date().getFullYear()} OmniReserve Inc. All rights reserved.</div>
          <div className="flex gap-4">
            <span>Twitter</span>
            <span>Instagram</span>
            <span>LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}