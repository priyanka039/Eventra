import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { getAuthToken } from '../../utils/auth'
import { useToast } from '../../App'
import { FaUserCircle } from 'react-icons/fa'

// Student Homepage Component
export function StudentHomepage({ currentUser, events, userRegistrations, onLogout }) {
  const navigate = useNavigate()
  const showToast = useToast()
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  
  // Fetch notifications for the logged-in student
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`http://localhost:5273/api/notifications/user/${currentUser.id}`, {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        })
        const data = await res.json()
        if (Array.isArray(data)) {
          setNotifications(data)
        } else if (data.success && Array.isArray(data.data)) {
          setNotifications(data.data)
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err)
      }
    }
    if (currentUser.id) fetchNotifications()
  }, [currentUser.id])

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`http://localhost:5273/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        body: JSON.stringify({ read: true })
      })
      setNotifications(notifications => notifications.map(n => n._id === notificationId ? { ...n, read: true } : n))
    } catch (err) {
      // ignore
    }
  }

  // Registered events for this user
  const registeredEventIds = userRegistrations.map(reg => reg.eventId._id)
  const registeredEvents = userRegistrations.map(reg => reg.eventId)
  const availableEvents = events.filter(event => event.status === 'approved' || event.status === 'live')

  return (
    <div className="homepage-container">
      <header className="header">
        <div style={{display:'flex',alignItems:'center',gap:'1.5rem'}}>
          <h1 style={{margin:0}}>Eventra</h1>
        </div>
        <nav className="nav" style={{gap:'0.5rem'}}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="nav-button"
            style={{
              borderRadius:'999px',
              padding:'0.5em 1.3em',
              background:'#23272f',
              color:'#8be9fd',
              fontWeight:700,
              fontSize:'1.08em',
              border:'none',
              outline: showNotifications ? '2px solid #8be9fd' : 'none',
              boxShadow: showNotifications ? '0 0 0 2px #8be9fd' : 'none',
              transition:'box-shadow 0.2s',
              cursor:'pointer',
              display:'flex',
              alignItems:'center',
              gap:'0.6em',
              letterSpacing:'0.01em',
              position:'relative'
            }}
            aria-label="Notifications"
            tabIndex={0}
            onBlur={() => setShowNotifications(false)}
          >
            Notifications
            {notifications.filter(n => !n.read).length > 0 && (
              <span style={{
                marginLeft:'0.5em',
                background:'#ff5555',
                color:'#fff',
                borderRadius:'999px',
                fontSize:'0.9em',
                padding:'0.1em 0.7em',
                fontWeight:700,
                boxShadow:'0 1px 4px #0006',
                minWidth:'1.7em',
                textAlign:'center',
                display:'inline-block'
              }}>{notifications.filter(n => !n.read).length}</span>
            )}
          </button>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="nav-button"
            style={{
              borderRadius:'50%',
              width:44,
              height:44,
              background:'#23272f',
              color:'#8be9fd',
              fontWeight:700,
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              boxShadow: showProfile ? '0 0 0 2px #8be9fd' : 'none',
              transition:'box-shadow 0.2s',
              border:'none',
              outline: showProfile ? '2px solid #8be9fd' : 'none',
              cursor:'pointer',
              fontSize:'1.2em',
              overflow:'visible'
            }}
            aria-label="Profile"
            tabIndex={0}
            onBlur={() => setShowProfile(false)}
          >
            {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
          </button>
        </nav>
        {showProfile && (
          <div style={{position:'absolute',top:'60px',right:'20px',background:'#23272f',color:'#fff',padding:'1.2rem',borderRadius:'12px',zIndex:1000,minWidth:'240px',boxShadow:'0 2px 16px #000a',fontSize:'1.08em',border:'1.5px solid #444'}}>
            <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1rem'}}>
              <div style={{background:'#8be9fd',borderRadius:'50%',width:54,height:54,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2em',fontWeight:700,color:'#23272f',boxShadow:'0 2px 8px #0003'}}>
                <FaUserCircle size={36} />
              </div>
              <div>
                <div style={{fontWeight:700,fontSize:'1.13em',color:'#fff'}}>{currentUser.name}</div>
                <div style={{fontSize:'0.97em',color:'#aaa'}}>{currentUser.email}</div>
              </div>
            </div>
            <div style={{borderTop:'1px solid #444',margin:'0.7rem 0'}}></div>
            <div style={{marginBottom:'0.7rem',fontStyle:'italic',color:'#8be9fd'}}>🌟 Welcome back, {currentUser.name?.split(' ')[0] || 'User'}! Ready for your next event?</div>
            <button onClick={onLogout} className="nav-button logout" style={{width:'100%',marginBottom:'0.5rem'}}>Logout</button>
            <button onClick={()=>setShowProfile(false)} style={{width:'100%'}}>Close</button>
          </div>
        )}
        {showNotifications && (
          <div className="notification-panel" style={{position:'absolute',top:'60px',right:'80px',background:'#23272f',color:'#fff',padding:'1rem',borderRadius:'10px',zIndex:1000,minWidth:'320px',maxWidth:'400px',boxShadow:'0 2px 16px #000a',border:'1.5px solid #444'}}>
            <h3 style={{marginTop:0}}>Notifications</h3>
            {notifications.length === 0 ? <p>No notifications.</p> : (
              <ul style={{listStyle:'none',padding:0}}>
                {notifications.map(n => (
                  <li key={n._id} style={{marginBottom:'1rem',background:n.read?'#333':'#444',padding:'0.5rem',borderRadius:'6px'}}>
                    <div>{n.message}</div>
                    <div style={{fontSize:'0.8em',color:'#aaa'}}>{new Date(n.createdAt).toLocaleString()}</div>
                    {!n.read && <button onClick={() => markAsRead(n._id)} style={{marginTop:'0.5rem'}}>Mark as read</button>}
                  </li>
                ))}
              </ul>
            )}
            <button onClick={() => setShowNotifications(false)} style={{marginTop:'1rem'}}>Close</button>
          </div>
        )}
      </header>
      
      <main className="main-content">
        <section className="welcome-section">
          <h2>Hello, {currentUser.name}!</h2>
          <p>Welcome to your Eventra dashboard. Discover and participate in exciting events happening around your campus!</p>
        </section>
        
        <section className="upcoming-events">
          <h3>My Registrations</h3>
          <div className="events-list">
            {registeredEvents.length > 0 ? (
              <div className="registered-events-grid">
                {registeredEvents.map(event => (
                  <div key={event._id} className="event-card">
                    <h3>{event.title}</h3>
                    <p><strong>Date:</strong> {event.startDate?.slice(0,10)}</p>
                    <p><strong>Location:</strong> {event.location}</p>
                    <div className="event-actions">
                      <button onClick={() => navigate(`/event-details/${event._id}`)} className="event-button">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-events">
                <p>You haven't registered for any events yet.</p>
                <button onClick={() => showToast('Browse available events below!', 'info')} className="action-button discover-btn">Browse Events</button>
              </div>
            )}
          </div>
        </section>
        
        <section className="available-events">
          <h3>Available Events</h3>
          <div className="events-list">
            {availableEvents.length > 0 ? (
              <div className="registered-events-grid">
                {availableEvents.map(event => (
                  <div key={event._id} className="event-card">
                    <h3>{event.title}</h3>
                    <p><strong>Date:</strong> {event.startDate?.slice(0,10)}</p>
                    <p><strong>Location:</strong> {event.location}</p>
                    <div className="event-actions">
                      <button onClick={() => navigate(`/event-details/${event._id}`)} className="event-button">View Details</button>
                      {registeredEventIds.includes(event._id) ? (
                        <div className="registered-badge">Registered</div>
                      ) : (
                        <button onClick={() => navigate(`/register-event/${event._id}`)} className="event-button secondary">Register Now</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-events">
                <p>No available events at the moment.</p>
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

// Discover Events Component
export function DiscoverEvents({ events, userRegistrations, onLogout }) {
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
            const isRegistered = userRegistrations.some(reg => reg.eventId === event._id)
            
            return (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Time:</strong> {event.time}</p>
                <p><strong>Organizer:</strong> {event.organizer}</p>
                <p className="event-short-desc">{event.description.substring(0, 80)}...</p>
                <div className="event-actions">
                  <button 
                    onClick={() => navigate(`/event-details/${event._id}`)} 
                    className="event-button"
                  >
                    View Details
                  </button>
                  {isRegistered ? (
                    <div className="registered-badge">Registered</div>
                  ) : (
                    <button 
                      onClick={() => navigate(`/register-event/${event._id}`)} 
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
export function EventDetails({ events, currentUser, onRegister, onCancelRegistration }) {
  const navigate = useNavigate()
  const { eventId } = useParams()
  // const eventIdNum = parseInt(eventId)
  
  // Find the event data
  const event = events.find(e => e._id === eventId)
  
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
                onClick={() => navigate(`/feedback/${event._id}`)} 
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
            onClick={() => navigate(`/register-event/${event._id}`)} 
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

export function RegisterEvent({ events, currentUser, onRegister, userRegistrations }) {
  const navigate = useNavigate()
  const { eventId } = useParams()

  if (events.length === 0) {
    return <div>Loading event details...</div>
  }

  const event = events.find(e => e._id === eventId)
  const alreadyRegistered = userRegistrations?.some(reg => reg.eventId._id === eventId)

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
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
    else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Enter a valid 10-digit phone number'
    if (!formData.acceptedTerms) newErrors.acceptedTerms = 'You must accept the terms'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    const { acceptedTerms, ...registrationData } = formData
    await onRegister(eventId, registrationData)
    alert(`You have successfully registered for ${event.title}!`)
    navigate('/student-homepage')
  }

  return (
    <div className="registration-container">
      <header className="header">
        <h1>Event Registration</h1>
        <nav className="nav">
          <button onClick={() => navigate(`/event-details/${eventId}`)} className="nav-button">Back to Event</button>
          <button onClick={() => navigate('/student-homepage')} className="nav-button">Dashboard</button>
        </nav>
      </header>
      <main className="registration-content">
        <h2>Register for: {event.title}</h2>
        <p className="event-date">{event.startDate} • {event.time}</p>
        <p className="event-location">{event.location}</p>
        {alreadyRegistered ? (
          <div className="registered-badge">You are already registered for this event.</div>
        ) : (
          <form className="registration-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="input" required />
            </div>
            <div className="form-group">
              <label htmlFor="rollNumber">Roll Number</label>
              <input type="text" id="rollNumber" name="rollNumber" value={formData.rollNumber} onChange={handleInputChange} className={`input ${errors.rollNumber ? 'input-error' : ''}`} required />
              {errors.rollNumber && <p className="error-text">{errors.rollNumber}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="course">Course</label>
              <input type="text" id="course" name="course" value={formData.course} onChange={handleInputChange} className={`input ${errors.course ? 'input-error' : ''}`} required />
              {errors.course && <p className="error-text">{errors.course}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="year">Year of Study</label>
              <select id="year" name="year" value={formData.year} onChange={handleInputChange} className={`input ${errors.year ? 'input-error' : ''}`} required>
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
              <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className={`input ${errors.phoneNumber ? 'input-error' : ''}`} required placeholder="10-digit phone number" />
              {errors.phoneNumber && <p className="error-text">{errors.phoneNumber}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="dietaryRequirements">Dietary Requirements (Optional)</label>
              <select id="dietaryRequirements" name="dietaryRequirements" value={formData.dietaryRequirements} onChange={handleInputChange} className="input">
                <option value="">None</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten-free">Gluten-Free</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="specialRequests">Special Requests (Optional)</label>
              <textarea id="specialRequests" name="specialRequests" value={formData.specialRequests} onChange={handleInputChange} className="input textarea" placeholder="Any special accommodations or requests" rows="3"></textarea>
            </div>
            <div className="form-group checkbox-group">
              <input type="checkbox" id="acceptedTerms" name="acceptedTerms" checked={formData.acceptedTerms} onChange={handleInputChange} className="checkbox-input" />
              <label htmlFor="acceptedTerms" className="checkbox-label">I agree to the terms and conditions for this event</label>
              {errors.acceptedTerms && <p className="error-text">{errors.acceptedTerms}</p>}
            </div>
            <button type="submit" className="submit-button">Register for Event</button>
          </form>
        )}
      </main>
      <footer className="footer">
        <p>© 2025 Eventra - Your Campus Event Management System</p>
      </footer>
    </div>
  )
}

// MyRegistrations Component
export function MyRegistrations({ registrations, events, onCancelRegistration, onLogout }) {
  const navigate = useNavigate()
  
  // Find full event details for each registration
  const registeredEvents = registrations.map(reg => {
    const event = events.find(e => e._id === reg.eventId)
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

// Submit Feedback Component
export function SubmitFeedback({ events, currentUser, registrations, onSubmitFeedback }) {
  const navigate = useNavigate()
  const { eventId } = useParams()
  const event = events.find(e => e._id === eventId)
  const registration = registrations.find(reg => reg.eventId._id === eventId)
  const [formData, setFormData] = useState({
    rating: '',
    feedback: '',
    enjoyment: '',
    improvements: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  if (!event || !registration) {
    return (
      <div className="not-found-container">
        <h2>Event Not Found</h2>
        <p>Sorry, we couldn't find your registration for this event.</p>
        <button onClick={() => navigate('/student-homepage')} className="action-button">Return to Dashboard</button>
      </div>
    )
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!formData.rating || !formData.feedback || !formData.enjoyment) {
      setError('Please fill all required fields.')
      return
    }
    try {
      // POST feedback to backend
      const res = await fetch(`http://localhost:5273/api/registrations/${registration._id}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
        if (onSubmitFeedback) onSubmitFeedback(eventId, formData)
      } else {
        setError(data.message || 'Failed to submit feedback')
      }
    } catch (err) {
      setError('Error submitting feedback')
    }
  }

  if (submitted) {
    return (
      <div className="success-message">
        <h2>Thank you for your feedback!</h2>
        <button onClick={() => navigate('/student-homepage')} className="action-button">Return to Dashboard</button>
      </div>
    )
  }

  return (
    <div className="feedback-container">
      <header className="header">
        <h1>Submit Feedback for {event.title}</h1>
        <nav className="nav">
          <button onClick={() => navigate('/student-homepage')} className="nav-button">Dashboard</button>
        </nav>
      </header>
      <main className="main-content">
        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Rating (1-5)</label>
            <input type="number" name="rating" min={1} max={5} value={formData.rating} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>What did you enjoy most?</label>
            <input type="text" name="enjoyment" value={formData.enjoyment} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Feedback</label>
            <textarea name="feedback" value={formData.feedback} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Suggestions for improvement (optional)</label>
            <textarea name="improvements" value={formData.improvements} onChange={handleChange} />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="submit-button">Submit Feedback</button>
        </form>
      </main>
      <footer className="footer">
        <p>© 2025 Eventra - Your Campus Event Management System</p>
      </footer>
    </div>
  )
} 