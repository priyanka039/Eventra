import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Management Homepage Component
export function ManagementHomepage({ onLogout }) {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('dashboard')
  
  // Function to render different sections based on activeSection state
  const renderSection = () => {
    switch (activeSection) {
      case 'reviewSOPs':
        return <ReviewSOPsSection />
      case 'approveBudgets':
        return <ApproveBudgetsSection />
      case 'monitorStatus':
        return <MonitorStatusSection />
      default:
        return <DashboardSection setActiveSection={setActiveSection} />
    }
  }
  
  return (
    <div className="homepage-container">
      <header className="header">
        <h1>Management Dashboard</h1>
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
        <h2>Welcome, Management Staff!</h2>
        <p>Here you can oversee all campus events, clubs, and activities.</p>
      </section>
      
      <section className="quick-actions">
        <h3>Management Functions</h3>
        <div className="action-buttons">
          <button 
            onClick={() => setActiveSection('reviewSOPs')} 
            className="action-button"
          >
            Review Pending SOPs
          </button>
          <button 
            onClick={() => setActiveSection('approveBudgets')} 
            className="action-button"
          >
            Approve/Reject Budgets
          </button>
          <button 
            onClick={() => setActiveSection('monitorStatus')} 
            className="action-button"
          >
            Monitor Event Status
          </button>
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

// Review SOPs Section
function ReviewSOPsSection() {
  return (
    <div className="section-container">
      <h2>Review Standard Operating Procedures</h2>
      
      <div className="filter-bar">
        <select className="input filter-select">
          <option value="all">All SOPs</option>
          <option value="pending">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <input type="text" className="input search-input" placeholder="Search by event or club..." />
      </div>
      
      <div className="sop-list">
        <div className="sop-item pending">
          <div className="sop-details">
            <h3>Music Festival</h3>
            <div className="sop-meta">
              <span className="sop-club">Music Society</span>
              <span className="sop-date">Submitted: May 15, 2025</span>
            </div>
            <div className="sop-description">
              <p>SOP for annual campus-wide music festival featuring student performances.</p>
            </div>
            <div className="sop-file">
              <span className="file-icon">📄</span>
              <span className="file-name">MusicFestival_SOP.pdf</span>
              <button className="action-button small">View Document</button>
            </div>
          </div>
          <div className="sop-actions">
            <div className="sop-status pending">Pending Review</div>
            <div className="action-buttons">
              <button className="submit-button">Approve</button>
              <button className="cancel-button">Reject</button>
            </div>
            <div className="form-group">
              <label>Notes to President:</label>
              <textarea className="input textarea" placeholder="Add notes for the club president..."></textarea>
            </div>
          </div>
        </div>
        
        <div className="sop-item pending">
          <div className="sop-details">
            <h3>Hackathon 2025</h3>
            <div className="sop-meta">
              <span className="sop-club">Coding Club</span>
              <span className="sop-date">Submitted: May 14, 2025</span>
            </div>
            <div className="sop-description">
              <p>24-hour coding competition for students to showcase their development skills.</p>
            </div>
            <div className="sop-file">
              <span className="file-icon">📄</span>
              <span className="file-name">Hackathon_SOP.pdf</span>
              <button className="action-button small">View Document</button>
            </div>
          </div>
          <div className="sop-actions">
            <div className="sop-status pending">Pending Review</div>
            <div className="action-buttons">
              <button className="submit-button">Approve</button>
              <button className="cancel-button">Reject</button>
            </div>
            <div className="form-group">
              <label>Notes to President:</label>
              <textarea className="input textarea" placeholder="Add notes for the club president..."></textarea>
            </div>
          </div>
        </div>
        
        <div className="sop-item approved">
          <div className="sop-details">
            <h3>Tech Workshop</h3>
            <div className="sop-meta">
              <span className="sop-club">CS Club</span>
              <span className="sop-date">Submitted: May 10, 2025</span>
            </div>
            <div className="sop-description">
              <p>Workshop on web development technologies and tools.</p>
            </div>
            <div className="sop-file">
              <span className="file-icon">📄</span>
              <span className="file-name">TechWorkshop_SOP.pdf</span>
              <button className="action-button small">View Document</button>
            </div>
          </div>
          <div className="sop-actions">
            <div className="sop-status approved">Approved on May 12, 2025</div>
            <div className="approval-notes">
              <strong>Approval Notes:</strong>
              <p>SOP meets all requirements. Approved for implementation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Approve Budgets Section
function ApproveBudgetsSection() {
  return (
    <div className="section-container">
      <h2>Review and Approve Event Budgets</h2>
      
      <div className="filter-bar">
        <select className="input filter-select">
          <option value="all">All Budgets</option>
          <option value="pending">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <input type="text" className="input search-input" placeholder="Search by event or club..." />
      </div>
      
      <div className="budget-list">
        <div className="budget-item pending">
          <div className="budget-header">
            <h3>Tech Workshop</h3>
            <div className="budget-meta">
              <span className="budget-club">CS Club</span>
              <span className="budget-date">Submitted: May 12, 2025</span>
            </div>
          </div>
          
          <div className="budget-details">
            <div className="budget-summary">
              <div className="budget-summary-item">
                <span className="summary-label">Total Requested:</span>
                <span className="summary-value">$1,500.00</span>
              </div>
              <div className="budget-summary-item">
                <span className="summary-label">Budget Status:</span>
                <span className="summary-value pending">Pending Review</span>
              </div>
            </div>
            
            <div className="budget-line-items">
              <h4>Budget Line Items</h4>
              <table className="budget-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Speaker Fees</td>
                    <td>$500.00</td>
                  </tr>
                  <tr>
                    <td>Equipment Rental</td>
                    <td>$600.00</td>
                  </tr>
                  <tr>
                    <td>Refreshments</td>
                    <td>$250.00</td>
                  </tr>
                  <tr>
                    <td>Marketing Materials</td>
                    <td>$150.00</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td><strong>Total</strong></td>
                    <td><strong>$1,500.00</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="budget-documents">
              <h4>Supporting Documents</h4>
              <div className="document-list">
                <div className="document-item">
                  <span className="file-icon">📄</span>
                  <span className="file-name">Equipment_Quote.pdf</span>
                  <button className="action-button small">View</button>
                </div>
                <div className="document-item">
                  <span className="file-icon">📄</span>
                  <span className="file-name">Speaker_Agreement.pdf</span>
                  <button className="action-button small">View</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="budget-actions">
            <div className="form-group">
              <label>Adjustment Notes:</label>
              <textarea className="input textarea" placeholder="Add notes about any budget adjustments..."></textarea>
            </div>
            <div className="action-buttons">
              <button className="submit-button">Approve Budget</button>
              <button className="action-button">Request Revisions</button>
              <button className="cancel-button">Reject Budget</button>
            </div>
          </div>
        </div>
        
        <div className="budget-item pending">
          <div className="budget-header">
            <h3>Music Festival</h3>
            <div className="budget-meta">
              <span className="budget-club">Music Society</span>
              <span className="budget-date">Submitted: May 16, 2025</span>
            </div>
          </div>
          
          <div className="budget-details">
            <div className="budget-summary">
              <div className="budget-summary-item">
                <span className="summary-label">Total Requested:</span>
                <span className="summary-value">$3,500.00</span>
              </div>
              <div className="budget-summary-item">
                <span className="summary-label">Budget Status:</span>
                <span className="summary-value pending">Pending Review</span>
              </div>
            </div>
            
            <div className="budget-line-items">
              <h4>Budget Line Items</h4>
              <table className="budget-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Sound Equipment</td>
                    <td>$1,200.00</td>
                  </tr>
                  <tr>
                    <td>Stage Setup</td>
                    <td>$800.00</td>
                  </tr>
                  <tr>
                    <td>Lighting</td>
                    <td>$650.00</td>
                  </tr>
                  <tr>
                    <td>Marketing</td>
                    <td>$350.00</td>
                  </tr>
                  <tr>
                    <td>Miscellaneous</td>
                    <td>$500.00</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td><strong>Total</strong></td>
                    <td><strong>$3,500.00</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          <div className="budget-actions">
            <div className="form-group">
              <label>Adjustment Notes:</label>
              <textarea className="input textarea" placeholder="Add notes about any budget adjustments..."></textarea>
            </div>
            <div className="action-buttons">
              <button className="submit-button">Approve Budget</button>
              <button className="action-button">Request Revisions</button>
              <button className="cancel-button">Reject Budget</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Monitor Status Section
function MonitorStatusSection() {
  return (
    <div className="section-container">
      <h2>Monitor Event Status</h2>
      
      <div className="filter-bar">
        <select className="input filter-select">
          <option value="all">All Events</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        <input type="text" className="input search-input" placeholder="Search events..." />
      </div>
      
      <div className="event-status-grid">
        <div className="event-status-card pending">
          <div className="event-status-header">
            <h3>Music Festival</h3>
            <div className="event-date">June 2, 2025</div>
          </div>
          
          <div className="event-organizer">Music Society</div>
          
          <div className="approval-progress">
            <div className="progress-item completed">
              <div className="progress-icon">✓</div>
              <div className="progress-label">Event Created</div>
            </div>
            <div className="progress-item in-progress">
              <div className="progress-icon">⋯</div>
              <div className="progress-label">SOP Review</div>
            </div>
            <div className="progress-item pending">
              <div className="progress-icon">○</div>
              <div className="progress-label">Budget Approval</div>
            </div>
            <div className="progress-item pending">
              <div className="progress-icon">○</div>
              <div className="progress-label">Final Approval</div>
            </div>
          </div>
          
          <div className="event-status-actions">
            <button className="action-button">View Details</button>
            <div className="event-status-badge pending">Pending Approval</div>
          </div>
        </div>
        
        <div className="event-status-card approved">
          <div className="event-status-header">
            <h3>Tech Workshop</h3>
            <div className="event-date">May 25, 2025</div>
          </div>
          
          <div className="event-organizer">CS Club</div>
          
          <div className="approval-progress">
            <div className="progress-item completed">
              <div className="progress-icon">✓</div>
              <div className="progress-label">Event Created</div>
            </div>
            <div className="progress-item completed">
              <div className="progress-icon">✓</div>
              <div className="progress-label">SOP Approved</div>
            </div>
            <div className="progress-item completed">
              <div className="progress-icon">✓</div>
              <div className="progress-label">Budget Approved</div>
            </div>
            <div className="progress-item completed">
              <div className="progress-icon">✓</div>
              <div className="progress-label">Final Approval</div>
            </div>
          </div>
          
          <div className="event-status-actions">
            <button className="action-button">View Details</button>
            <div className="event-status-badge approved">Approved</div>
          </div>
        </div>
        
        <div className="event-status-card active">
          <div className="event-status-header">
            <h3>Career Fair</h3>
            <div className="event-date">June 10, 2025</div>
          </div>
          
          <div className="event-organizer">Career Services</div>
          
          <div className="approval-progress">
            <div className="progress-item completed">
              <div className="progress-icon">✓</div>
              <div className="progress-label">Event Created</div>
            </div>
            <div className="progress-item completed">
              <div className="progress-icon">✓</div>
              <div className="progress-label">SOP Approved</div>
            </div>
            <div className="progress-item completed">
              <div className="progress-icon">✓</div>
              <div className="progress-label">Budget Approved</div>
            </div>
            <div className="progress-item completed">
              <div className="progress-icon">✓</div>
              <div className="progress-label">Final Approval</div>
            </div>
          </div>
          
          <div className="event-status-info">
            <div className="info-item">
              <span className="info-label">Registrations:</span>
              <span className="info-value">45</span>
            </div>
            <div className="info-item">
              <span className="info-label">Published:</span>
              <span className="info-value">Yes</span>
            </div>
          </div>
          
          <div className="event-status-actions">
            <button className="action-button">View Details</button>
            <div className="event-status-badge active">Registration Open</div>
          </div>
        </div>
        
        <div className="event-status-card pending">
          <div className="event-status-header">
            <h3>Hackathon 2025</h3>
            <div className="event-date">June 15, 2025</div>
          </div>
          
          <div className="event-organizer">Coding Club</div>
          
          <div className="approval-progress">
            <div className="progress-item completed">
              <div className="progress-icon">✓</div>
              <div className="progress-label">Event Created</div>
            </div>
            <div className="progress-item in-progress">
              <div className="progress-icon">⋯</div>
              <div className="progress-label">SOP Review</div>
            </div>
            <div className="progress-item pending">
              <div className="progress-icon">○</div>
              <div className="progress-label">Budget Approval</div>
            </div>
            <div className="progress-item pending">
              <div className="progress-icon">○</div>
              <div className="progress-label">Final Approval</div>
            </div>
          </div>
          
          <div className="event-status-actions">
            <button className="action-button">View Details</button>
            <div className="event-status-badge pending">Pending Approval</div>
          </div>
        </div>
      </div>
    </div>
  )
} 