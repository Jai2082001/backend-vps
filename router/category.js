const { response } = require('express');
const express = require('express');
const router = express.Router();
const getDb = require('../database/database').getDb;


router.use('/categoryAdd', (req, res, next) => {
    let db = getDb();
    let {name, img, parentName, filterArray} = req.body;
    let {addedby} = req.headers;
    console.log("Category Add")
    console.log(parentName)
    db.collection('category').find({ name: name, parentName: parentName }).toArray().then((response) => {
        if (response.length>0) {
            res.send({status: 'Already In Database'})
        } else {
            db.collection('category').insertOne({ parentName: parentName, name: name , img: img, addedby: addedby, filterArray: filterArray}).then((response) => {
                res.send(response);
        })    
        }
    })
})

router.use('/categoryEdit', (req, res, next)=>{
    let db = getDb();
    let {oldname, name, img, parentName} = req.body;
    console.log("Edit Category");
    db.collection('category').updateOne({name: oldname}, {
        $set: {
            name: name,
            img: img,
            parentName: parentName
        }
    }).then((response)=>{
        res.send(response)
    })
})



router.use('/categoryDisplaySub', (req, res, next)=>{
    let db = getDb();
    let {addedby} = req.headers;
    db.collection('category').find({addedby}).toArray().then((response)=>{
        res.send(response);
    })
})

router.use('/categoryAddSub', (req, res, next)=>{
    let db = getDb();
    let {name, img} = req.body;
    let {addedby} = req.headers;
    db.collection('category').insertOne({name: name, img: img, addedby: addedby}).then((response)=>{
        res.send(response)
    })
})

router.use('/categoriesDisplay', (req, res, next)=>{
    let db = getDb();
    let {single} = req.headers;
    console.log(req.headers)
    console.log(single)
    db.collection('category').find({parentName: single}).toArray().then((response)=>{
        console.log(response);
        res.send(response)
    })
})

router.use('/categoryDisplay', (req, res, next) => {
    let db = getDb();
    db.collection('category').find().toArray().then((response) => {
        res.send(response)  
    })
})

exports.categoryAdd = router