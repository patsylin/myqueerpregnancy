import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth.jsx";

export default function NavBar() {
  const nav = useNavigate();
  const { user, logout } = useAuth();
  const link = ({ isActive }) => ({
    padding: "8px 10px",
    borderRadius: 8,
    background: isActive ? "#eee" : "transparent",
  });

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "#fff",
        borderBottom: "1px solid #e6e6e6",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "10px 16px",
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <NavLink style={link} to="/">
          Home
        </NavLink>
        <NavLink style={link} to="/journal">
          Journal
        </NavLink>
        <NavLink style={link} to="/rights">
          Rights
        </NavLink>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          {user ? (
            <>
              <span style={{ opacity: 0.7 }}>Hi, {user.username}</span>
              <button
                onClick={async () => {
                  await logout();
                  nav("/");
                }}
                style={{ padding: "6px 10px" }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink style={link} to="/login">
                Login
              </NavLink>
              <NavLink style={link} to="/register">
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
