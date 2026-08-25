import type { ReactNode } from "react";

export function Shell({ children, onHome }: { children: ReactNode; onHome?: () => void }) {
  return <main className="app-shell">
    <header className="brand" onClick={onHome} role={onHome ? "button" : undefined} tabIndex={onHome ? 0 : undefined}>
      <img className="brand-logo" src="./logo.svg" alt="" /><span>Devoiro</span>
    </header>
    {children}
  </main>;
}

export function BackButton({ onClick, label = "Retour" }: { onClick(): void; label?: string }) {
  return <button className="back-button" onClick={onClick}>← {label}</button>;
}
