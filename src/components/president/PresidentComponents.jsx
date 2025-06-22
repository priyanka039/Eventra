import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../../utils/auth';
import { FaUserCircle } from 'react-icons/fa';

// President Homepage Component
export function PresidentHomepage({ onLogout }) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('eventra_user') || '{}');

  // Fetch president's events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5273/api/events', {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        });
        const data = await res.json();
        if (data.success) {
          setEvents(data.data);
        }
      } catch (err) {
        // ignore
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  // Fetch notifications for the president
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`http://localhost:5273/api/notifications/user/${currentUser._id}`, {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setNotifications(data);
        } else if (data.success && Array.isArray(data.data)) {
          setNotifications(data.data);
        }
      } catch (err) {}
    };
    if (currentUser._id) fetchNotifications();
  }, [currentUser._id]);

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`http://localhost:5273/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        body: JSON.stringify({ read: true })
      });
      setNotifications(notifications => notifications.map(n => n._id === notificationId ? { ...n, read: true } : n));
    } catch (err) {}
  };

  // Create event
  const handleCreateEvent = async (formData) => {
    try {
      const res = await fetch('http://localhost:5273/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setEvents((prev) => [data.data, ...prev]);
        alert('Event created successfully!');
      } else {
        alert(data.message || 'Failed to create event');
      }
    } catch (err) {
      alert('Error creating event');
    }
  };

  // Upload SOP (dummy, as backend endpoint is not shown)
  const handleUploadSOP = async (eventId, sopFile) => {
    // Example: POST /api/events/:id/sop
    // You may need to adjust this to match your backend
    const formData = new FormData();
    formData.append('sop', sopFile);
    try {
      const res = await fetch(`http://localhost:5273/api/events/${eventId}/sop`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert('SOP uploaded successfully!');
      } else {
        alert(data.message || 'Failed to upload SOP');
      }
    } catch (err) {
      alert('Error uploading SOP');
    }
  };

  // Submit budget (dummy, as backend endpoint is not shown)
  const handleSubmitBudget = async (eventId, budgetData) => {
    // Example: POST /api/budgets
    try {
      const res = await fetch('http://localhost:5273/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ ...budgetData, eventId }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Budget submitted successfully!');
      } else {
        alert(data.message || 'Failed to submit budget');
      }
    } catch (err) {
      alert('Error submitting budget');
    }
  };

  // Dashboard sections
  const renderSection = () => {
    switch (activeSection) {
      case 'createEvent':
        return <CreateEventSection onCreate={handleCreateEvent} setActiveSection={setActiveSection} />;
      case 'uploadSOP':
        return <UploadSOPSection events={events} onUpload={handleUploadSOP} setActiveSection={setActiveSection} />;
      case 'submitBudget':
        return <SubmitBudgetSection events={events} onSubmit={handleSubmitBudget} setActiveSection={setActiveSection} />;
      case 'trackApproval':
        return <TrackApprovalSection events={events} loading={loading} setActiveSection={setActiveSection} />;
      default:
        return <DashboardSection setActiveSection={setActiveSection} />;
    }
  };

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
            <div style={{marginBottom:'0.7rem',fontStyle:'italic',color:'#8be9fd'}}>🌟 Welcome back, {currentUser.name?.split(' ')[0] || 'User'}! Ready to lead your next event?</div>
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
      <main className="main-content">{renderSection()}</main>
      <footer className="footer">
        <p>© 2025 Eventra - Your Campus Event Management System</p>
      </footer>
    </div>
  );
}

// Dashboard Section Component
function DashboardSection({ setActiveSection }) {
  return (
    <>
      <section className="welcome-section">
        <h2>Welcome, Club President!</h2>
        <p>Here you can manage your club's events and track participation.</p>
      </section>
      <section className="quick-actions">
        <h3>President Functions</h3>
        <div className="action-buttons">
          <button onClick={() => setActiveSection('createEvent')} className="action-button">Create Event</button>
          <button onClick={() => setActiveSection('uploadSOP')} className="action-button">Upload SOP</button>
          <button onClick={() => setActiveSection('submitBudget')} className="action-button">Submit Budget</button>
          <button onClick={() => setActiveSection('trackApproval')} className="action-button">Track Approval</button>
        </div>
      </section>
    </>
  );
}

function CreateEventSection({ onCreate, setActiveSection }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    club: '',
    startDate: '',
    endDate: '',
    location: '',
    capacity: 1,
    registrationDeadline: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onCreate(formData);
    setLoading(false);
    setFormData({
      title: '', description: '', club: '', startDate: '', endDate: '', location: '', capacity: 1, registrationDeadline: ''
    });
  };

  return (
    <section>
      <button onClick={() => setActiveSection('dashboard')} className="back-button" style={{marginBottom:'1rem'}}>← Back to Dashboard</button>
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Club</label>
          <input type="text" name="club" value={formData.club} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Start Date</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Capacity</label>
          <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required min={1} />
        </div>
        <div className="form-group">
          <label>Registration Deadline</label>
          <input type="date" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleChange} required />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>{loading ? 'Creating...' : 'Create Event'}</button>
      </form>
    </section>
  );
}

function UploadSOPSection({ events, onUpload, setActiveSection }) {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [sopFile, setSopFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent || !sopFile) return alert('Select event and SOP file');
    setLoading(true);
    await onUpload(selectedEvent, sopFile);
    setLoading(false);
    setSelectedEvent('');
    setSopFile(null);
  };

  return (
    <section>
      <button onClick={() => setActiveSection('dashboard')} className="back-button" style={{marginBottom:'1rem'}}>← Back to Dashboard</button>
      <h2>Upload SOP for Event</h2>
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label>Select Event</label>
          <select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)} required>
            <option value="">Select Event</option>
            {events.map(ev => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>SOP File (PDF)</label>
          <input type="file" accept="application/pdf" onChange={e => setSopFile(e.target.files[0])} required />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>{loading ? 'Uploading...' : 'Upload SOP'}</button>
      </form>
    </section>
  );
}

function SubmitBudgetSection({ events, onSubmit, setActiveSection }) {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent || !amount || !description) return alert('Fill all fields');
    setLoading(true);
    await onSubmit(selectedEvent, { amount, description });
    setLoading(false);
    setSelectedEvent('');
    setAmount('');
    setDescription('');
  };

  return (
    <section>
      <button onClick={() => setActiveSection('dashboard')} className="back-button" style={{marginBottom:'1rem'}}>← Back to Dashboard</button>
      <h2>Submit Budget for Event</h2>
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label>Select Event</label>
          <select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)} required>
            <option value="">Select Event</option>
            {events.map(ev => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required min={1} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>{loading ? 'Submitting...' : 'Submit Budget'}</button>
      </form>
    </section>
  );
}

function TrackApprovalSection({ events, loading, setActiveSection }) {
  return (
    <section>
      <button onClick={() => setActiveSection('dashboard')} className="back-button" style={{marginBottom:'1rem'}}>← Back to Dashboard</button>
      <h2>Track Event Approval Status</h2>
      {loading ? <div>Loading events...</div> : (
        <div className="events-list">
          {events.length === 0 ? <p>No events created yet.</p> : (
            <div className="registered-events-grid">
              {events.map(event => (
                <div key={event._id} className="event-card">
                  <h3>{event.title}</h3>
                  <p><strong>Date:</strong> {event.startDate?.slice(0,10)}</p>
                  <p><strong>Status:</strong> {event.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
} 