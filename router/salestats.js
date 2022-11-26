const express = require('express');
const router = express.Router();
const getDb = require('../database/database').getDb;
const {ObjectId} = require('mongodb');

router.use('/salestats', (req, res, next)=>{
    console.log('sale statistics')
    let db = getDb();
    let data = {}
    db.collection('users').find({}).toArray().then((response)=>{
        data.users = response
        db.collection('cycles').find({}, {images: 0}).toArray().then((response)=>{
            data.products = response;
            res.send({data: data})
        })

    })
})

exports.salestat = router