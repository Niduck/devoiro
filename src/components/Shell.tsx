import type { ReactNode } from "react";

export function Shell({ children, onHome }: { children: ReactNode; onHome?: () => void }) {
  return <main className="app-shell">
    <header className="brand" onClick={onHome} role={onHome ? "button" : undefined} tabIndex={onHome ? 0 : undefined}>
      <span className="brand-mark" aria-hidden="true">D</span><span>Devoiro</span>
    </header>
    {children}
  </main>;
}

export function BackButton({ onClick, label = "Retour" }: { onClick(): void; label?: string }) {
  return <button className="back-button" onClick={onClick}>← {label}</button>;
}
