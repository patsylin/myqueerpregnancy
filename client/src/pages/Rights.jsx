import { useEffect, useState } from "react";
import { API } from "../lib/api";
import { STATE_NAMES } from "../constants/states";
import { fmtTally, fmtPercent } from "../lib/format";

const STATE_CODES = Object.keys(STATE_NAMES);

export default function Rights() {
  const [states, setStates] = useState(STATE_CODES);
  const [stateCode, setStateCode] = useState("CA");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/rights`);
        const json = await res.json();
        if (json?.ok && Array.isArray(json.states)) setStates(json.states);
      } catch {
        /* fallback already set */
      }
    })();
  }, []);

  async function fetchRights(code) {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`${API}/api/rights/${code}`);
      const json = await res.json();
      if (!res.ok || json?.ok === false)
        throw new Error(json?.message || "Failed to load");
      setData(json);
    } catch (e) {
      setErr(e.message || "Error fetching rights");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRights(stateCode);
  }, [stateCode]);

  const lastUpdated = data?.lastUpdated
    ? new Date(data.lastUpdated).toLocaleString()
    : "—";
  const parentageLink =
    data?.links?.find((l) => /lgbtmap\.org/i.test(l.url)) || null;
  const abortionLink =
    data?.links?.find((l) => /reproductiverights\.org/i.test(l.url)) || null;

  return (
    <div className="card">
      <h2>Know Your Rights</h2>
      <p style={{ color: "var(--muted)", marginTop: -8 }}>
        Snapshot info only—verify with the linked sources.
      </p>

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <label htmlFor="state">State</label>
        <select
          id="state"
          value={stateCode}
          onChange={(e) => setStateCode(e.target.value)}
        >
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button onClick={() => fetchRights(stateCode)} disabled={loading}>
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {err ? (
        <p style={{ color: "crimson" }}>{err}</p>
      ) : (
        <>
          <h3 style={{ marginBottom: 0 }}>
            {STATE_NAMES[stateCode] || stateCode}
          </h3>
          <p style={{ color: "var(--muted)", marginTop: 4 }}>
            Last updated: {lastUpdated}
          </p>

          <section style={{ display: "grid", gap: 12 }}>
            <article className="card">
              <h3 style={{ marginTop: 0 }}>
                {parentageLink ? (
                  <a href={parentageLink.url} target="_blank" rel="noreferrer">
                    Parentage
                  </a>
                ) : (
                  "Parentage"
                )}
              </h3>
              <p style={{ fontSize: 14 }}>
                <strong>Percent of LGBTQ Adults (25+) Raising Children:</strong>{" "}
                {fmtPercent(data?.parentage_children_pct) ?? "—"}
              </p>
              <p>{data?.parentage_summary ?? "No snapshot available yet."}</p>
              <p style={{ fontSize: 14, color: "var(--muted)" }}>
                Overall Tally:{" "}
                {data?.parentage_tally ? (
                  <>
                    <strong>{fmtTally(data.parentage_tally)}</strong>{" "}
                    <span
                      style={{
                        fontWeight: "bold",
                        color:
                          {
                            Negative: "crimson",
                            Low: "goldenrod",
                            Fair: "#ddd",
                            Medium: "lightgreen",
                            High: "green",
                          }[data.parentage_tally.level] || "inherit",
                      }}
                    >
                      {data.parentage_tally.level}
                    </span>
                  </>
                ) : (
                  "—"
                )}
              </p>
            </article>

            <article className="card">
              <h3 style={{ marginTop: 0 }}>
                {abortionLink ? (
                  <a href={abortionLink.url} target="_blank" rel="noreferrer">
                    Abortion Access
                  </a>
                ) : (
                  "Abortion Access"
                )}
              </h3>
              <p>{data?.abortion_summary ?? "No snapshot available yet."}</p>
            </article>

            {!!(data?.links && data.links.length) && (
              <article className="card">
                <h3 style={{ marginTop: 0 }}>Resources</h3>
                <ul>
                  {data.links.map((l, i) => (
                    <li key={i}>
                      <a href={l.url} target="_blank" rel="noreferrer">
                        {l.label || l.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
            )}
          </section>
        </>
      )}
    </div>
  );
}
