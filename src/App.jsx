// App.jsx (updated)
import React, { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './styles/main.css'
import { getAuthToken } from './utils/auth'

import { LoginPage, SignupPage } from './components/auth/AuthComponents'
import { 
  StudentHomepage, 
  DiscoverEvents, 
  EventDetails, 
  RegisterEvent, 
  MyRegistrations,
  SubmitFeedback 
} from './components/student/StudentComponents'
import { PresidentHomepage } from './components/president/PresidentComponents'
import { ManagementHomepage } from './components/management/ManagementComponents'

// Toast context
const ToastContext = createContext(null)
export function useToast() { return useContext(ToastContext) }

function Toast({ message, type, onClose }) {
  if (!message) return null
  return (
    <div style={{position:'fixed',bottom:30,right:30,zIndex:2000,background:type==='error'?'#c0392b':'#27ae60',color:'#fff',padding:'1rem 2rem',borderRadius:8,boxShadow:'0 2px 8px #0008',fontWeight:600}}>
      {message}
      <button onClick={onClose} style={{marginLeft:20,background:'none',border:'none',color:'#fff',fontWeight:700,fontSize:'1.2em',cursor:'pointer'}}>×</button>
    </div>
  )
}

function LoadingSpinner({ show }) {
  if (!show) return null
  return (
    <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'#0008',display:'flex',alignItems:'center',justifyContent:'center',zIndex:3000}}>
      <div style={{border:'6px solid #eee',borderTop:'6px solid #3498db',borderRadius:'50%',width:60,height:60,animation:'spin 1s linear infinite'}} />
      <style>{'@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}'}</style>
    </div>
  )
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('')
  const [currentUser, setCurrentUser] = useState({ id: '', name: '', email: '', registrations: [] })
  const [events, setEvents] = useState([])
  const [userRegistrations, setUserRegistrations] = useState([])
  const [toast, setToast] = useState({ message: '', type: 'success' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:5273/api/events')
        const data = await res.json()
        if (data.success) {
          setEvents(data.data)
        }
      } catch (err) {
        console.error('Failed to fetch events:', err)
      }
    }
    fetchEvents()
  }, [])

  useEffect(() => {
    if (loggedIn && userRole === 'student') {
      const fetchUserRegistrations = async () => {
        try {
          const res = await fetch('http://localhost:5273/api/registrations/user', {
            headers: { Authorization: `Bearer ${getAuthToken()}` },
            credentials: 'include',
          })
          const data = await res.json()
          if (data.success) {
            setUserRegistrations(data.registrations)
          }
        } catch (err) {
          console.error('Failed to fetch user registrations:', err)
        }
      }
      fetchUserRegistrations()
    }
  }, [loggedIn, userRole])

  const handleSuccessfulLogin = (user, role) => {
    setLoggedIn(true)
    setUserRole(role)
    setCurrentUser({
      id: user._id,
      name: user.name,
      email: user.email,
      registrations: []
    })
  }

  const handleLogout = () => {
    setLoggedIn(false)
    setUserRole('')
    setCurrentUser({ id: '', name: '', email: '', registrations: [] })
    setUserRegistrations([])
  }

  const handleEventRegistration = async (eventId, registrationData) => {
    try {
      const response = await fetch(`http://localhost:5273/api/registrations/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`
        },
        credentials: 'include',
        body: JSON.stringify(registrationData)
      })
      const data = await response.json()
      if (!response.ok) {
        alert(data.message || 'Registration failed')
        return null
      }
      if (userRole === 'student') {
        const regRes = await fetch('http://localhost:5273/api/registrations/user', {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
          credentials: 'include',
        })
        const regData = await regRes.json()
        if (regData.success) {
          setUserRegistrations(regData.registrations)
        }
      }
      return eventId
    } catch (err) {
      console.error('Registration error:', err)
      alert('Failed to register.')
    }
  }

  const handleFeedbackSubmission = (eventId, feedbackData) => {
    const updatedRegistrations = currentUser.registrations.map(reg => {
      if (reg.eventId === eventId) {
        return { ...reg, feedback: feedbackData }
      }
      return reg
    })
    setCurrentUser({ ...currentUser, registrations: updatedRegistrations })
  }

  const handleCancelRegistration = (eventId) => {
    const updatedRegistrations = currentUser.registrations.filter(reg => reg.eventId !== eventId)
    setCurrentUser({ ...currentUser, registrations: updatedRegistrations })
  }

  const showToast = (message, type='success') => {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type: 'success' }), 3500)
  }

  return (
    <ToastContext.Provider value={showToast}>
      <Router>
        <LoadingSpinner show={loading} />
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
        <div className="container">
          <Routes>
            <Route path="/" element={<LoginPage onLoginSuccess={handleSuccessfulLogin} />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/student-homepage" element={
              loggedIn && userRole === 'student' ?
                <StudentHomepage
                  currentUser={currentUser}
                  events={events.filter(event => event.status === 'approved' || event.status === 'live')}
                  userRegistrations={userRegistrations}
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
                <DiscoverEvents events={events} userRegistrations={currentUser.registrations} onLogout={handleLogout} /> : 
                <Navigate to="/" replace />
            } />
            <Route path="/event-details/:eventId" element={
              loggedIn ? 
                <EventDetails events={events} currentUser={currentUser} onRegister={handleEventRegistration} onCancelRegistration={handleCancelRegistration} /> : 
                <Navigate to="/" replace />
            } />
            <Route path="/register-event/:eventId" element={
              loggedIn ? 
                <RegisterEvent events={events} currentUser={currentUser} onRegister={handleEventRegistration} /> : 
                <Navigate to="/" replace />
            } />
            <Route path="/my-registrations" element={
              loggedIn ? 
                <MyRegistrations registrations={currentUser.registrations} events={events} onCancelRegistration={handleCancelRegistration} onLogout={handleLogout} /> : 
                <Navigate to="/" replace />
            } />
            <Route path="/feedback/:eventId" element={
              loggedIn ? 
                <SubmitFeedback events={events} currentUser={currentUser} registrations={currentUser.registrations} onSubmitFeedback={handleFeedbackSubmission} /> : 
                <Navigate to="/" replace />
            } />
          </Routes>
        </div>
      </Router>
    </ToastContext.Provider>
  )
}

export default App
