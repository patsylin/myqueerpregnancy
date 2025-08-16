import { useEffect, useState } from "react";
import { getSizeByWeek } from "../lib/api";

export default function WeekSizeCard({ week }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        setData(await getSizeByWeek(week));
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, [week]);

  if (err) return <div role="alert">Whoops: {err}</div>;
  if (!data) return <div>Loading week {week} size…</div>;

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 14, opacity: 0.7 }}>Week {data.week}</div>
      <h3 style={{ margin: 0 }}>{data.item}</h3>
      <p style={{ margin: 0 }}>{data.short_desc}</p>
      {data.approx_length_cm && (
        <p style={{ margin: 0, fontSize: 14 }}>
          approx length: {data.approx_length_cm} cm
        </p>
      )}
      <img
        src={data.img}
        alt={`${data.item} size illustration for week ${data.week}`}
        style={{
          width: "100%",
          maxWidth: 360,
          height: "auto",
          borderRadius: 8,
        }}
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
    </div>
  );
}
