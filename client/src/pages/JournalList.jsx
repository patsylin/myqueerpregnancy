export default function JournalList() {
  return (
    <div className="card">
      <h2>Journal</h2>
      <p>Coming soon: list of entries and a link to create a new one.</p>
    </div>
  );
}
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// export default function JournalList() {
//   const [entries, setEntries] = useState([]);

//   useEffect(() => {
//     const raw = localStorage.getItem("journalEntries");
//     setEntries(raw ? JSON.parse(raw) : []);
//   }, []);

//   return (
//     <div className="card">
//       <h2>Journal</h2>
//       {entries.length === 0 ? (
//         <p>
//           No entries yet. <Link to="/journal/new">Write your first entry</Link>.
//         </p>
//       ) : (
//         <div style={{ display: "grid", gap: 12 }}>
//           {entries.map((e) => (
//             <article key={e.id} className="card">
//               <h3 style={{ marginTop: 0 }}>{e.title || "Untitled"}</h3>
//               <small style={{ color: "var(--muted)" }}>
//                 {new Date(e.date).toLocaleString()}
//               </small>
//               <p>{e.body}</p>
//               {e.tags?.length ? (
//                 <p>
//                   <strong>Tags:</strong> {e.tags.join(", ")}
//                 </p>
//               ) : null}
//             </article>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
