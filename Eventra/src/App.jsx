// src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>
    </Router>
  )
}

function LoginPage() {
  const [role, setRole] = React.useState('student')

  const handleLogin = (e) => {
    e.preventDefault()
    console.log("Login with role:", role)
    // Add login logic here
  }

  return (
    <div className="form-container">
      <h1 className="title">Eventra</h1>
      <h2 className="subtitle">Login</h2>

      <form className="form" onSubmit={handleLogin}>
        <input className="input" type="email" placeholder="Email" required />
        <input className="input" type="password" placeholder="Password" required />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="input">
          <option value="student">Student</option>
          <option value="president">President</option>
          <option value="management">Management</option>
        </select>
        <button type="submit" className="button">Login</button>
        <p className="switch-to-signup">
          Don’t have an account? <Link to="/signup" className="link">Sign up</Link>
        </p>
      </form>
    </div>
  )
}

function SignupPage() {
  const [role, setRole] = React.useState('student')

  const handleSignup = (e) => {
    e.preventDefault()
    console.log("Signup with role:", role)
    // Add signup logic here
  }

  return (
    <div className="form-container">
      <h1 className="title">Eventra</h1>
      <h2 className="subtitle">Sign Up</h2>

      <form className="form" onSubmit={handleSignup}>
        <input className="input" type="text" placeholder="Name" required />
        <input className="input" type="email" placeholder="Email" required />
        <input className="input" type="password" placeholder="Password" required />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="input">
          <option value="student">Student</option>
          <option value="president">President</option>
          <option value="management">Management</option>
        </select>
        <button type="submit" className="button">Sign Up</button>
        <p className="switch-to-login">
          Already have an account? <Link to="/" className="link">Login</Link>
        </p>
      </form>
    </div>
  )
}

export default App;
