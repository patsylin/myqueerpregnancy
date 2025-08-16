// client/src/pages/WeekView.jsx
import { useState } from "react";
import WeekSizeCard from "../components/WeekSizeCard";

export default function WeekView() {
  const [week, setWeek] = useState(20);
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <label>
        Pick a week:{" "}
        <input
          type="number"
          min={4}
          max={40}
          value={week}
          onChange={(e) => setWeek(Number(e.target.value))}
          style={{ width: 80 }}
        />
      </label>
      <WeekSizeCard week={week} />
    </div>
  );
}
