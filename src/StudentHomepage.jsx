// import { useState, useEffect } from 'react';
// import { Calendar, Clock, MapPin, MessageSquare, CheckCircle, Star, X, Search } from 'lucide-react';
// import './styles/eventra-styles.css';

// export default function StudentHomepage() {
//   const [events, setEvents] = useState([]);
//   const [activeTab, setActiveTab] = useState('discover');
//   const [registeredEvents, setRegisteredEvents] = useState([]);
//   const [feedbackEvents, setFeedbackEvents] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [feedbackForm, setFeedbackForm] = useState({
//     eventId: null,
//     rating: 0,
//     comments: ''
//   });

//   // Mock data for demonstration
//   useEffect(() => {
//     const mockEvents = [
//       {
//         id: 1,
//         title: 'Annual Tech Conference',
//         date: '2025-05-25',
//         time: '09:00 AM - 05:00 PM',
//         location: 'Main Auditorium',
//         description: 'Join us for the annual technology conference featuring speakers from leading tech companies.',
//         category: 'Technology',
//         image: '/api/placeholder/800/400'
//       },
//       {
//         id: 2,
//         title: 'Career Fair',
//         date: '2025-05-30',
//         time: '10:00 AM - 03:00 PM',
//         location: 'Student Center',
//         description: 'Connect with potential employers and explore career opportunities in various industries.',
//         category: 'Career',
//         image: '/api/placeholder/800/400'
//       },
//       {
//         id: 3,
//         title: 'Cultural Festival',
//         date: '2025-06-05',
//         time: '11:00 AM - 08:00 PM',
//         location: 'Campus Green',
//         description: 'Experience diverse cultures through food, performances, and interactive activities.',
//         category: 'Cultural',
//         image: '/api/placeholder/800/400'
//       },
//       {
//         id: 4,
//         title: 'Workshop: Leadership Skills',
//         date: '2025-06-10',
//         time: '02:00 PM - 04:00 PM',
//         location: 'Room 201',
//         description: 'Develop essential leadership skills through interactive exercises and discussions.',
//         category: 'Workshop',
//         image: '/api/placeholder/800/400'
//       }
//     ];

//     const mockRegistered = [
//       {
//         ...mockEvents[0],
//         registrationDate: '2025-05-10',
//         status: 'Upcoming'
//       },
//       {
//         ...mockEvents[2],
//         registrationDate: '2025-05-15',
//         status: 'Upcoming'
//       }
//     ];

//     const mockFeedback = [
//       {
//         id: 5,
//         title: 'Alumni Networking Event',
//         date: '2025-05-15',
//         feedbackSubmitted: false
//       },
//       {
//         id: 6,
//         title: 'Coding Bootcamp',
//         date: '2025-05-12',
//         feedbackSubmitted: true
//       }
//     ];

//     setEvents(mockEvents);
//     setRegisteredEvents(mockRegistered);
//     setFeedbackEvents(mockFeedback);
//   }, []);

//   const handleRegister = (event) => {
//     const isRegistered = registeredEvents.some(e => e.id === event.id);
    
//     if (isRegistered) {
//       setRegisteredEvents(registeredEvents.filter(e => e.id !== event.id));
//     } else {
//       const newRegistration = {
//         ...event,
//         registrationDate: new Date().toISOString().split('T')[0],
//         status: 'Upcoming'
//       };
//       setRegisteredEvents([...registeredEvents, newRegistration]);
//     }
//   };

//   const openFeedbackForm = (eventId) => {
//     setFeedbackForm({
//       eventId,
//       rating: 0,
//       comments: ''
//     });
//   };

//   const submitFeedback = () => {
//     // In a real app, this would send the feedback to an API
//     console.log('Feedback submitted:', feedbackForm);
    
//     // Update the event to show feedback was submitted
//     setFeedbackEvents(feedbackEvents.map(event => 
//       event.id === feedbackForm.eventId 
//         ? { ...event, feedbackSubmitted: true } 
//         : event
//     ));
    
//     // Reset the form
//     setFeedbackForm({
//       eventId: null,
//       rating: 0,
//       comments: ''
//     });
//   };

//   const filteredEvents = events.filter(event => 
//     event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     event.category.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="app-container">
//       {/* Header */}
//       <header className="header">
//         <div className="container header-content">
//           <h1 className="logo">Eventra</h1>
//           <div className="header-actions">
//             <button className="icon-button">
//               <MessageSquare size={20} />
//             </button>
//             <div className="avatar">
//               JS
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Navigation Tabs */}
//       <nav className="nav">
//         <div className="container">
//           <ul className="nav-tabs">
//             <li 
//               className={`nav-tab ${activeTab === 'discover' ? 'active' : ''}`}
//               onClick={() => setActiveTab('discover')}
//             >
//               Discover Events
//             </li>
//             <li 
//               className={`nav-tab ${activeTab === 'registered' ? 'active' : ''}`}
//               onClick={() => setActiveTab('registered')}
//             >
//               My Events
//             </li>
//             <li 
//               className={`nav-tab ${activeTab === 'feedback' ? 'active' : ''}`}
//               onClick={() => setActiveTab('feedback')}
//             >
//               Feedback
//             </li>
//           </ul>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="main-content">
//         <div className="container">
//           {/* Discover Events Tab */}
//           {activeTab === 'discover' && (
//             <div className="fade-in">
//               <div className="section-header">
//                 <h2 className="section-title">Discover Events</h2>
//                 <div className="search-container">
//                   <input
//                     type="text"
//                     placeholder="Search events..."
//                     className="search-input"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                   <span className="search-icon">
//                     <Search size={16} />
//                   </span>
//                 </div>
//               </div>

//               {filteredEvents.length > 0 ? (
//                 <div className="card-grid">
//                   {filteredEvents.map(event => (
//                     <div key={event.id} className="event-card">
//                       <img src={event.image} alt={event.title} className="card-image" />
//                       <div className="card-content">
//                         <h3 className="card-title">{event.title}</h3>
//                         <div className="event-info">
//                           <div className="info-item">
//                             <Calendar size={16} />
//                             <span>{event.date}</span>
//                           </div>
//                           <div className="info-item">
//                             <Clock size={16} />
//                             <span>{event.time}</span>
//                           </div>
//                           <div className="info-item">
//                             <MapPin size={16} />
//                             <span>{event.location}</span>
//                           </div>
//                         </div>
//                         <p className="card-description">{event.description}</p>
//                         <div className="card-footer">
//                           <span className="category-tag">{event.category}</span>
//                           <button
//                             onClick={() => handleRegister(event)}
//                             className={`btn ${
//                               registeredEvents.some(e => e.id === event.id)
//                                 ? 'btn-success'
//                                 : 'btn-primary'
//                             }`}
//                           >
//                             {registeredEvents.some(e => e.id === event.id) ? (
//                               <>
//                                 <CheckCircle size={16} />
//                                 Registered
//                               </>
//                             ) : (
//                               'Register'
//                             )}
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="empty-state">
//                   <p className="empty-message">No events found matching your search.</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* My Events Tab */}
//           {activeTab === 'registered' && (
//             <div className="fade-in">
//               <h2 className="section-title">My Registered Events</h2>
              
//               {registeredEvents.length > 0 ? (
//                 <div className="event-list">
//                   {registeredEvents.map(event => (
//                     <div key={event.id} className="event-list-item">
//                       <img src={event.image} alt={event.title} className="event-list-image" />
//                       <div className="event-list-content">
//                         <div className="event-list-header">
//                           <h3 className="event-list-title">{event.title}</h3>
//                           <span className={`event-status ${
//                             event.status === 'Upcoming' ? 'status-upcoming' : 'status-past'
//                           }`}>
//                             {event.status}
//                           </span>
//                         </div>
//                         <div className="event-list-info">
//                           <div className="info-item">
//                             <Calendar size={16} />
//                             <span>{event.date}</span>
//                           </div>
//                           <div className="info-item">
//                             <Clock size={16} />
//                             <span>{event.time}</span>
//                           </div>
//                           <div className="info-item">
//                             <MapPin size={16} />
//                             <span>{event.location}</span>
//                           </div>
//                         </div>
//                         <div className="event-list-actions">
//                           <button className="btn btn-primary">
//                             View Details
//                           </button>
//                           <button 
//                             onClick={() => handleRegister(event)}
//                             className="btn btn-danger"
//                           >
//                             <X size={16} />
//                             Cancel
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="empty-state">
//                   <p className="empty-message">You haven't registered for any events yet.</p>
//                   <button 
//                     onClick={() => setActiveTab('discover')}
//                     className="btn btn-primary"
//                   >
//                     Discover Events
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Feedback Tab */}
//           {activeTab === 'feedback' && (
//             <div className="fade-in">
//               <h2 className="section-title">Event Feedback</h2>
              
//               {feedbackForm.eventId ? (
//                 <div className="feedback-form">
//                   <h3 className="form-title">Submit Feedback</h3>
//                   <div>
//                     <div className="form-group">
//                       <label className="form-label">Rate your experience:</label>
//                       <div className="star-rating">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                           <button
//                             key={star}
//                             type="button"
//                             onClick={() => setFeedbackForm({...feedbackForm, rating: star})}
//                             className="star-btn"
//                           >
//                             <Star
//                               fill={feedbackForm.rating >= star ? "#FFBA08" : "none"}
//                               color={feedbackForm.rating >= star ? "#FFBA08" : "#CBD5E0"}
//                               size={24}
//                             />
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                     <div className="form-group">
//                       <label className="form-label">Comments:</label>
//                       <textarea
//                         className="textarea"
//                         rows="4"
//                         value={feedbackForm.comments}
//                         onChange={(e) => setFeedbackForm({...feedbackForm, comments: e.target.value})}
//                         placeholder="Share your thoughts about the event..."
//                       ></textarea>
//                     </div>
//                     <div className="form-actions">
//                       <button
//                         type="button"
//                         onClick={() => setFeedbackForm({eventId: null, rating: 0, comments: ''})}
//                         className="btn btn-outline"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="button"
//                         onClick={submitFeedback}
//                         className="btn btn-primary"
//                         disabled={feedbackForm.rating === 0}
//                       >
//                         Submit Feedback
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="event-list">
//                   {feedbackEvents.map(event => (
//                     <div key={event.id} className="feedback-list-item">
//                       <div className="feedback-header">
//                         <div>
//                           <h3 className="feedback-title">{event.title}</h3>
//                           <p className="feedback-date">Attended on {event.date}</p>
//                         </div>
//                         {event.feedbackSubmitted ? (
//                           <span className="feedback-submitted">
//                             <CheckCircle size={16} />
//                             Feedback Submitted
//                           </span>
//                         ) : (
//                           <button
//                             onClick={() => openFeedbackForm(event.id)}
//                             className="btn btn-primary"
//                           >
//                             Submit Feedback
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   ))}

//                   {feedbackEvents.length === 0 && (
//                     <div className="empty-state">
//                       <p className="empty-message">No events to provide feedback for.</p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }