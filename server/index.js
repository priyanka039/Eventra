// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const userRoutes = require('./routes/userRoutes');

// // Load environment variables
// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors({
//   origin: 'http://localhost:5173', // Your frontend Vite app
//   credentials: true
// }));
// app.use(express.json());

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI || "mongodb+srv://eventra_admin:eventra123@eventra-cluster.myc5y82.mongodb.net/", {
//   dbName: "eventraDB" // Optional: specifies which DB to use
// })
// .then(() => {
//   console.log("✅ Connected to MongoDB");
// })
// .catch((err) => {
//   console.error("❌ MongoDB connection error:", err);
// });

// // Routes
// app.use('/api/users', userRoutes);

// // Test route
// app.get('/', (req, res) => {
//   res.send('✅ API is running...');
// });

// const PORT = process.env.PORT || 5273;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

// // const express = require("express");
// // const mongoose = require("mongoose");
// // const cors = require("cors");
// // const User = require("./models/User");

// // const app = express();

// // // Middleware
// // app.use(express.json());
// // app.use(cors({
// //   origin: "http://localhost:5173", // your frontend Vite app
// //   credentials: true
// // }));

// // // Connect to MongoDB
// // mongoose.connect("mongodb+srv://eventra_admin:eventra123@eventra-cluster.myc5y82.mongodb.net/", {
//   dbName: "eventraDB" // optional: helps Mongo know which DB to use
// })
// .then(() => {
//   console.log("✅ Connected to MongoDB");
// })
// .catch((err) => {
//   console.error("❌ MongoDB connection error:", err);
// });

// // Routes

// // Test route
// app.get("/", (req, res) => {
//   res.send("✅ API is running...");
// });

// // Signup
// app.post("/signup", async (req, res) => {
//   try {
//     const user = await User.create(req.body);
//     res.json(user);
//   } catch (err) {
//     console.error("Signup error:", err);
//     res.status(500).json({ error: "Failed to register user" });
//   }
// });

// // Login
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json("No record existed");
//     }

//     if (user.password !== password) {
//       return res.status(401).json("The password is incorrect");
//     }

//     res.json("success");
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json("Server error during login");
//   }
// });

// // Start server
// const PORT = 5273;
// app.listen(PORT, () => {
//   console.log(`🚀 Server is running at http://localhost:${PORT}`);
// });


// // const express = require("express")
// // const mongoose = require("mongoose")
// // const cors = require("cors")
// // const User = require('./models/User')

// // const app = express()

// // app.use(express.json())
// // app.use(cors())


// // mongoose.connect("mongodb+srv://eventra_admin:eventra123@eventra-cluster.myc5y82.mongodb.net/")
// //  .then(() => {
// //     console.log("connected to mongodb")
// //  })
// //     .catch((err) => {
// //         console.log(err)
// //     })
  


// // app.post('/signup', (req, res) =>{
// //     User.create(req.body)
// //     .then(user => res.json(user))
// //     .catch(err => res.json(err))
// // })

// // app.post('/login', (req, res)=>{
// //     const {email, password} = req.body;
// //     User.findOne({email: email})
// //     .then(user =>{
// //         if(user){
// //             if(user.password === password){
// //                 res.json("success");
// //             } else{
// //                 res.json("the password is incorrect");
// //             }
// //         } else{
// //             res.json("No record existed")
// //         }
// //     })
// // })

// // app.listen(5273, ()=>{
// //      console.log("server is running");
// // })
// // app.listen(3001, ()=>{
// //      console.log("server is running");
// // })