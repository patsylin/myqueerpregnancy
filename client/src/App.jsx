import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Journal from "./pages/Journal.jsx";
import Rights from "./pages/Rights.jsx";
import WeekView from "./pages/WeekView.jsx";
import DueDateOnboarding from "./pages/DueDateOnboarding.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rights" element={<Rights />} />
          <Route path="/sizes" element={<WeekView />} />

          {/* public auth routes (hide in Nav when logged in; still routable) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* onboarding */}
          <Route path="/onboarding/due-date" element={<DueDateOnboarding />} />

          {/* protected */}
          <Route
            path="/journal"
            element={
              <ProtectedRoute>
                <Journal />
              </ProtectedRoute>
            }
          />

          {/* catch‑all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
