import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// President Homepage Component
export function PresidentHomepage({ onLogout }) {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('dashboard')
  
  // Function to render different sections based on activeSection state
  const renderSection = () => {
    switch (activeSection) {
      case 'createEvent':
        return <CreateEventSection />
      case 'uploadSOP':
        return <UploadSOPSection />
      case 'assignRoles':
        return <AssignRolesSection />
      case 'submitBudget':
        return <SubmitBudgetSection />
      case 'trackApproval':
        return <TrackApprovalSection />
      case 'publishEvent':
        return <PublishEventSection />
      case 'monitorAttendance':
        return <MonitorAttendanceSection />
      default:
        return <DashboardSection setActiveSection={setActiveSection} />
    }
  }
  
  return (
    <div className="homepage-container">
      <header className="header">
        <h1>President Dashboard</h1>
        <nav className="nav">
          <button 
            onClick={() => setActiveSection('dashboard')} 
            className={`nav-button ${activeSection === 'dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </button>
          <button onClick={onLogout} className="nav-button logout">
            Logout
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
        <h2>Welcome, Club President!</h2>
        <p>Here you can manage your club's events and track participation.</p>
      </section>
      
      <section className="quick-actions">
        <h3>President Functions</h3>
        <div className="action-buttons">
          <button 
            onClick={() => setActiveSection('createEvent')} 
            className="action-button"
          >
            Create Event
          </button>
          <button 
            onClick={() => setActiveSection('uploadSOP')} 
            className="action-button"
          >
            Upload SOP
          </button>
          <button 
            onClick={() => setActiveSection('assignRoles')} 
            className="action-button"
          >
            Assign Roles
          </button>
          <button 
            onClick={() => setActiveSection('submitBudget')} 
            className="action-button"
          >
            Submit Budget
          </button>
          <button 
            onClick={() => setActiveSection('trackApproval')} 
            className="action-button"
          >
            Track Approval
          </button>
          <button 
            onClick={() => setActiveSection('publishEvent')} 
            className="action-button"
          >
            Publish Event
          </button>
          <button 
            onClick={() => setActiveSection('monitorAttendance')} 
            className="action-button"
          >
            Monitor Attendance
          </button>
        </div>
      </section>
      
      <section className="upcoming-events">
        <h3>Your Club's Events</h3>
        <div className="events-list">
          <div className="no-events">
            <p>No events created yet.</p>
          </div>
        </div>
      </section>
    </>
  )
}

// Create Event Section
function CreateEventSection() {
  return (
    <div className="section-container">
      <h2>Create New Event</h2>
      <div className="form-wrapper">
        <form className="form">
          <div className="form-group">
            <label htmlFor="eventTitle">Event Title</label>
            <input 
              type="text" 
              id="eventTitle" 
              className="input" 
              placeholder="Enter event title" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="eventDate">Event Date</label>
            <input 
              type="date" 
              id="eventDate" 
              className="input" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="eventTime">Event Time</label>
            <input 
              type="time" 
              id="eventTime" 
              className="input" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="eventLocation">Event Location</label>
            <input 
              type="text" 
              id="eventLocation" 
              className="input" 
              placeholder="Enter event location" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="eventDescription">Event Description</label>
            <textarea 
              id="eventDescription" 
              className="input textarea" 
              placeholder="Describe your event..." 
              rows="4" 
              required 
            ></textarea>
          </div>
          
          <button type="submit" className="submit-button">Create Event</button>
        </form>
      </div>
    </div>
  )
}

// Upload SOP Section
function UploadSOPSection() {
  return (
    <div className="section-container">
      <h2>Upload Standard Operating Procedure</h2>
      <div className="form-wrapper">
        <form className="form">
          <div className="form-group">
            <label htmlFor="eventSelect">Select Event</label>
            <select id="eventSelect" className="input" required>
              <option value="">Select an event</option>
              <option value="1">Tech Workshop</option>
              <option value="2">Music Festival</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="sopFile">SOP Document</label>
            <input 
              type="file" 
              id="sopFile" 
              className="input" 
              required 
            />
            <small>Upload a PDF or DOC file with your event's SOP</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="sopNotes">Additional Notes</label>
            <textarea 
              id="sopNotes" 
              className="input textarea" 
              placeholder="Any additional information or notes..." 
              rows="3"
            ></textarea>
          </div>
          
          <button type="submit" className="submit-button">Upload SOP</button>
        </form>
      </div>
    </div>
  )
}

// Assign Roles Section
function AssignRolesSection() {
  return (
    <div className="section-container">
      <h2>Assign Roles for Event</h2>
      <div className="form-wrapper">
        <form className="form">
          <div className="form-group">
            <label htmlFor="roleEventSelect">Select Event</label>
            <select id="roleEventSelect" className="input" required>
              <option value="">Select an event</option>
              <option value="1">Tech Workshop</option>
              <option value="2">Music Festival</option>
            </select>
          </div>
          
          <div className="role-assignment-container">
            <h3>Team Members</h3>
            
            <div className="role-item">
              <div className="role-name">Event Coordinator</div>
              <select className="input role-select">
                <option value="">Assign a member</option>
                <option value="member1">John Smith</option>
                <option value="member2">Sarah Johnson</option>
                <option value="member3">Michael Chen</option>
              </select>
            </div>
            
            <div className="role-item">
              <div className="role-name">Registration Manager</div>
              <select className="input role-select">
                <option value="">Assign a member</option>
                <option value="member1">John Smith</option>
                <option value="member2">Sarah Johnson</option>
                <option value="member3">Michael Chen</option>
              </select>
            </div>
            
            <div className="role-item">
              <div className="role-name">Technical Support</div>
              <select className="input role-select">
                <option value="">Assign a member</option>
                <option value="member1">John Smith</option>
                <option value="member2">Sarah Johnson</option>
                <option value="member3">Michael Chen</option>
              </select>
            </div>
            
            <div className="role-item">
              <div className="role-name">Marketing</div>
              <select className="input role-select">
                <option value="">Assign a member</option>
                <option value="member1">John Smith</option>
                <option value="member2">Sarah Johnson</option>
                <option value="member3">Michael Chen</option>
              </select>
            </div>
          </div>
          
          <button type="submit" className="submit-button">Save Role Assignments</button>
        </form>
      </div>
    </div>
  )
}

// Submit Budget Section
function SubmitBudgetSection() {
  return (
    <div className="section-container">
      <h2>Submit Event Budget</h2>
      <div className="form-wrapper">
        <form className="form">
          <div className="form-group">
            <label htmlFor="budgetEventSelect">Select Event</label>
            <select id="budgetEventSelect" className="input" required>
              <option value="">Select an event</option>
              <option value="1">Tech Workshop</option>
              <option value="2">Music Festival</option>
            </select>
          </div>
          
          <div className="budget-items-container">
            <h3>Budget Items</h3>
            
            <div className="budget-item">
              <input type="text" className="input" placeholder="Item name" />
              <input type="number" className="input" placeholder="Amount" min="0" step="0.01" />
            </div>
            
            <div className="budget-item">
              <input type="text" className="input" placeholder="Item name" />
              <input type="number" className="input" placeholder="Amount" min="0" step="0.01" />
            </div>
            
            <div className="budget-item">
              <input type="text" className="input" placeholder="Item name" />
              <input type="number" className="input" placeholder="Amount" min="0" step="0.01" />
            </div>
            
            <button type="button" className="action-button">+ Add More Items</button>
          </div>
          
          <div className="form-group">
            <label htmlFor="budgetFile">Supporting Documents</label>
            <input 
              type="file" 
              id="budgetFile" 
              className="input" 
            />
            <small>Upload any supporting documents or quotes (optional)</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="budgetNotes">Additional Notes</label>
            <textarea 
              id="budgetNotes" 
              className="input textarea" 
              placeholder="Any additional notes about the budget..." 
              rows="3"
            ></textarea>
          </div>
          
          <button type="submit" className="submit-button">Submit Budget for Approval</button>
        </form>
      </div>
    </div>
  )
}

// Track Approval Section
function TrackApprovalSection() {
  return (
    <div className="section-container">
      <h2>Track Event Approvals</h2>
      
      <div className="approval-status-container">
        <div className="approval-card">
          <h3>Tech Workshop</h3>
          <div className="approval-info">
            <div className="approval-item">
              <span className="approval-label">SOP Status:</span>
              <span className="approval-status approved">Approved</span>
            </div>
            <div className="approval-item">
              <span className="approval-label">Budget Status:</span>
              <span className="approval-status pending">Pending</span>
            </div>
            <div className="approval-item">
              <span className="approval-label">Final Approval:</span>
              <span className="approval-status pending">Pending</span>
            </div>
            <div className="approval-item">
              <span className="approval-label">Submitted:</span>
              <span className="approval-date">May 12, 2025</span>
            </div>
          </div>
          <div className="approval-notes">
            <strong>Management Notes:</strong>
            <p>Please revise budget and resubmit with more details on equipment costs.</p>
          </div>
        </div>
        
        <div className="approval-card">
          <h3>Music Festival</h3>
          <div className="approval-info">
            <div className="approval-item">
              <span className="approval-label">SOP Status:</span>
              <span className="approval-status pending">Pending</span>
            </div>
            <div className="approval-item">
              <span className="approval-label">Budget Status:</span>
              <span className="approval-status pending">Pending</span>
            </div>
            <div className="approval-item">
              <span className="approval-label">Final Approval:</span>
              <span className="approval-status pending">Pending</span>
            </div>
            <div className="approval-item">
              <span className="approval-label">Submitted:</span>
              <span className="approval-date">May 15, 2025</span>
            </div>
          </div>
          <div className="approval-notes">
            <strong>Management Notes:</strong>
            <p>No notes yet.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Publish Event Section
function PublishEventSection() {
  return (
    <div className="section-container">
      <h2>Publish Events</h2>
      
      <div className="publishable-events-container">
        <div className="publishable-event">
          <h3>Tech Workshop</h3>
          <div className="event-status">
            <span className="status-label">Approval Status:</span>
            <span className="status-value pending">Pending Approval</span>
          </div>
          <div className="event-ready-status">
            <span className="status-label">SOP:</span>
            <span className="status-value completed">Completed</span>
          </div>
          <div className="event-ready-status">
            <span className="status-label">Roles:</span>
            <span className="status-value completed">Assigned</span>
          </div>
          <div className="event-ready-status">
            <span className="status-label">Budget:</span>
            <span className="status-value pending">Pending</span>
          </div>
          <button className="action-button" disabled>Publish (Awaiting Approval)</button>
        </div>
        
        <div className="publishable-event">
          <h3>Music Festival</h3>
          <div className="event-status">
            <span className="status-label">Approval Status:</span>
            <span className="status-value approved">Approved</span>
          </div>
          <div className="event-ready-status">
            <span className="status-label">SOP:</span>
            <span className="status-value completed">Completed</span>
          </div>
          <div className="event-ready-status">
            <span className="status-label">Roles:</span>
            <span className="status-value completed">Assigned</span>
          </div>
          <div className="event-ready-status">
            <span className="status-label">Budget:</span>
            <span className="status-value completed">Approved</span>
          </div>
          <button className="submit-button">Publish Event</button>
        </div>
      </div>
    </div>
  )
}

// Monitor Attendance Section
function MonitorAttendanceSection() {
  return (
    <div className="section-container">
      <h2>Monitor Event Attendance</h2>
      
      <div className="event-selection">
        <label htmlFor="attendanceEventSelect">Select Event:</label>
        <select id="attendanceEventSelect" className="input">
          <option value="1">Tech Workshop</option>
          <option value="2">Music Festival</option>
        </select>
      </div>
      
      <div className="attendance-stats">
        <div className="stat-card">
          <div className="stat-title">Registered</div>
          <div className="stat-value">45</div>
          <div className="stat-description">Total registrations</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-title">Check-ins</div>
          <div className="stat-value">38</div>
          <div className="stat-description">Attendees who checked in</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-title">No-shows</div>
          <div className="stat-value">7</div>
          <div className="stat-description">Registered but didn't attend</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-title">Attendance Rate</div>
          <div className="stat-value">84%</div>
          <div className="stat-description">Percentage who attended</div>
        </div>
      </div>
      
      <div className="attendance-list">
        <h3>Attendee List</h3>
        <div className="list-controls">
          <input type="text" className="input search-input" placeholder="Search attendees..." />
          <select className="input filter-select">
            <option value="all">All</option>
            <option value="checked-in">Checked In</option>
            <option value="not-checked-in">Not Checked In</option>
          </select>
        </div>
        
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll Number</th>
              <th>Course</th>
              <th>Check-in Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Smith</td>
              <td>R12345</td>
              <td>Computer Science</td>
              <td>2:15 PM</td>
              <td><span className="status-badge checked-in">Checked In</span></td>
            </tr>
            <tr>
              <td>Emma Wilson</td>
              <td>R67890</td>
              <td>Electrical Engineering</td>
              <td>2:05 PM</td>
              <td><span className="status-badge checked-in">Checked In</span></td>
            </tr>
            <tr>
              <td>Michael Chen</td>
              <td>R24680</td>
              <td>Business Administration</td>
              <td>-</td>
              <td><span className="status-badge not-checked-in">Not Checked In</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
} 