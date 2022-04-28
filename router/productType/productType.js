const getDb = require('../../database/database').getDb;
const express = require('express');
const router = express.Router()

router.use('/addProductType', (req, res, next)=>{
    let db = getDb();
    console.log("product type")
    const {name} = req.headers;
    const name2 = name.toUpperCase();
    db.collection('productType').find({name: name2}).toArray().then((response)=>{
        if(response.length > 0){
            res.send({status: 'alreadyInserted'})
        }else{
            db.collection('productType').insertOne({name: name2}).then((response)=>{
                let obj = {name: name2}
                res.send(obj)
            })
        }
    })
    
})

router.use('/displayProductType', (req,res, next)=>{
    let db = getDb();
    console.log("Product Type Display")
    db.collection('productType').find({}).toArray().then((response)=>{
        res.send(response)
    })  
})


exports.productType = router