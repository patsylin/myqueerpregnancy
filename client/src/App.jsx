// client/src/App.jsx
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Journal from "./pages/Journal.jsx";
import Rights from "./pages/Rights.jsx";
// ❌ removed WeekView (Sizes) and DueDateOnboarding imports

// Show NavBar only when authenticated
function AuthedLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

// Guests-only gate: if already logged in, bounce to Home
function GuestOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null; // or a spinner
  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ----- Public (guests only) ----- */}
          <Route
            path="/login"
            element={
              <GuestOnlyRoute>
                <Login />
              </GuestOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestOnlyRoute>
                <Register />
              </GuestOnlyRoute>
            }
          />

          {/* ----- Authed only (with NavBar) ----- */}
          <Route
            element={
              <ProtectedRoute>
                <AuthedLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/rights" element={<Rights />} />
            <Route path="/journal" element={<Journal />} />
          </Route>

          {/* ----- Fallback ----- */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
