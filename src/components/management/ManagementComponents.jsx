import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuthToken } from '../../utils/auth'

// Management Homepage Component
export function ManagementHomepage({ onLogout }) {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [currentUser, setCurrentUser] = useState({})
  
  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        const res = await fetch('http://localhost:5273/api/events', {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        })
        const data = await res.json()
        if (data.success) {
          setEvents(data.data)
        }
      } catch (err) {
        console.error('Failed to fetch events:', err)
      }
      setLoading(false)
    }
    fetchEvents()
  }, [])

  // Approve or reject event
  const updateEventStatus = async (eventId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5273/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ status: newStatus })
      })
      const data = await res.json()
      if (data.success) {
        setEvents(events => events.map(ev => ev._id === eventId ? { ...ev, status: newStatus } : ev))
      } else {
        alert(data.message || 'Failed to update event status')
      }
    } catch (err) {
      alert('Error updating event status')
    }
  }

  // Function to render different sections based on activeSection state
  const renderSection = () => {
    switch (activeSection) {
      case 'reviewEvents':
        return <ReviewEventsSection events={events} loading={loading} onApprove={id => updateEventStatus(id, 'approved')} onReject={id => updateEventStatus(id, 'rejected')} setActiveSection={setActiveSection} />
      case 'monitorStatus':
        return <MonitorStatusSection events={events} loading={loading} setActiveSection={setActiveSection} />
      default:
        return <DashboardSection setActiveSection={setActiveSection} />
    }
  }
  
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
      </header>
      
      <main className="main-content">
        {renderSection()}
      </main>
      
      <footer className="footer">
        <p>© 2025 Eventra - Your Campus Event Management System</p>
      </footer>
    </div>
  )
}

// Dashboard Section Component
function DashboardSection({ setActiveSection }) {
  return (
    <>
      <section className="welcome-section">
        <h2>Welcome, Management!</h2>
        <p>Review, approve, and monitor all campus events and budgets here.</p>
      </section>
      
      <section className="quick-actions">
        <h3>Management Functions</h3>
        <div className="action-buttons">
          <button onClick={() => setActiveSection('reviewEvents')} className="action-button">Review Events</button>
          <button onClick={() => setActiveSection('monitorStatus')} className="action-button">Monitor Events</button>
        </div>
      </section>
      
      <section className="management-summary">
        <h3>Management Summary</h3>
        
        <div className="summary-cards">
          <div className="summary-card">
            <h4>Pending Approvals</h4>
            <div className="summary-stat">5</div>
            <p>Events waiting for approval</p>
          </div>
          
          <div className="summary-card">
            <h4>SOPs to Review</h4>
            <div className="summary-stat">3</div>
            <p>Standard Operating Procedures</p>
          </div>
          
          <div className="summary-card">
            <h4>Budget Requests</h4>
            <div className="summary-stat">4</div>
            <p>Pending budget approvals</p>
          </div>
          
          <div className="summary-card">
            <h4>Active Events</h4>
            <div className="summary-stat">8</div>
            <p>Currently active events</p>
          </div>
        </div>
      </section>
    </>
  )
}

function ReviewEventsSection({ events, loading, onApprove, onReject, setActiveSection }) {
  const pendingEvents = events.filter(ev => ev.status === 'pending' || ev.status === 'idea')
  return (
    <section>
      <button onClick={() => setActiveSection('dashboard')} className="back-button" style={{marginBottom:'1rem'}}>← Back to Dashboard</button>
      <h2>Events Awaiting Approval</h2>
      {loading ? <div>Loading events...</div> : (
        <div className="events-list">
          {pendingEvents.length === 0 ? <p>No events pending approval.</p> : (
            <div className="registered-events-grid">
              {pendingEvents.map(event => (
                <div key={event._id} className="event-card">
                  <h3>{event.title}</h3>
                  <p><strong>Date:</strong> {event.startDate?.slice(0,10)}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                  <p><strong>Status:</strong> {event.status}</p>
                  <div className="event-actions">
                    <button onClick={() => onApprove(event._id)} className="event-button">Approve</button>
                    <button onClick={() => onReject(event._id)} className="event-button secondary">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function MonitorStatusSection({ events, loading, setActiveSection }) {
  const approvedEvents = events.filter(ev => ev.status === 'approved' || ev.status === 'live')
  return (
    <section>
      <button onClick={() => setActiveSection('dashboard')} className="back-button" style={{marginBottom:'1rem'}}>← Back to Dashboard</button>
      <h2>Approved/Live Events</h2>
      {loading ? <div>Loading events...</div> : (
        <div className="events-list">
          {approvedEvents.length === 0 ? <p>No approved or live events.</p> : (
            <div className="registered-events-grid">
              {approvedEvents.map(event => (
                <div key={event._id} className="event-card">
                  <h3>{event.title}</h3>
                  <p><strong>Date:</strong> {event.startDate?.slice(0,10)}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                  <p><strong>Status:</strong> {event.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
} 