const express = require('express');
const router = express.Router();
const getDb = require('../../database/database').getDb;
const {ObjectId} = require('mongodb');


router.use('/productStruct', (req, res, next)=>{
    console.log("product structure")
    let db = getDb();
    let {productType, category} = req.body;
    let length = category.length;
    let index = 0;
    category.map((singleItem)=>{
        db.collection('category').find({name: singleItem.name, parentName: productType}).toArray().then((response)=>{
            if(response.length > 0){
                res.send({status: 'Already a product category combinationn'})
            }else{
                db.collection('category').insertOne({parentName: productType, name: singleItem.name, img: singleItem.img, addedby: 'admin', filterArray: singleItem.filterArray}).then((response)=>{
                    index++
                    if(index === category.length){
                        res.send({status: "done"})
                    }
                })
            }
        })        
        })
})

router.use('/editProductStruct', (req, res, next)=>{
    console.log("edit Product structture");
    let db = getDb()
    let {prev, latest} = req.headers;
    console.log(latest);
    console.log(prev)
    let producttype = prev;
    db.collection('productType').updateOne({name: producttype}, {$set: {
        name: latest
    }}).then((response)=>{
        db.collection('category').updateMany({parentName: producttype}, {$set: {
            parentName: latest
        }}).then((response)=>{
            db.collection('cycles').updateMany({categories: producttype}, {$set: {
                categories: latest
            }}).then((response)=>{
                res.send(response)
            })    
        })
    })
})

router.use('/deleteProductStruct', (req, res, next)=>{
    console.log("deleteProduct");
    let db = getDb();
    let {producttype} = req.headers;
    console.log(req.headers)
    db.collection('productType').deleteOne({name: producttype}).then((response)=>{
        db.collection('category').deleteMany({parentName: producttype}).then((response)=>{
            db.collection('cycles').deleteMany({categories: producttype}).then((response)=>{
                res.send(response)
            })    
        })
    })
})



router.use('/filterDesc', (req, res, next)=>{
    console.log("Filter Description");
    let db = getDb();
    let {stocktype, filtervalue} = req.headers;
    console.log(req.headers)
    console.log(stocktype)
    console.log(filtervalue)
    db.collection('category').findOne({name: filtervalue, parentName: stocktype}).then((response)=>{
        console.log("--------------Response---------------");
        console.log(response)
        if(response){
            res.send({array: response.filterArray})
        }else{
            res.send({array: []})
        }
    })

})


exports.productStruct = router
