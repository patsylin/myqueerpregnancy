// client/src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
export default function Home() {
  const { user } = useAuth(); // { id, username } after login
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE || "/api"}/weeks/current`,
          { credentials: "include" }
        );

        if (res.status === 401) {
          nav("/login", { replace: true, state: { from: { pathname: "/" } } });
          return;
        }

        const body = await res.json();

        if (res.status === 404 && body?.error === "NO_DUE_DATE") {
          nav("/onboarding/due-date", { replace: true });
          return;
        }

        if (!res.ok) throw new Error(body?.message || "Failed to load data");
        if (!cancelled) setData(body);
      } catch (e) {
        if (!cancelled) setErr(e.message || "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [nav]);

  if (loading) return <div className="container">Loading…</div>;
  if (err) return <div className="container error-text">{err}</div>;
  if (!data) return null;

  return (
    <div className="centered-container">
      <h1>Welcome{user?.username ? `, ${user.username}` : ""}!</h1>

      <div className="card" style={{ textAlign: "center", maxWidth: 640 }}>
        <h2 style={{ marginTop: 0 }}>Week {data.week}</h2>
        <p className="centered-text" style={{ fontSize: 18 }}>
          Your little one is the size of <strong>{data.item}</strong>.
        </p>

        {data.description && (
          <p style={{ marginTop: 12 }}>{data.description}</p>
        )}

        <dl
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 8,
            textAlign: "left",
          }}
        >
          <dt>Category</dt>
          <dd>{data.category ?? "—"}</dd>
          <dt>Approx length (mm)</dt>
          <dd>{data.lengthMm ?? "—"}</dd>
          <dt>Approx weight (g)</dt>
          <dd>{data.weightG ?? "—"}</dd>
          <dt>Due date</dt>
          <dd>{data.dueDate}</dd>
        </dl>
      </div>
    </div>
  );
}
