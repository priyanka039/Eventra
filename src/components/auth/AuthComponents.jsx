import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { setAuthToken, removeAuthToken } from '../../utils/auth'

// Login Page Component
export const LoginPage = ({ onLoginSuccess }) => {
  const [step, setStep] = useState('credentials') // 'credentials' or 'otp'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost:5273/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      if (data.data.requiresOTP) {
        setStep('otp')
      } else {
        setAuthToken(data.data.token)
        onLoginSuccess(data.data.user, data.data.user.role)

        // Redirect based on role
        switch (data.data.user.role) {
          case 'student':
            navigate('/student-homepage')
            break
          case 'president':
            navigate('/president-homepage')
            break
          case 'management':
            navigate('/management-homepage')
            break
          default:
            navigate('/')
        }
      }
    } catch (error) {
      setError(error.message)
    }
  }

  const handleOTPSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost:5273/api/users/verify-login-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed')
      }

      setAuthToken(data.data.token)
      onLoginSuccess(data.data.user, data.data.user.role)

      // Redirect based on role
      switch (data.data.user.role) {
        case 'student':
          navigate('/student-homepage')
          break
        case 'president':
          navigate('/president-homepage')
          break
        case 'management':
          navigate('/management-homepage')
          break
        default:
          navigate('/')
      }
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      
      {step === 'credentials' ? (
        <form onSubmit={handleCredentialsSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      ) : (
        <form onSubmit={handleOTPSubmit}>
          <div className="form-group">
            <label>Enter OTP sent to your email:</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              required
              maxLength={6}
              pattern="[0-9]{6}"
              title="Please enter the 6-digit OTP"
            />
          </div>
          <button type="submit">Verify OTP</button>
        </form>
      )}
      
      <p>
        Don't have an account?{' '}
        <span onClick={() => navigate('/signup')} className="link">
          Sign up
        </span>
      </p>
    </div>
  )
}

// Signup Page Component
export const SignupPage = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    role: 'student',
    otp: ''
  })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    try {
      const response = await fetch('http://localhost:5273/api/users/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: formData.email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP')
      }

      setMessage('OTP sent to your email')
      setStep(2)
    } catch (error) {
      setError(error.message)
    }
  }

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost:5273/api/users/verify-otp-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      setAuthToken(data.data.token)
      navigate('/')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      
      {step === 1 ? (
        <form onSubmit={handleSendOTP}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={handleVerifyAndRegister}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label>Role:</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="student">Student</option>
              <option value="president">President</option>
              <option value="management">Management</option>
            </select>
          </div>
          <div className="form-group">
            <label>OTP:</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Register</button>
        </form>
      )}
      
      <p>
        Already have an account?{' '}
        <span onClick={() => navigate('/')} className="link">
          Login
        </span>
      </p>
    </div>
  )
}


// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { setAuthToken, removeAuthToken } from '../../utils/auth'

// // Login Page Component
// export const LoginPage = ({ onLoginSuccess }) => {
//   const [step, setStep] = useState('credentials') // 'credentials' or 'otp'
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     otp: ''
//   })
//   const [error, setError] = useState('')
//   const navigate = useNavigate()

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   const handleCredentialsSubmit = async (e) => {
//     e.preventDefault()
//     setError('')

//     try {
//       const response = await fetch('http://localhost:5273/api/users/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         credentials: 'include',
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.password
//         })
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.message || 'Login failed')
//       }

//       if (data.data.requiresOTP) {
//         setStep('otp')
//       } else {
//         setAuthToken(data.data.token)
//         onLoginSuccess(data.data.user, data.data.user.role)

//         // Redirect based on role
//         switch (data.data.user.role) {
//           case 'student':
//             navigate('/student-homepage')
//             break
//           case 'president':
//             navigate('/president-homepage')
//             break
//           case 'management':
//             navigate('/management-homepage')
//             break
//           default:
//             navigate('/')
//         }
//       }
//     } catch (error) {
//       setError(error.message)
//     }
//   }

//   const handleOTPSubmit = async (e) => {
//     e.preventDefault()
//     setError('')

//     try {
//       const response = await fetch('http://localhost:5273/api/users/verify-login-otp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         credentials: 'include',
//         body: JSON.stringify({
//           email: formData.email,
//           otp: formData.otp
//         })
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.message || 'OTP verification failed')
//       }

//       setAuthToken(data.data.token)
//       onLoginSuccess(data.data.user, data.data.user.role)

//       // Redirect based on role
//       switch (data.data.user.role) {
//         case 'student':
//           navigate('/student-homepage')
//           break
//         case 'president':
//           navigate('/president-homepage')
//           break
//         case 'management':
//           navigate('/management-homepage')
//           break
//         default:
//           navigate('/')
//       }
//     } catch (error) {
//       setError(error.message)
//     }
//   }

//   return (
//     <div className="auth-container">
//       <h2>Login</h2>
//       {error && <div className="error-message">{error}</div>}
      
//       {step === 'credentials' ? (
//         <form onSubmit={handleCredentialsSubmit}>
//           <div className="form-group">
//             <label>Email:</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label>Password:</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <button type="submit">Login</button>
//         </form>
//       ) : (
//         <form onSubmit={handleOTPSubmit}>
//           <div className="form-group">
//             <label>Enter OTP sent to your email:</label>
//             <input
//               type="text"
//               name="otp"
//               value={formData.otp}
//               onChange={handleChange}
//               required
//               maxLength={6}
//               pattern="[0-9]{6}"
//               title="Please enter the 6-digit OTP"
//             />
//           </div>
//           <button type="submit">Verify OTP</button>
//         </form>
//       )}
      
//       <p>
//         Don't have an account?{' '}
//         <span onClick={() => navigate('/signup')} className="link">
//           Sign up
//         </span>
//       </p>
//     </div>
//   )
// }

// // Signup Page Component
// export const SignupPage = () => {
//   const [step, setStep] = useState(1)
//   const [formData, setFormData] = useState({
//     email: '',
//     name: '',
//     password: '',
//     role: 'student',
//     otp: ''
//   })
//   const [error, setError] = useState('')
//   const [message, setMessage] = useState('')
//   const navigate = useNavigate()

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   const handleSendOTP = async (e) => {
//     e.preventDefault()
//     setError('')
//     setMessage('')

//     try {
//       const response = await fetch('http://localhost:5273/api/users/send-otp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email: formData.email })
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to send OTP')
//       }

//       setMessage('OTP sent to your email')
//       setStep(2)
//     } catch (error) {
//       setError(error.message)
//     }
//   }

//   const handleVerifyAndRegister = async (e) => {
//     e.preventDefault()
//     setError('')

//     try {
//       const response = await fetch('http://localhost:5273/api/users/verify-otp-register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         credentials: 'include',
//         body: JSON.stringify(formData)
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.message || 'Registration failed')
//       }

//       setAuthToken(data.data.token)
//       navigate('/')
//     } catch (error) {
//       setError(error.message)
//     }
//   }

//   return (
//     <div className="auth-container">
//       <h2>Sign Up</h2>
//       {error && <div className="error-message">{error}</div>}
//       {message && <div className="success-message">{message}</div>}
      
//       {step === 1 ? (
//         <form onSubmit={handleSendOTP}>
//           <div className="form-group">
//             <label>Email:</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <button type="submit">Send OTP</button>
//         </form>
//       ) : (
//         <form onSubmit={handleVerifyAndRegister}>
//           <div className="form-group">
//             <label>Name:</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label>Password:</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               minLength={6}
//             />
//           </div>
//           <div className="form-group">
//             <label>Role:</label>
//             <select name="role" value={formData.role} onChange={handleChange} required>
//               <option value="student">Student</option>
//               <option value="president">President</option>
//               <option value="management">Management</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <label>OTP:</label>
//             <input
//               type="text"
//               name="otp"
//               value={formData.otp}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <button type="submit">Register</button>
//         </form>
//       )}
      
//       <p>
//         Already have an account?{' '}
//         <span onClick={() => navigate('/')} className="link">
//           Login
//         </span>
//       </p>
//     </div>
//   )
// }


