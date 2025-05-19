// src/App.jsx
import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import './App.css'

// Main App Component with Routes
function App() {
  // Using state to track if user is logged in and their role
  const [loggedIn, setLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('')

  // Login handler function - to be passed to LoginPage
  const handleSuccessfulLogin = (role) => {
    setLoggedIn(true)
    setUserRole(role)
  }

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={
            <LoginPage onLoginSuccess={handleSuccessfulLogin} />
          } />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/student-homepage" element={
            loggedIn && userRole === 'student' ? 
              <StudentHomepage /> : 
              <Navigate to="/" replace />
          } />
          <Route path="/president-homepage" element={
            loggedIn && userRole === 'president' ? 
              <PresidentHomepage /> : 
              <Navigate to="/" replace />
          } />
          <Route path="/management-homepage" element={
            loggedIn && userRole === 'management' ? 
              <ManagementHomepage /> : 
              <Navigate to="/" replace />
          } />
          <Route path="/discover-events" element={<DiscoverEvents />} />
          <Route path="/event-details/:eventId" element={<EventDetails />} />
          <Route path="/feedback/:eventId" element={<SubmitFeedback />} />
        </Routes>
      </div>
    </Router>
  )
}

// Separate Components for each route

// Login Page Component
function LoginPage({ onLoginSuccess }) {
  const [role, setRole] = useState('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    console.log("Login with role:", role, "Email:", email)
    
    // Call the onLoginSuccess prop to update the App state
    onLoginSuccess(role)
    
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
function SignupPage() {
  const [role, setRole] = useState('student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSignup = (e) => {
    e.preventDefault()
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

// Student Homepage Component
function StudentHomepage() {
  const navigate = useNavigate()
  
  return (
    <div className="homepage-container">
      <header className="header">
        <h1>Welcome to Eventra</h1>
        <nav className="nav">
          <button onClick={() => navigate('/discover-events')} className="nav-button">
            Discover Events
          </button>
          <button onClick={() => navigate('/')} className="nav-button logout">
            Logout
          </button>
        </nav>
      </header>
      
      <main className="main-content">
        <section className="welcome-section">
          <h2>Hello, Student!</h2>
          <p>Welcome to your Eventra dashboard. Discover and participate in exciting events happening around your campus!</p>
        </section>
        
        <section className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button onClick={() => navigate('/discover-events')} className="action-button">
              Browse Events
            </button>
            <button onClick={() => {}} className="action-button">
              My Registrations
            </button>
          </div>
        </section>
        
        <section className="upcoming-events">
          <h3>Your Upcoming Events</h3>
          <div className="events-list">
            <p>You haven't registered for any events yet.</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2025 Eventra - Your Campus Event Management System</p>
      </footer>
    </div>
  )
}

// President Homepage Component (Basic implementation)
function PresidentHomepage() {
  const navigate = useNavigate()
  
  return (
    <div className="homepage-container">
      <header className="header">
        <h1>President Dashboard</h1>
        <button onClick={() => navigate('/')} className="nav-button logout">
          Logout
        </button>
      </header>
      <main className="main-content">
        <h2>Welcome, Club President!</h2>
        <p>Here you can manage your club's events.</p>
      </main>
    </div>
  )
}

// Management Homepage Component (Basic implementation)
function ManagementHomepage() {
  const navigate = useNavigate()
  
  return (
    <div className="homepage-container">
      <header className="header">
        <h1>Management Dashboard</h1>
        <button onClick={() => navigate('/')} className="nav-button logout">
          Logout
        </button>
      </header>
      <main className="main-content">
        <h2>Welcome, Management Staff!</h2>
        <p>Here you can oversee all campus events and activities.</p>
      </main>
    </div>
  )
}

// Discover Events Component
function DiscoverEvents() {
  const navigate = useNavigate()
  
  // Mock event data
  const events = [
    { id: 1, title: "Tech Workshop", date: "May 25, 2025", organizer: "CS Club" },
    { id: 2, title: "Music Festival", date: "June 2, 2025", organizer: "Music Society" },
    { id: 3, title: "Career Fair", date: "June 10, 2025", organizer: "Career Services" }
  ]
  
  return (
    <div className="discover-container">
      <header className="header">
        <h1>Discover Events</h1>
        <nav className="nav">
          <button onClick={() => navigate('/student-homepage')} className="nav-button">
            Dashboard
          </button>
          <button onClick={() => navigate('/')} className="nav-button logout">
            Logout
          </button>
        </nav>
      </header>
      
      <main className="events-grid">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <h3>{event.title}</h3>
            <p>Date: {event.date}</p>
            <p>Organizer: {event.organizer}</p>
            <button 
              onClick={() => navigate(`/event-details/${event.id}`)} 
              className="event-button"
            >
              View Details
            </button>
          </div>
        ))}
      </main>
    </div>
  )
}

// Event Details Component
function EventDetails() {
  const navigate = useNavigate()
  
  // In a real app, you would get the eventId from useParams and fetch the event details
  const event = { 
    id: 1, 
    title: "Tech Workshop", 
    date: "May 25, 2025", 
    time: "2:00 PM - 4:00 PM",
    location: "Engineering Building, Room 101",
    organizer: "CS Club",
    description: "Learn about the latest technologies and tools in web development."
  }
  
  const handleRSVP = () => {
    // In a real app, you would send the RSVP to your backend
    alert("You've successfully registered for this event!")
    navigate('/student-homepage')
  }
  
  return (
    <div className="event-details-container">
      <header className="header">
        <h1>Event Details</h1>
        <nav className="nav">
          <button onClick={() => navigate('/discover-events')} className="nav-button">
            Back to Events
          </button>
          <button onClick={() => navigate('/student-homepage')} className="nav-button">
            Dashboard
          </button>
        </nav>
      </header>
      
      <main className="event-details">
        <h2>{event.title}</h2>
        <div className="event-info">
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Time:</strong> {event.time}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Organizer:</strong> {event.organizer}</p>
        </div>
        
        <div className="event-description">
          <h3>Description</h3>
          <p>{event.description}</p>
        </div>
        
        <button onClick={handleRSVP} className="rsvp-button">
          Register for Event
        </button>
      </main>
    </div>
  )
}

// Submit Feedback Component
function SubmitFeedback() {
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState('')
  const [rating, setRating] = useState(5)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, you would send this feedback to your backend
    alert("Thank you for your feedback!")
    navigate('/student-homepage')
  }
  
  return (
    <div className="feedback-container">
      <header className="header">
        <h1>Event Feedback</h1>
        <button onClick={() => navigate('/student-homepage')} className="nav-button">
          Dashboard
        </button>
      </header>
      
      <main className="feedback-content">
        <h2>Share Your Experience</h2>
        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="rating-container">
            <label>Rate this event (1-5):</label>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={rating} 
              onChange={(e) => setRating(e.target.value)} 
              className="rating-slider"
            />
            <span className="rating-value">{rating}</span>
          </div>
          
          <div className="feedback-text-container">
            <label>Your feedback:</label>
            <textarea 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="feedback-text"
              placeholder="Tell us what you thought about this event..."
              rows="5"
            ></textarea>
          </div>
          
          <button type="submit" className="submit-button">
            Submit Feedback
          </button>
        </form>
      </main>
    </div>
  )
}

export default App