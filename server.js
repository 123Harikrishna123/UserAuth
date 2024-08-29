const express = require('express');
const mongoose = require('mongoose');
const model =require('./model');
const Registration= require('./model');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware');
const { await } = require('react-router-dom');
// const cors = require('cors');


const app = express();

mongoose.connect('mongodb+srv://Hari:express.js@cluster0.l8stbdd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(
    ()=> console.log('DB connected !')
)

app.use(express.json());

app.post('/register' , async (req,res) =>{
    try{
        const {username,email,password,confirmpassword} = req.body;
        let exist = await  Registration.findOne({email:email})
        if(exist){
            return res.status(400).send('User alredy exist')
        }
        if(password  !== confirmpassword){
            return res.status(400).send('password do not matched')
        }

        let Newuser = new Registration({
            username,
            email,
            password,
            confirmpassword,
        })
         await Newuser.save();
          res.send('user registartion sucseccfull');

    }
    catch(err){
        console.log(err)
        return res.status(200).send('internal error ');
    }
})

app.post('/login' , async (req,res) =>{
    const {email,password}=req.body;
    let exist = await Registration.findOne({email:email})
    if(!exist){
        return res.status(400).send('user not found');
    }
    if(exist.password !== password){
        return res.status(400).send('inavalid credentials');
    }
    let payload ={
        user:{
            id : exist.id
        }
    
    }
    jwt.sign(payload,'jwtSecret',{expiresIn:'1h'},
        (err,token) =>{
            if(err) throw err ;
            return res.json({token})
        }

    )
})

app.get('/myprofile',middleware, async (req,res)=>{
    try{
        
       let exist = await Registration.findById(req.user.id);
       if(!exist){
        return res.status(400).send('User not found');
       }
       res.json(exist);
    }
    catch(err){
        console.log(err);
        return res.status(500).json({msg:'server not running'});
    }
})

// const corsOption = {
//     origin: ['http://localhost:3000'],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
// }
// app.use(cors(corsOption));

app.listen(7000 ,()=>{
    console.log('server running sucsessfull')
})