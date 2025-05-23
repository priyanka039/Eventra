import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useParams } from 'react-router-dom'
import './App.css'

// Main App Component with Routes
function App() {
  // Using state to track if user is logged in and their role
  const [loggedIn, setLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('')
  // Added user state to store user information
  const [currentUser, setCurrentUser] = useState({
    id: '',
    name: '',
    email: '',
    registrations: []
  })
  
  // Store all events in the app state
  const [events, setEvents] = useState([
    { 
      id: 1, 
      title: "Tech Workshop", 
      date: "May 25, 2025", 
      time: "2:00 PM - 4:00 PM",
      location: "Engineering Building, Room 101",
      organizer: "CS Club",
      description: "Learn about the latest technologies and tools in web development.",
      attendees: []
    },
    { 
      id: 2, 
      title: "Music Festival", 
      date: "June 2, 2025", 
      time: "5:00 PM - 10:00 PM",
      location: "Campus Amphitheater",
      organizer: "Music Society",
      description: "A night of live performances featuring talented student musicians.",
      attendees: []
    },
    { 
      id: 3, 
      title: "Career Fair", 
      date: "June 10, 2025", 
      time: "10:00 AM - 4:00 PM",
      location: "Student Union Building",
      organizer: "Career Services",
      description: "Connect with potential employers and explore career opportunities.",
      attendees: []
    }
  ])

  // Login handler function - to be passed to LoginPage
  const handleSuccessfulLogin = (user, role) => {
    setLoggedIn(true)
    setUserRole(role)
    setCurrentUser({
      id: Date.now().toString(), // Simple ID generation for demo
      name: user.name || 'User',
      email: user.email,
      registrations: []
    })
  }

  // Logout handler function
  const handleLogout = () => {
    setLoggedIn(false)
    setUserRole('')
    setCurrentUser({
      id: '',
      name: '',
      email: '',
      registrations: []
    })
  }

  // Registration handler function
  const handleEventRegistration = (eventId, registrationData) => {
    // Add the registration to user's list
    const updatedUser = {
      ...currentUser,
      registrations: [
        ...currentUser.registrations,
        { 
          eventId,
          ...registrationData,
          registrationDate: new Date().toISOString()
        }
      ]
    }
    setCurrentUser(updatedUser)
    
    // Add user to event's attendees list
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          attendees: [
            ...event.attendees || [],
            {
              userId: currentUser.id,
              name: currentUser.name,
              ...registrationData
            }
          ]
        }
      }
      return event
    })
    setEvents(updatedEvents)
    
    return updatedUser.registrations.find(reg => reg.eventId === eventId)
  }

  // Handle event feedback submission
  const handleFeedbackSubmission = (eventId, feedbackData) => {
    // In a real app, you would send this to the backend
    console.log("Feedback submitted for event", eventId, feedbackData)
    
    // Update the user's registration to include feedback
    const updatedRegistrations = currentUser.registrations.map(reg => {
      if (reg.eventId === eventId) {
        return {
          ...reg,
          feedback: feedbackData
        }
      }
      return reg
    })
    
    setCurrentUser({
      ...currentUser,
      registrations: updatedRegistrations
    })
  }

  // Handle event cancellation
  const handleCancelRegistration = (eventId) => {
    // Remove registration from user
    const updatedRegistrations = currentUser.registrations.filter(
      reg => reg.eventId !== eventId
    )
    
    setCurrentUser({
      ...currentUser,
      registrations: updatedRegistrations
    })
    
    // Remove user from event attendees
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          attendees: event.attendees.filter(
            attendee => attendee.userId !== currentUser.id
          )
        }
      }
      return event
    })
    
    setEvents(updatedEvents)
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
              <StudentHomepage 
                currentUser={currentUser} 
                events={events.filter(event => 
                  currentUser.registrations.some(reg => reg.eventId === event.id)
                )} 
                onLogout={handleLogout}
              /> : 
              <Navigate to="/" replace />
          } />
          <Route path="/president-homepage" element={
            loggedIn && userRole === 'president' ? 
              <PresidentHomepage onLogout={handleLogout} /> : 
              <Navigate to="/" replace />
          } />
          <Route path="/management-homepage" element={
            loggedIn && userRole === 'management' ? 
              <ManagementHomepage onLogout={handleLogout} /> : 
              <Navigate to="/" replace />
          } />
          <Route path="/discover-events" element={
            loggedIn ? 
              <DiscoverEvents 
                events={events} 
                userRegistrations={currentUser.registrations} 
                onLogout={handleLogout}
              /> : 
              <Navigate to="/" replace />
          } />
          <Route path="/event-details/:eventId" element={
            loggedIn ? 
              <EventDetails 
                events={events} 
                currentUser={currentUser}
                onRegister={handleEventRegistration} 
                onCancelRegistration={handleCancelRegistration}
              /> : 
              <Navigate to="/" replace />
          } />
          <Route path="/register-event/:eventId" element={
            loggedIn ? 
              <RegisterEvent 
                events={events} 
                currentUser={currentUser}
                onRegister={handleEventRegistration} 
              /> : 
              <Navigate to="/" replace />
          } />
          <Route path="/my-registrations" element={
            loggedIn ? 
              <MyRegistrations 
                registrations={currentUser.registrations} 
                events={events} 
                onCancelRegistration={handleCancelRegistration}
                onLogout={handleLogout}
              /> : 
              <Navigate to="/" replace />
          } />
          <Route path="/feedback/:eventId" element={
            loggedIn ? 
              <SubmitFeedback 
                events={events}
                currentUser={currentUser}
                registrations={currentUser.registrations}
                onSubmitFeedback={handleFeedbackSubmission}
              /> : 
              <Navigate to="/" replace />
          } />
        </Routes>
      </div>
    </Router>
  )
}

// Login Page Component
function LoginPage({ onLoginSuccess }) {
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
function SignupPage() {
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

// Student Homepage Component
function StudentHomepage({ currentUser, events, onLogout }) {
  const navigate = useNavigate()
  
  return (
    <div className="homepage-container">
      <header className="header">
        <h1>Welcome to Eventra</h1>
        <nav className="nav">
          <button onClick={() => navigate('/discover-events')} className="nav-button">
            Discover Events
          </button>
          <button onClick={() => navigate('/my-registrations')} className="nav-button">
            My Registrations
          </button>
          <button onClick={onLogout} className="nav-button logout">
            Logout
          </button>
        </nav>
      </header>
      
      <main className="main-content">
        <section className="welcome-section">
          <h2>Hello, {currentUser.name}!</h2>
          <p>Welcome to your Eventra dashboard. Discover and participate in exciting events happening around your campus!</p>
        </section>
        
        <section className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button onClick={() => navigate('/discover-events')} className="action-button">
              Browse Events
            </button>
            <button onClick={() => navigate('/my-registrations')} className="action-button">
              My Registrations
            </button>
          </div>
        </section>
        
        <section className="upcoming-events">
          <h3>Your Upcoming Events</h3>
          <div className="events-list">
            {events.length > 0 ? (
              <div className="registered-events-grid">
                {events.map(event => (
                  <div key={event.id} className="event-card">
                    <h3>{event.title}</h3>
                    <p><strong>Date:</strong> {event.date}</p>
                    <p><strong>Time:</strong> {event.time}</p>
                    <p><strong>Location:</strong> {event.location}</p>
                    <div className="event-actions">
                      <button 
                        onClick={() => navigate(`/event-details/${event.id}`)} 
                        className="event-button"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => navigate(`/feedback/${event.id}`)} 
                        className="event-button secondary"
                      >
                        Submit Feedback
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-events">
                <p>You haven't registered for any events yet.</p>
                <button 
                  onClick={() => navigate('/discover-events')} 
                  className="action-button discover-btn"
                >
                  Discover Events
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2025 Eventra - Your Campus Event Management System</p>
      </footer>
    </div>
  )
}

// President Homepage Component (Enhanced implementation)
function PresidentHomepage({ onLogout }) {
  const navigate = useNavigate()
  
  return (
    <div className="homepage-container">
      <header className="header">
        <h1>President Dashboard</h1>
        <nav className="nav">
          <button onClick={onLogout} className="nav-button logout">
            Logout
          </button>
        </nav>
      </header>
      <main className="main-content">
        <section className="welcome-section">
          <h2>Welcome, Club President!</h2>
          <p>Here you can manage your club's events and track participation.</p>
        </section>
        
        <section className="quick-actions">
          <h3>President Functions</h3>
          <div className="action-buttons">
            <button className="action-button">
              Create New Event
            </button>
            <button className="action-button">
              Manage Events
            </button>
            <button className="action-button">
              View Analytics
            </button>
          </div>
        </section>
        
        <div className="placeholder-message">
          <p>President functionality is under development. Please check back later.</p>
        </div>
      </main>
      
      <footer className="footer">
        <p>© 2025 Eventra - Your Campus Event Management System</p>
      </footer>
    </div>
  )
}

// Management Homepage Component (Enhanced implementation)
function ManagementHomepage({ onLogout }) {
  const navigate = useNavigate()
  
  return (
    <div className="homepage-container">
      <header className="header">
        <h1>Management Dashboard</h1>
        <nav className="nav">
          <button onClick={onLogout} className="nav-button logout">
            Logout
          </button>
        </nav>
      </header>
      <main className="main-content">
        <section className="welcome-section">
          <h2>Welcome, Management Staff!</h2>
          <p>Here you can oversee all campus events, clubs, and activities.</p>
        </section>
        
        <section className="quick-actions">
          <h3>Management Functions</h3>
          <div className="action-buttons">
            <button className="action-button">
              All Events
            </button>
            <button className="action-button">
              Manage Clubs
            </button>
            <button className="action-button">
              Generate Reports
            </button>
          </div>
        </section>
        
        <div className="placeholder-message">
          <p>Management functionality.</p>
        </div>
      </main>
      
      <footer className="footer">
        <p>© 2025 Eventra - Your Campus Event Management System</p>
      </footer>
    </div>
  )
}

// Discover Events Component
function DiscoverEvents({ events, userRegistrations, onLogout }) {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  
  // Filter events based on search term
  const filteredEvents = events.filter(event => {
    return event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           event.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
           event.description.toLowerCase().includes(searchTerm.toLowerCase())
  })
  
  return (
    <div className="discover-container">
      <header className="header">
        <h1>Discover Events</h1>
        <nav className="nav">
          <button onClick={() => navigate('/student-homepage')} className="nav-button">
            Dashboard
          </button>
          <button onClick={() => navigate('/my-registrations')} className="nav-button">
            My Registrations
          </button>
          <button onClick={onLogout} className="nav-button logout">
            Logout
          </button>
        </nav>
      </header>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search events by title, organizer, or description..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <main className="events-grid">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => {
            const isRegistered = userRegistrations.some(reg => reg.eventId === event.id)
            
            return (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Time:</strong> {event.time}</p>
                <p><strong>Organizer:</strong> {event.organizer}</p>
                <p className="event-short-desc">{event.description.substring(0, 80)}...</p>
                <div className="event-actions">
                  <button 
                    onClick={() => navigate(`/event-details/${event.id}`)} 
                    className="event-button"
                  >
                    View Details
                  </button>
                  {isRegistered ? (
                    <div className="registered-badge">Registered</div>
                  ) : (
                    <button 
                      onClick={() => navigate(`/register-event/${event.id}`)} 
                      className="event-button secondary"
                    >
                      Register Now
                    </button>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="no-events-message">
            <p>No events match your search criteria.</p>
          </div>
        )}
      </main>
      
      <footer className="footer">
        <p>© 2025 Eventra - Your Campus Event Management System</p>
      </footer>
    </div>
  )
}

// Event Details Component
function EventDetails({ events, currentUser, onRegister, onCancelRegistration }) {
  const navigate = useNavigate()
  const { eventId } = useParams()
  const eventIdNum = parseInt(eventId)
  
  // Find the event data
  const event = events.find(e => e.id === eventIdNum)
  
  // Check if user is already registered
  const registration = currentUser.registrations.find(
    reg => reg.eventId === eventIdNum
  )
  const isRegistered = !!registration
  
  if (!event) {
    return (
      <div className="not-found-container">
        <h2>Event Not Found</h2>
        <p>Sorry, we couldn't find the event you're looking for.</p>
        <button onClick={() => navigate('/discover-events')} className="action-button">
          Return to Events
        </button>
      </div>
    )
  }
  
  const handleCancelRegistration = () => {
    if (window.confirm("Are you sure you want to cancel your registration?")) {
      onCancelRegistration(eventIdNum)
      alert("Your registration has been cancelled.")
    }
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
          <p><strong>Attendees:</strong> {event.attendees ? event.attendees.length : 0}</p>
        </div>
        
        <div className="event-description">
          <h3>Description</h3>
          <p>{event.description}</p>
        </div>
        
        {isRegistered ? (
          <div className="registration-actions">
            <div className="registered-message">You are registered for this event</div>
            <div className="action-buttons">
              <button 
                onClick={() => navigate(`/feedback/${event.id}`)} 
                className="feedback-button"
              >
                Submit Feedback
              </button>
              <button 
                onClick={handleCancelRegistration} 
                className="cancel-button"
              >
                Cancel Registration
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => navigate(`/register-event/${event.id}`)} 
            className="rsvp-button"
          >
            Register for Event
          </button>
        )}
      </main>
      
      <footer className="footer">
        <p>© 2025 Eventra - Your Campus Event Management System</p>
      </footer>
    </div>
  )
}

function RegisterEvent({ events, currentUser, onRegister }) {
  const navigate = useNavigate()
  const { eventId } = useParams()
  const eventIdNum = parseInt(eventId)
  
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    rollNumber: '',
    course: '',
    year: '',
    phoneNumber: '',
    dietaryRequirements: '',
    specialRequests: '',
    acceptedTerms: false
  })
  
  const [errors, setErrors] = useState({})
  
  // Find the event data
  const event = events.find(e => e.id === eventIdNum)
  
  if (!event) {
    return (
      <div className="not-found-container">
        <h2>Event Not Found</h2>
        <p>Sorry, we couldn't find the event you're looking for.</p>
        <button onClick={() => navigate('/discover-events')} className="action-button">
          Return to Events
        </button>
      </div>
    )
  }
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
    
    // Clear errors for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      })
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.rollNumber) newErrors.rollNumber = 'Roll number is required'
    if (!formData.course) newErrors.course = 'Course is required'
    if (!formData.year) newErrors.year = 'Year of study is required'
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required'
    else if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Please enter a valid 10-digit phone number'
    if (!formData.acceptedTerms) newErrors.acceptedTerms = 'You must accept the terms to register'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    // Remove the acceptedTerms field before sending data
    const { acceptedTerms, ...registrationData } = formData
    
    // Submit registration data
    const registration = onRegister(eventIdNum, registrationData)
    
    // Show success message
    alert(`You have successfully registered for ${event.title}!`)
    
    // Navigate to registrations page
    navigate('/my-registrations')
  }
  
  return (
    <div className="registration-container">
      <header className="header">
        <h1>Event Registration</h1>
        <nav className="nav">
          <button onClick={() => navigate(`/event-details/${eventId}`)} className="nav-button">
            Back to Event
          </button>
          <button onClick={() => navigate('/student-homepage')} className="nav-button">
            Dashboard
          </button>
        </nav>
      </header>
      
      <main className="registration-content">
        <h2>Register for: {event.title}</h2>
        <p className="event-date">{event.date} • {event.time}</p>
        <p className="event-location">{event.location}</p>
        
        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="rollNumber">Roll Number</label>
            <input
              type="text"
              id="rollNumber"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleInputChange}
              className={`input ${errors.rollNumber ? 'input-error' : ''}`}
              required
            />
            {errors.rollNumber && <p className="error-text">{errors.rollNumber}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="course">Course</label>
            <input
              type="text"
              id="course"
              name="course"
              value={formData.course}
              onChange={handleInputChange}
              className={`input ${errors.course ? 'input-error' : ''}`}
              required
            />
            {errors.course && <p className="error-text">{errors.course}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="year">Year of Study</label>
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className={`input ${errors.year ? 'input-error' : ''}`}
              required
            >
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              <option value="5+">5+ Year</option>
            </select>
            {errors.year && <p className="error-text">{errors.year}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={`input ${errors.phoneNumber ? 'input-error' : ''}`}
              required
              placeholder="10-digit phone number"
            />
            {errors.phoneNumber && <p className="error-text">{errors.phoneNumber}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="dietaryRequirements">Dietary Requirements (Optional)</label>
            <select
              id="dietaryRequirements"
              name="dietaryRequirements"
              value={formData.dietaryRequirements}
              onChange={handleInputChange}
              className="input"
            >
              <option value="">None</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="gluten-free">Gluten-Free</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="specialRequests">Special Requests (Optional)</label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              className="input textarea"
              placeholder="Any special accommodations or requests"
              rows="3"
            ></textarea>
          </div>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="acceptedTerms"
              name="acceptedTerms"
              checked={formData.acceptedTerms}
              onChange={handleInputChange}
              className="checkbox-input"
            />
            <label htmlFor="acceptedTerms" className="checkbox-label">
              I agree to the terms and conditions for this event
            </label>
            {errors.acceptedTerms && <p className="error-text">{errors.acceptedTerms}</p>}
          </div>
          
          <button type="submit" className="submit-button">Register for Event</button>
        </form>
      </main>
      
      <footer className="footer">
        <p>© 2025 Eventra - Your Campus Event Management System</p>
      </footer>
    </div>
  )
}

// MyRegistrations Component (enhanced)
function MyRegistrations({ registrations, events, onCancelRegistration, onLogout }) {
  const navigate = useNavigate()
  
  // Find full event details for each registration
  const registeredEvents = registrations.map(reg => {
    const event = events.find(e => e.id === reg.eventId)
    return {
      ...reg,
      eventDetails: event
    }
  })
  
  const handleCancelRegistration = (eventId) => {
    if (window.confirm("Are you sure you want to cancel your registration?")) {
      onCancelRegistration(eventId)
      alert("Your registration has been cancelled successfully.")
    }
  }
  
  return (
    <div className="my-registrations-container">
      <header className="header">
        <h1>My Registrations</h1>
        <nav className="nav">
          <button onClick={() => navigate('/student-homepage')} className="nav-button">
            Dashboard
          </button>
          <button onClick={() => navigate('/discover-events')} className="nav-button">
            Discover Events
          </button>
          <button onClick={onLogout} className="nav-button logout">
            Logout
          </button>
        </nav>
      </header>
      
      <main className="registrations-content">
        <h2>Your Registered Events</h2>
        
        {registeredEvents.length > 0 ? (
          <div className="registered-events-grid">
            {registeredEvents.map(reg => (
              <div key={reg.eventId} className="registration-card">
                <div className="event-header">
                  <h3>{reg.eventDetails.title}</h3>
                  <span className="registration-date">
                    Registered on: {new Date(reg.registrationDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="event-details">
                  <p><strong>Date:</strong> {reg.eventDetails.date}</p>
                  <p><strong>Time:</strong> {reg.eventDetails.time}</p>
                  <p><strong>Location:</strong> {reg.eventDetails.location}</p>
                </div>
                
                <div className="registration-details">
                  <p><strong>Roll Number:</strong> {reg.rollNumber}</p>
                  <p><strong>Course:</strong> {reg.course}</p>
                  <p><strong>Year:</strong> {reg.year}</p>
                </div>
                
                <div className="registration-actions">
                  <button 
                    onClick={() => navigate(`/event-details/${reg.eventId}`)} 
                    className="action-button details-btn"
                  >
                    View Event
                  </button>
                  <button 
                    onClick={() => navigate(`/feedback/${reg.eventId}`)} 
                    className="action-button feedback-btn"
                  >
                    {reg.feedback ? 'Update Feedback' : 'Submit Feedback'}
                  </button>
                  <button 
                    onClick={() => handleCancelRegistration(reg.eventId)} 
                    className="action-button cancel-btn"
                  >
                    Cancel Registration
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-registrations">
            <p>You haven't registered for any events yet.</p>
            <button 
              onClick={() => navigate('/discover-events')} 
              className="action-button discover-btn"
            >
              Discover Events
            </button>
          </div>
        )}
      </main>
      
      <footer className="footer">
        <p>© 2025 Eventra - Your Campus Event Management System</p>
      </footer>
    </div>
  )
}

// Submit Feedback Component (enhanced)
function SubmitFeedback({ events, currentUser, registrations, onSubmitFeedback }) {
  const navigate = useNavigate()
  const { eventId } = useParams()
  const eventIdNum = parseInt(eventId)
  
  const [rating, setRating] = useState(5)
  const [feedback, setFeedback] = useState('')
  const [enjoyment, setEnjoyment] = useState('yes')
  const [improvements, setImprovements] = useState('')
  const [error, setError] = useState('')
  
  // Find the event data
  const event = events.find(e => e.id === eventIdNum)
  
  // Find the registration for this event
  const registration = registrations.find(reg => reg.eventId === eventIdNum)
  
  // Check if user has already provided feedback and pre-fill the form
  useEffect(() => {
    if (registration && registration.feedback) {
      const { rating, feedback, enjoyment, improvements } = registration.feedback
      setRating(rating || 5)
      setFeedback(feedback || '')
      setEnjoyment(enjoyment || 'yes')
      setImprovements(improvements || '')
    }
  }, [registration])
  
  if (!event) {
    return (
      <div className="not-found-container">
        <h2>Event Not Found</h2>
        <p>Sorry, we couldn't find the event you're looking for.</p>
        <button onClick={() => navigate('/student-homepage')} className="action-button">
          Return to Dashboard
        </button>
      </div>
    )
  }
  
  if (!registration) {
    return (
      <div className="not-registered-container">
        <h2>Not Registered</h2>
        <p>You need to be registered for this event to provide feedback.</p>
        <button onClick={() => navigate(`/event-details/${eventId}`)} className="action-button">
          View Event Details
        </button>
      </div>
    )
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!feedback) {
      setError('Please provide some feedback about the event')
      return
    }
    
    // Submit feedback data
    const feedbackData = {
      rating,
      feedback,
      enjoyment,
      improvements,
      submittedAt: new Date().toISOString()
    }
    
    onSubmitFeedback(eventIdNum, feedbackData)
    
    // Show success message
    alert('Thank you for your feedback!')
    
    // Navigate back to student homepage
    navigate('/student-homepage')
  }
  
  return (
    <div className="feedback-container">
      <header className="header">
        <h1>Event Feedback</h1>
        <nav className="nav">
          <button onClick={() => navigate('/student-homepage')} className="nav-button">
            Dashboard
          </button>
          <button onClick={() => navigate('/my-registrations')} className="nav-button">
            My Registrations
          </button>
        </nav>
      </header>
      
      <main className="feedback-content">
        <h2>Provide Feedback for: {event.title}</h2>
        <p className="event-details">{event.date} • {event.time} • {event.location}</p>
        
        <form className="feedback-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          
          <div className="form-group">
            <label>Overall Rating</label>
            <div className="rating-container">
              <input
                type="range"
                min="1"
                max="10"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="rating-slider"
              />
              <span className="rating-value">{rating}/10</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="feedback">What did you think of the event?</label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="input textarea"
              placeholder="Share your thoughts about the event..."
              rows="4"
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label>Did you enjoy the event?</label>
            <div className="radio-group">
              <div className="radio-option">
                <input
                  type="radio"
                  id="enjoyYes"
                  name="enjoyment"
                  value="yes"
                  checked={enjoyment === 'yes'}
                  onChange={() => setEnjoyment('yes')}
                />
                <label htmlFor="enjoyYes">Yes</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="enjoyNo"
                  name="enjoyment"
                  value="no"
                  checked={enjoyment === 'no'}
                  onChange={() => setEnjoyment('no')}
                />
                <label htmlFor="enjoyNo">No</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="enjoyNeutral"
                  name="enjoyment"
                  value="neutral"
                  checked={enjoyment === 'neutral'}
                  onChange={() => setEnjoyment('neutral')}
                />
                <label htmlFor="enjoyNeutral">Neutral</label>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="improvements">What could be improved?</label>
            <textarea
              id="improvements"
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              className="input textarea"
              placeholder="Suggestions for improvement..."
              rows="3"
            ></textarea>
          </div>
          
          <button type="submit" className="submit-button">
            {registration.feedback ? 'Update Feedback' : 'Submit Feedback'}
          </button>
        </form>
      </main>
      
      <footer className="footer">
        <p>© 2025 Eventra - Your Campus Event Management System</p>
      </footer>
    </div>
  )
}

export default App;