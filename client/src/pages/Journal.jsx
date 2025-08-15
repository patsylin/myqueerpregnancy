export default function MyJournal() {
  return (
    <div className="card">
      <h2>My Journal</h2>
      <p>Not wired yet.</p>
    </div>
  );
}
// import { useEffect, useState } from "react";

// // Component displays a form to create a journal entry and lists past entries
// const MyJournal = () => {
//   const [newContent, setNewContent] = useState("");
//   const [entries, setEntries] = useState([]);

//   // fetch existing journal entries on mount
//   const fetchEntries = async () => {
//     try {
//       const response = await fetch("/api/journal");
//       const data = await response.json();
//       setEntries(data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchEntries();
//   }, []);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       await fetch("/api/journal", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ text: newContent }),
//       });
//       setNewContent("");
//       fetchEntries();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="my-journal-container">
//       <div className="journal-box">
//         <h2 className="centered-text">My Journal</h2>
//         <form onSubmit={handleSubmit}>
//           <label htmlFor="Journal"></label>
//           <br />
//           <textarea
//             value={newContent}
//             onChange={(event) => setNewContent(event.target.value)}
//           />
//           <button type="submit">Submit</button>
//         </form>
//         <div
//           className="journal-entries"
//           style={{ maxHeight: "300px", overflowY: "auto", marginTop: "1rem" }}
//         >
//           {entries.map((entry) => (
//             <div key={entry.id} className="journal-entry">
//               <strong>{new Date(entry.created_at).toLocaleDateString()}</strong>
//               <p>{entry.content}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyJournal;
