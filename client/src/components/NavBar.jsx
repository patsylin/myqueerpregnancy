import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth.jsx";
import { useState } from "react";

export default function NavBar() {
  const { user, setUser } = useAuth();
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  // This NavBar is only rendered when authed (per App.jsx ProtectedRoute),
  // so no Login/Register links are included.
  async function handleLogout() {
    try {
      setBusy(true);
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
    } finally {
      setUser(null);
      nav("/login", { replace: true });
      setBusy(false);
    }
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/rights">Rights</NavLink>
          <NavLink to="/journal">Journal</NavLink>
        </div>

        <div className="nav-links">
          {user && (
            <span className="navbar-welcome">Welcome, {user.username}</span>
          )}
          <button
            onClick={handleLogout}
            disabled={busy}
            className="button button-outline logout-btn"
            aria-label="Log out"
          >
            {busy ? "Logging out…" : "Logout"}
          </button>
        </div>
      </div>
    </header>
  );
}
