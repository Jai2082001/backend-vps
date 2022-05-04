const express = require('express');
const router = express.Router();
const { getDb } = require('../../database/database')
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { response } = require('express');

router.use('/registerUserSignUp', (req, res, next) => {
    let db = getDb();
    const {name, email, number, password} = req.headers
    db.collection('users').insertOne({ name: name, email: email, number: number, password: password }).then((response) => {
        res.send({status: 'insertedUser'})
    })
})

router.use('/finalRegister', (req,res, next)=>{
    let db = getDb();
    const { number, pass} = req.headers;
    db.collection('users').insertOne({ name: '!!', email: '!!', number: number, password: pass }).then((response) => {
        res.send(response)
    })
})
router.use('/numberOtpGen', (req, res, next)=>{
    const {number} = req.headers
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    let db = getDb()
    db.collection('users').findOne({number: number}).then((response)=>{
        if(response){
            db.collection('otp').findOne({number: number}).then((response)=>{
                if(response){
                    db.collection('otp').updateOne({number: number}, {$set: {
                        otp: randomNum
                    }}).then((response)=>{
                        res.send({otp: randomNum})
                    })
                }else{
                    db.collection('otp').insertOne({number: number, otp: randomNum}).then((response)=>{
                        console.log(response)
                        res.send({otp: randomNum})
                    })
                }
            })
        }else{
            res.send({error: "Nouser"})
        }
        
    })
    
})

router.use('/numberOtpGenReg', (req,res, next)=>{
    let db = getDb();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const {number} = req.headers;
    db.collection('users').findOne({number: number}).then((response)=>{
        if(response){
            res.send({error: 'already'})
        }else{
            db.collection('otp').findOne({number: number}).then((response)=>{
                if(response){
                    db.collection('otp').updateOne({number: number}, {$set: {
                        otp: randomNum
                    }}).then((response)=>{
                        res.send({otp: randomNum})
                    })
                }else{
                    db.collection('otp').insertOne({number: number, otp: randomNum}).then((response)=>{
                        console.log(response)
                        res.send({otp: randomNum})
                    })
                }
            })
        }
    })
    
})

router.use('/checkOtp', (req, res, next)=>{
    let db = getDb();
    const {phone, otp} = req.headers
    db.collection('otp').findOne({number: phone, otp: parseInt(otp)}).then((response)=>{
        if(response){
            res.send({status: 'done'})
        }else{
            res.send({status: 'error'})
        }
    })
})


router.use('/updateUser', (req, res, next)=>{
    let db = getDb();
    const {name, email, number, id} = req.headers;
    db.collection('users').updateOne({_id: new ObjectId(id)}, {
        $set: {
            name: name,
            email: email,
            number: number   
        }
    }).then((response)=>{
        res.send(response)
    })
})

router.use('/logoutUser', (req, res, next)=>{
    res.cookie('jwt', '', {
        expires: 0,
        httpOnly: true,
    })
    res.status(200).json({ success: true, message: 'User logged out successfully' })
})

router.use('/loginUser', (req, res, next) => {
    let db = getDb();
    console.log("login user")
    const { phone, otp } = req.headers;
    console.log(phone, otp)
    db.collection('otp').findOne({ number: phone, otp: parseInt(otp) }).then((response) => {
        if (response) {
            // const token = response._id
            // res.cookie('jwt', token)
            db.collection("users").findOne({number: phone}).then((response)=>{
                if(response){
                    res.send(response)
                }else{
                    res.send({message: 'no authentication'})
                }
            })
        } else {
            console.log("No Authentication")
            res.send({message: 'no authentication'})
        }
    })
})

router.use('/directLogin', (req, res, next)=>{
    let db = getDb();
    console.log("direct login")
    const {number, password} = req.headers
    db.collection('users').findOne({number: number, password: password}).then((response)=>{
        if(response){
            res.send(response)
        }else{
            res.send({message: 'no authentication'})
        }
    })
})


router.use('/userAuthenticated', (req, res, next) => {
    // const cookie = req.cookies['jwt'];
    // const cookie2 = req.cookies;
    const cookie = req.headers.jwt;
    console.log(cookie)
    console.log("User Authenticated")
    let db = getDb();
    if(cookie && cookie !== 'undefined'){
        const myId = new ObjectId(cookie);
        db.collection('users').findOne({ _id: myId }).then((response) => {
            if (response) {
             res.send(response);        
            } else {
                res.send({status: 'not logged in'})
            }
        })
    }else{
        res.send({status: 'not logged in'})
    }
   
})

router.use('/addUserAddress', (req, res, next) => {
    const cookie = req.headers.jwt;
    console.log(req.headers)
    console.log('user address')
    console.log(cookie)
    if (!cookie) {
        return res.send({status: 'not logged in'})      
    }    
    if (cookie === 'undefined'){
        return res.send({status:  'not logged in'})
    }
    else{
        let db = getDb();
        const { fullname, city, number, state, address, alternatenum, pincode } = req.headers;
        db.collection('address').insertOne({ fullname: fullname, number: number, state: state, address: address, alternatenum: alternatenum, pincode: pincode, city: city }).then((response) => {
        db.collection('users').updateOne({ _id: new ObjectId(cookie) }, {
        $push: {
            address: response.insertedId 
        }
        }).then((response) => {
            res.send(response)
        })
    })
    }
    
})

exports.registerUser = router