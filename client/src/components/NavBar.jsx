import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext"; // 👈 now point at your unified AuthContext
import { useState } from "react";

export default function NavBar() {
  const { user, logout } = useAuth(); // 👈 use logout from context
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  async function handleLogout() {
    setBusy(true);
    await logout(); // 👈 clears cookie + context
    setBusy(false);
    nav("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Left links */}
        <nav className="flex gap-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-lg font-medium ${
                isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/rights"
            className={({ isActive }) =>
              `text-lg font-medium ${
                isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
              }`
            }
          >
            Rights
          </NavLink>
          <NavLink
            to="/journal"
            className={({ isActive }) =>
              `text-lg font-medium ${
                isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
              }`
            }
          >
            Journal
          </NavLink>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-gray-600">
              Welcome, {user.username}
            </span>
          )}
          {user && (
            <button
              onClick={handleLogout}
              disabled={busy}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full
                         border border-gray-300 bg-transparent text-gray-700 text-sm font-medium
                         hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Log out"
            >
              {busy ? "Logging out…" : "Logout"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
