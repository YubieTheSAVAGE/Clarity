import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="app-layout">
      <header className="app-header">
        <h1 className="app-title">Clarity</h1>
        <nav className="app-nav">
          <NavLink to="/app" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Dashboard
          </NavLink>
          <NavLink to="/app/transactions" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Transactions
          </NavLink>
        </nav>
        <div className="app-user">
          <span>{user?.email}</span>
          <button type="button" onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>
      <main className="app-main">
        <Outlet key={location.pathname} />
      </main>
    </div>
  );
}
