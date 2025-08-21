import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth.jsx";

export default function NavBar() {
  const nav = useNavigate();
  const { user, logout } = useAuth();

  // style callback for active links
  const link = ({ isActive }) => ({
    padding: "8px 10px",
    borderRadius: 8,
    background: isActive ? "rgba(0,0,0,.06)" : "transparent",
  });

  return (
    <header className="nav">
      <div className="nav-inner">
        {/* left side nav links */}
        <nav style={{ display: "flex", gap: 12 }}>
          <NavLink style={link} to="/">Home</NavLink>
          <NavLink style={link} to="/journal">Journal</NavLink>
          <NavLink style={link} to="/rights">Rights</NavLink>
        </nav>

        {/* right side auth actions */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
          {user ? (
            <>
              <span className="muted">Hi, {user.username}</span>
              <button
                className="btn"
                onClick={async () => {
                  await logout();
                  nav("/");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink style={link} to="/login">Login</NavLink>
              <NavLink className="btn" to="/register">Register</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
