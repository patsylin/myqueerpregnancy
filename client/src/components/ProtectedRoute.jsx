import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading)
    return (
      <main>
        <p>Loading…</p>
      </main>
    );
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}
