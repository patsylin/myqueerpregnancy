export default function JournalForm() {
  return (
    <div className="card">
      <h2>New Journal Entry</h2>
      <p>Form goes here (we’ll wire the API after the pages are stable).</p>
    </div>
  );
}
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function JournalForm() {
//   const nav = useNavigate();
//   const [title, setTitle] = useState("");
//   const [body, setBody] = useState("");
//   const [tags, setTags] = useState("");

//   function save() {
//     const raw = localStorage.getItem("journalEntries");
//     const next = raw ? JSON.parse(raw) : [];
//     next.unshift({
//       id: crypto.randomUUID(),
//       title,
//       body,
//       tags: tags
//         .split(",")
//         .map((t) => t.trim())
//         .filter(Boolean),
//       date: new Date().toISOString(),
//     });
//     localStorage.setItem("journalEntries", JSON.stringify(next));
//     nav("/journal");
//   }

//   return (
//     <div className="card">
//       <h2>New Entry</h2>
//       <div style={{ display: "grid", gap: 12 }}>
//         <label>
//           Title
//           <input
//             placeholder="Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//         </label>
//         <label>
//           Body
//           <textarea
//             rows={8}
//             placeholder="What’s on your mind?"
//             value={body}
//             onChange={(e) => setBody(e.target.value)}
//           />
//         </label>
//         <label>
//           Tags (comma-separated)
//           <input
//             placeholder="e.g. nausea, joy, appointment"
//             value={tags}
//             onChange={(e) => setTags(e.target.value)}
//           />
//         </label>
//         <button className="button" onClick={save}>
//           Save
//         </button>
//       </div>
//     </div>
//   );
// }
