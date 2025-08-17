// client/src/pages/Rights.jsx
import { useEffect, useState } from "react";
import { STATE_NAMES } from "../constants/states";
import { fmtTally, fmtPercent } from "../lib/format";
import { rightsAll, rightsByState } from "../lib/api.js";

const STATE_CODES = Object.keys(STATE_NAMES);

export default function Rights() {
  const [loading, setLoading] = useState(true);
  const [stateCode, setStateCode] = useState(""); // "" = all states
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  const load = async (code = "") => {
    try {
      setLoading(true);
      setErr("");
      const res = code ? await rightsByState(code) : await rightsAll();
      setData(res);
    } catch (e) {
      setErr("Failed to load rights data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    const code = e.target.value;
    setStateCode(code);
    load(code);
  };

  return (
    <main>
      <h1>Know Your Rights</h1>

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          margin: "12px 0",
        }}
      >
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

      {loading && <p>Loading…</p>}
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      {!loading && !err && data && (
        <section style={{ display: "grid", gap: 12 }}>
          {/* Example render: adjust to your API shape */}
          {"summary" in data && (
            <div
              style={{
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <h2 style={{ marginTop: 0 }}>Summary</h2>
              <p>Total states tracked: {fmtTally(data.summary?.states)}</p>
              <p>
                Parentage protections:{" "}
                {fmtPercent(data.summary?.parentageProtectedPct)}
              </p>
              <p>
                Abortion access: {fmtPercent(data.summary?.abortionAccessPct)}
              </p>
            </div>
          )}

          {"states" in data && Array.isArray(data.states) && (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: "#fff",
                }}
              >
                <thead>
                  <tr>
                    <th style={th}>State</th>
                    <th style={th}>Parentage</th>
                    <th style={th}>Abortion</th>
                    <th style={th}>Sources</th>
                  </tr>
                </thead>
                <tbody>
                  {data.states.map((s) => (
                    <tr key={s.code}>
                      <td style={td}>
                        {s.code} — {STATE_NAMES[s.code] || s.name}
                      </td>
                      <td style={td}>{s.parentage || "—"}</td>
                      <td style={td}>{s.abortion || "—"}</td>
                      <td style={td}>
                        {Array.isArray(s.sources)
                          ? s.sources.map((u, i) => (
                              <a
                                key={i}
                                href={u}
                                target="_blank"
                                rel="noreferrer"
                              >
                                [{i + 1}]{" "}
                              </a>
                            ))
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

const th = {
  textAlign: "left",
  borderBottom: "1px solid #eee",
  padding: "8px",
};
const td = {
  borderBottom: "1px solid #f2f2f2",
  padding: "8px",
  verticalAlign: "top",
};
