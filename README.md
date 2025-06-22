# Eventra

A full-stack campus event management system with role-based dashboards for Students, Club Presidents, and Management.  
Built with React (Vite) for the frontend and Node.js/Express/MongoDB for the backend.

---

## Features

- **Student Dashboard:**  
  - Discover, register for, and track events  
  - View notifications and feedback  
  - Modern, accessible UI

- **President Dashboard:**  
  - Create events, upload SOPs, submit budgets  
  - Track event approval status  
  - Receive notifications

- **Management Dashboard:**  
  - Review, approve, or reject events  
  - Monitor all campus events  
  - Receive notifications

- **Authentication:**  
  - Secure login/signup with OTP verification  
  - Role-based access control

- **Notifications:**  
  - Real-time notification bar with unread badge

---

## Project Structure

```
eventra/
  Eventra/
    src/           # Frontend React app
    server/        # Backend Node.js/Express API
```

---

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/priyanka039/Eventra.git
cd Eventra
```

---

### 2. Install dependencies

#### Frontend

```sh
cd Eventra
npm install
```

#### Backend

```sh
cd server
npm install
```

---

### 3. Set up environment variables

#### Backend (`Eventra/server/.env`)

Create a `.env` file with the following (example):

```
MONGO_URI=mongodb://localhost:27017/eventra
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

---

### 4. Run the application

#### Start the backend

```sh
cd Eventra/server
npm start
```
- Runs on [http://localhost:5273](http://localhost:5273) by default

#### Start the frontend

```sh
cd ../
npm run dev
```
- Runs on [http://localhost:5173](http://localhost:5173) by default

---

## Usage

- Visit [http://localhost:5173](http://localhost:5173) in your browser.
- Register as a student, president, or management.
- Explore the dashboards and features based on your role.

---

## Tech Stack

- **Frontend:** React, Vite, React Router, modern CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Nodemailer
- **Other:** ESLint, dotenv, bcrypt, OTP verification

---

## Scripts

### Frontend

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run lint` — Lint code

### Backend

- `npm start` — Start backend with nodemon

---

