import { forwardRef } from "react";

export const SigninModal = forwardRef(({ onSignIn }, ref) => {
  return (
    <dialog ref={ref} className="mp-dialog">
      <div className="p-8">
        <h3 className="mp-display text-2xl mb-2 text-[var(--pitch)]">Sign In</h3>
        <p className="text-sm text-[var(--ink-dim)] mb-6">Access your subscription rates & express checkout.</p>
        <input
          type="text"
          placeholder="Enter your name..."
          onKeyDown={e => {
            if (e.key === "Enter" && e.target.value.trim()) {
              onSignIn(e.target.value.trim());
              ref.current?.close();
            }
          }}
          className="w-full px-4 py-3 rounded-xl border border-[var(--line-dark-strong)] mb-4 text-sm outline-none focus:ring-2 ring-[var(--amber)]"
        />
        <button
          onClick={() => ref.current?.close()}
          className="w-full py-3 bg-[var(--pitch)] text-white font-bold rounded-xl text-sm"
        >
          Done
        </button>
      </div>
    </dialog>
  );
});