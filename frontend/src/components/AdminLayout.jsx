import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="min-h-screen bg-purple-50/50 font-sans md:flex">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-purple-100 bg-white px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={() => setMenuAberto((aberto) => !aberto)}
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
          aria-controls="menu-admin"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-100 text-slate-700 transition hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
        >
          {menuAberto ? (
            <X size={20} aria-hidden="true" />
          ) : (
            <Menu size={20} aria-hidden="true" />
          )}
        </button>

        <Link
          to="/dashboard-admin"
          onClick={() => setMenuAberto(false)}
          className="flex min-w-0 items-center gap-2"
        >
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white"
            aria-hidden="true"
          >
            ♥
          </span>
          <span className="truncate text-sm font-bold tracking-wide text-slate-900">
            AcolheMulher
          </span>
        </Link>
      </header>

      {menuAberto && (
        <button
          type="button"
          onClick={() => setMenuAberto(false)}
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
        />
      )}

      <Sidebar
        id="menu-admin"
        aberto={menuAberto}
        aoFechar={() => setMenuAberto(false)}
      />

      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
