const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const User = require('./models/User')

const app = express()

app.use(express.json())
app.use(cors())


mongoose.connect("mongodb+srv://eventra_admin:eventra123@eventra-cluster.myc5y82.mongodb.net/");


app.post('/signup', (req, res) =>{
    User.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.json(err))
})

app.post('/login', (req, res)=>{
    const {email, password} = req.body;
    User.findOne({email: email})
    .then(user =>{
        if(user){
            if(user.password === password){
                res.json("success");
            } else{
                res.json("the password is incorrect");
            }
        } else{
            res.json("No record existed")
        }
    })
})

app.listen(3001, ()=>{
     console.log("server is running");
})