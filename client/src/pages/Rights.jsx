import { useEffect, useState } from "react";
import { STATE_NAMES } from "../constants/states";
import { fmtTally, fmtPercent } from "../lib/format";
import { rightsAll, rightsByState } from "../lib/api.js";

const STATE_CODES = Object.keys(STATE_NAMES);

export default function Rights() {
  const [loading, setLoading] = useState(true);
  const [stateCode, setStateCode] = useState("");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  const load = async (code = "") => {
    try {
      setLoading(true);
      setErr("");
      const res = code ? await rightsByState(code) : await rightsAll();
      setData(res);
    } catch {
      setErr("Failed to load rights data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onChange = (e) => {
    const code = e.target.value;
    setStateCode(code);
    load(code);
  };

  return (
    <main className="container">
      <h1>Know Your Rights</h1>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="state-filter" style={{ display: "grid", gap: 8, maxWidth: 420 }}>
          <label htmlFor="state">Filter by state:</label>
          <select id="state" value={stateCode} onChange={onChange}>
            <option value="">All states</option>
            {STATE_CODES.map((c) => (
              <option key={c} value={c}>
                {c} — {STATE_NAMES[c]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p>Loading…</p>}
      {err && <p className="error-text">{err}</p>}

      {!loading && !err && data && (
        <>
          {"summary" in data && (
            <div className="card" style={{ marginBottom: 16 }}>
              <h2>Summary</h2>
              <p>Total states tracked: {fmtTally(data.summary?.states)}</p>
              <p>Parentage protections: {fmtPercent(data.summary?.parentageProtectedPct)}</p>
              <p>Abortion access: {fmtPercent(data.summary?.abortionAccessPct)}</p>
            </div>
          )}

          {"states" in data && Array.isArray(data.states) && (
            <div className="card table-scroll">
              <table className="rights-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>State</th>
                    <th>Parentage</th>
                    <th>Abortion</th>
                    <th>Sources</th>
                  </tr>
                </thead>
                <tbody>
                  {data.states.map((s) => (
                    <tr key={s.code}>
                      <td>{s.code} — {STATE_NAMES[s.code] || s.name}</td>
                      <td>{s.parentage || "—"}</td>
                      <td>{s.abortion || "—"}</td>
                      <td>
                        {Array.isArray(s.sources)
                          ? s.sources.map((u, i) => (
                              <a key={i} href={u} target="_blank" rel="noreferrer">[{i + 1}] </a>
                            ))
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </main>
  );
}
