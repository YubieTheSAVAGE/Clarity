import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../ui";

export function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      {/* Top navbar */}
      <header className="app-navbar">
        <h1 className="app-logo">Clarity</h1>

        {/* Desktop sidebar nav - same row as logo on large screens */}
        <nav className="app-nav-desktop">
          <NavLink to="/app" end className={({ isActive }) => `app-nav-link ${isActive ? "active" : ""}`}>
            Dashboard
          </NavLink>
          <NavLink to="/app/transactions" className={({ isActive }) => `app-nav-link ${isActive ? "active" : ""}`}>
            Transactions
          </NavLink>
        </nav>

        {/* User menu */}
        <div className="app-user-area">
          <button
            type="button"
            className="app-user-trigger"
            onClick={() => setUserMenuOpen((o) => !o)}
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
          >
            <span className="app-user-email">{user?.email}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {userMenuOpen && (
            <>
              <div className="app-user-backdrop" onClick={() => setUserMenuOpen(false)} aria-hidden="true" />
              <div className="app-user-dropdown">
                <span className="app-user-dropdown-email">{user?.email}</span>
                <Button variant="secondary" size="sm" onClick={() => { logout(); setUserMenuOpen(false); }}>
                  Logout
                </Button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main content + sidebar on desktop */}
      <div className="app-body">
        <aside className="app-sidebar">
          <nav className="app-sidebar-nav">
            <NavLink to="/app" end className={({ isActive }) => `app-sidebar-link ${isActive ? "active" : ""}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              Dashboard
            </NavLink>
            <NavLink to="/app/transactions" className={({ isActive }) => `app-sidebar-link ${isActive ? "active" : ""}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Transactions
            </NavLink>
          </nav>
        </aside>

        <main className="app-main">
          <Outlet key={location.pathname} />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="app-bottom-nav">
        <NavLink to="/app" end className={({ isActive }) => `app-bottom-link ${isActive ? "active" : ""}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/app/transactions" className={({ isActive }) => `app-bottom-link ${isActive ? "active" : ""}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Transactions</span>
        </NavLink>
      </nav>
    </div>
  );
}
