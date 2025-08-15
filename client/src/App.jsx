import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";

// Page-level views
import Home from "./pages/Home.jsx";
import Rights from "./pages/Rights.jsx";
import JournalList from "./pages/JournalList.jsx";
import JournalForm from "./pages/JournalForm.jsx";

// Feature components
import LoginForm from "./components/LoginForm.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import MyJournal from "./components/MyJournal.jsx";
import About from "./components/About.jsx";

export default function App() {
  return (
    <div className="app">
      <NavBar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rights" element={<Rights />} />

          <Route path="/journal" element={<JournalList />} />
          <Route path="/journal/new" element={<JournalForm />} />
          <Route path="/my-journal" element={<MyJournal />} />

          <Route path="/about" element={<About />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
