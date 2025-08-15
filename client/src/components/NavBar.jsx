import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  textDecoration: "none",
  padding: "6px 10px",
  borderRadius: 6,
  fontWeight: 600,
  border: isActive ? "1px solid #ccc" : "1px solid transparent",
});

export default function NavBar() {
  return (
    <nav
      style={{
        display: "flex",
        gap: 12,
        padding: 12,
        borderBottom: "1px solid #eee",
      }}
    >
      <NavLink to="/" style={linkStyle}>
        Home
      </NavLink>
      <NavLink to="/rights" style={linkStyle}>
        Know Your Rights
      </NavLink>
      <NavLink to="/journal" style={linkStyle}>
        Journal
      </NavLink>
    </nav>
  );
}
// import React from "react";
// import { Link, useNavigate } from "react-router-dom";

// const NavBar = ({ user, setUser }) => {
//   const navigate = useNavigate();
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     navigate("/");
//   };

//   return (
//     <div className="navbar">
//       <div className="left-box">
//         <p className="app-title">My Queer Pregnancy App</p>
//         <nav className="nav-links">
//           {user ? (
//             <>
//               <Link to="/" className="nav-link">
//                 Home
//               </Link>
//               <Link to="/journal" className="nav-link">
//                 My Journal
//               </Link>
//               <Link to="/states-rights" className="nav-link">
//                 States Rights
//               </Link>
//             </>
//           ) : (
//             <>
//               <Link to="/" className="nav-link">
//                 Login
//               </Link>
//               <Link to="/register" className="nav-link">
//                 Register
//               </Link>
//             </>
//           )}
//         </nav>
//       </div>
//       <div className="right-box">
//         {user ? (
//           <div>

//             <button onClick={handleLogout} className="logout-button">
//               Logout
//             </button>
//           </div>
//         ) : (
//           <h1>Please log in</h1>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NavBar;
