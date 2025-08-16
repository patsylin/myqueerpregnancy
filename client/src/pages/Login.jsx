import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth.jsx";
import { useState } from "react";

export default function Login() {
  const { login, error } = useAuth();
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from?.pathname || "/journal";

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await login({ username, password });
    if (res.ok) nav(from, { replace: true });
  };

  return (
    <main>
      <h1>Log in</h1>
      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 12, maxWidth: 360 }}
      >
        <input
          value={username}
          onChange={(e) => setU(e.target.value)}
          placeholder="Username"
        />
        <input
          value={password}
          onChange={(e) => setP(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <button>Log in</button>
        {error && <div style={{ color: "crimson" }}>{error}</div>}
      </form>
    </main>
  );
}

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const LoginForm = ({ setUser }) => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await response.json();
//       console.log(response);
//       if (data.ok) {
//         if (data.token) {
//           localStorage.setItem("token", data.token);
//           setUser(data.user);
//           navigate("/");
//         }
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="login-form-container">
//       <form onSubmit={handleSubmit}>
//         <label htmlFor="Username">Username</label>
//         <br />
//         <input
//           type="text"
//           value={username}
//           onChange={(event) => setUsername(event.target.value)}
//         />
//         <br />
//         <label htmlFor="Password">Password</label>
//         <br />
//         <input
//           type="password"
//           value={password}
//           onChange={(event) => setPassword(event.target.value)}
//         />

//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default LoginForm;
