import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// Login Page Component
export function LoginPage({ onLoginSuccess }) {
  const [role, setRole] = useState('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    
    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }
    
    console.log("Login with role:", role, "Email:", email)
    
    // Create a user object to pass to the login handler
    const user = {
      email,
      name: email.split('@')[0] // Simple demo - extract name from email
    }
    
    // Call the onLoginSuccess prop to update the App state
    onLoginSuccess(user, role)
    
    // Navigate based on role
    if (role === 'student') {
      navigate('/student-homepage')
    } else if (role === 'president') {
      navigate('/president-homepage')
    } else if (role === 'management') {
      navigate('/management-homepage')
    }
  }

  return (
    <div className="form-container">
      <h1 className="title">Eventra</h1>
      <h2 className="subtitle">Login</h2>

      <form className="form" onSubmit={handleLogin}>
        {error && <p className="error-message">{error}</p>}
        <input 
          className="input" 
          type="email" 
          placeholder="Email" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          className="input" 
          type="password" 
          placeholder="Password" 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        <button type="submit" className="button">Login</button>
        <p className="switch-to-signup">
          Don't have an account? <Link to="/signup" className="link">Sign up</Link>
        </p>
      </form>
    </div>
  )
}

// Signup Page Component
export function SignupPage() {
  const [role, setRole] = useState('student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSignup = (e) => {
    e.preventDefault()
    setError('')
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill out all fields')
      return
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    console.log("Signup with role:", role, "Name:", name, "Email:", email)
    
    // Here you would typically register the user with a backend
    // After successful signup, navigate to the login page
    navigate('/')
  }

  return (
    <div className="form-container">
      <h1 className="title">Eventra</h1>
      <h2 className="subtitle">Sign Up</h2>

      <form className="form" onSubmit={handleSignup}>
        {error && <p className="error-message">{error}</p>}
        <input 
          className="input" 
          type="text" 
          placeholder="Name" 
          required 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input 
          className="input" 
          type="email" 
          placeholder="Email" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          className="input" 
          type="password" 
          placeholder="Password" 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input 
          className="input" 
          type="password" 
          placeholder="Confirm Password" 
          required 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        <button type="submit" className="button">Sign Up</button>
        <p className="switch-to-login">
          Already have an account? <Link to="/" className="link">Login</Link>
        </p>
      </form>
    </div>
  )
} 