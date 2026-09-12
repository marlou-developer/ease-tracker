export function ToastStack({ toasts }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="toast-anim px-5 py-3 rounded-2xl bg-[var(--pitch)] text-white text-sm font-semibold shadow-2xl flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[var(--amber)] animate-ping" />
          {t.msg}
        </div>
      ))}
    </div>
  );
}