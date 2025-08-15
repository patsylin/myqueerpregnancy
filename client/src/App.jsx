import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import HomePage from './components/HomePage'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import MyJournal from './components/MyJournal'
import './App.css'

function App() {
  const [user, setUser] = useState(null)

  return (
    <Router>
      <div className="App">
        <NavBar user={user} setUser={setUser} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm setUser={setUser} />} />
            <Route path="/register" element={<RegisterForm setUser={setUser} />} />
            <Route path="/journal" element={<MyJournal user={user} />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App