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
    let array = []
    db.collection('category').find({parentName: null}).toArray().then((response) => {
        response.map((singleId)=>{
            array.push({name: singleId.name, _id: singleId._id, hover: false})
        })
        db.collection('productType').find({}).toArray().then((response)=>{
            response.map((single)=>{
                array.push({name: single.name, _id: single._id, hover: true})
            })
            res.send(array)
        })
    }) 
})


exports.productType = router