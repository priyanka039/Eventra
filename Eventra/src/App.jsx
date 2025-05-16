
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

export default function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>
    </Router>
  )
}

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(() => localStorage.getItem('role') || 'student')

  const handleLogin = (e) => {
    e.preventDefault()

    axios.post('http://localhost:3001/login', {email,password})
    .then(result=> {console.log(result)
      if(result.data === "Success"){
        navigate('/')
      }
  })
  .catch(err => console.log(err));

    
  }

  return (
    <div className="form-container">
      <h1 className="title">Eventra</h1>
      <h2 className="subtitle">Login</h2>

      <form className="form" onSubmit={handleLogin}>
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="input"
        >
          <option value="student">Student</option>
          <option value="president">President</option>
          <option value="management">Management</option>
        </select>

        <button type="submit" className="button">
          Login
        </button>
        <p className="switch-to-signup">
          Don’t have an account?{' '}
          <Link to="/signup" className="link">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}

function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const navigate = useNavigate()

  const handleSignup = (e) => {
    e.preventDefault()

    axios.post('http://localhost:3001/signup', {name,email,password, role})
    .then(result=> console.log(result));
    navigate('/login');
  }

  return (
    <div className="form-container">
      <h1 className="title">Eventra</h1>
      <h2 className="subtitle">Sign Up</h2>

      <form className="form" onSubmit={handleSignup}>
        <input
          className="input"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="input"
        >
          <option value="student">Student</option>
          <option value="president">President</option>
          <option value="management">Management</option>
        </select>

        <button type="submit" className="button">
          Sign Up
        </button>
        <p className="switch-to-login">
          Already have an account?{' '}
          <Link to="/login" className="link">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}
