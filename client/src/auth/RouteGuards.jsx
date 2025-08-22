import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

export function RequireAuth() {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return null; // or a spinner
  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: loc }} />
  );
}

export function RedirectIfAuthed() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : <Outlet />;
}
