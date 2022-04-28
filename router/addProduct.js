const express = require('express');
const router = express.Router();
const getDb = require('../database/database').getDb;
const { ObjectId } = require('mongodb');

router.use('/addProduct', (req, res, next) => {
    let db = getDb();
    let { categories } = req.body;
    let {addedby} = req.headers; 
    console.log(req.body)
    if (categories === 'Cycle') {
        const { name, brand, emi, overprice, price, tire, frame, category, coupon, userType, gear, brake, images, displayimages, stock, front, rear, suspension, quantity, categories , dateadded, desc, weight, height, lenght, width, gst, hsn} = req.body;
        console.log(name)
        db.collection('cycles').find({ name: name }).toArray().then((response) => {
            if (response.length) {
                res.send({status: 'error'})
            } else {
                db.collection('cycles').insertOne({ dateadded: dateadded, name: name, price: price, userType: userType, category: category, desc: desc, coupon: coupon, overprice: overprice, emi: emi, brand: brand, "no. of gears": gear, weight: weight, "frame material": frame, brakes: brake, images: images, displayimages: displayimages, stock: stock, "front deraileur": front, "rear deraileur": rear, "suspension": suspension, "wheel size": tire, quantity: quantity, categories: categories, addedby: addedby, height: height, lenght: lenght, width: width, gst: gst, hsn: hsn }).then((response) => {
                    res.send({status: undefined})
                })
            }
        })
        }
        else if(categories === 'access') {
        let {name} = req.body  
        db.collection('cycles').find({ name: name }).toArray().then((response) => {
            if (response.length) {
                res.send({status: 'error'})    
            } else {
                const { name, price, coupon, riderType, descPoint1, descPoint2, descPoint3, descPoint4, brand, desc, emi, overprice, images, displayimages, dateAdded, stock, quantity, forProduct, categories, cycleType, weight, height, lenght, width, gst, hsn } = req.body; 
                console.log('*****')
                console.log(hsn)
                db.collection('cycles').insertOne({ name: name, price: price, coupon: coupon, riderType: riderType, cycleType: cycleType, descPoint1: descPoint1, descPoint2: descPoint2, descPoint3: descPoint3, dateAdded: dateAdded, stock: stock, forProduct: forProduct, overprice: overprice, images: images, displayimages: displayimages, quantity: quantity, categories: categories, descPoint3: descPoint3, desc: desc, descPoint4: descPoint4, emi: emi, brand: brand, addedby: addedby, weight: weight, height: height, lenght: lenght, width: width, gst: gst, hsn: hsn }).then((response) => {
                    
                    res.send({status: undefined})
                })
            
            }    
        })
    } else{
        let {name} = req.body;
        const {category} = req.body;
        const filterCategory = category.label;
        db.collection('category').find({name: filterCategory}).toArray().then((filter)=>{
            const filterArray = filter[0].filterArray;
            let index = filterArray.length;
            let initial = 0;
            db.collection('cycles').find({name: name}).toArray().then((response)=>{
                if(response.length){
                    res.send({status: 'error'})
                }else {
                    const {name, price, coupon, descPoint1, descPoint2, descPoint3, descPoint4, brand, desc, emi, overprice, images, displayimages, dateAdded, stock, quantity,  categories, category, width, lenght, height, weight, gst, hsn } = req.body
                    console.log('*****')
                    console.log(hsn)
                    db.collection('cycles').insertOne({name: name, price: price, coupon: coupon, descPoint1: descPoint1, descPoint2:descPoint2, descPoint3:descPoint3, descPoint4: descPoint4, brand: brand , desc: desc, emi: emi, overprice: overprice, images: images, displayimages: displayimages, stock: stock, quantity: quantity, categories: categories, category: category, addedby: addedby, weight: weight, height: height, lenght: lenght, width: width, gst: gst, hsn: hsn }).then((response)=>{
                        console.log(filterArray)
                        filterArray.map((singleItem)=>{
                            const obj = {}
                            obj[singleItem] = req.body[singleItem];
                            console.log(req.body)
                            db.collection('cycles').updateOne({name: name}, {$set: obj}).then((response)=>{
                                console.log(initial)
                                initial++
                                if(initial === index){
                                    console.log("indiandaidn")
                                    res.send({status: true});
                                }
                            })
                        })
                        
                    })
                }
            })
        })
        
    }
})

router.use('/updateProduct', (req, res, next) => {
    let db = getDb();
    const {product} = req.headers
    let {name, price, overprice, desc, categories, stock, coupon, emi, quantity, category, brand, _id} = req.body;
    let {id} = req.body;
    if(product === 'Cycle'){
        let {weight, suspension, rear, front, gear , wheel, userType, frame} = req.body;
        db.collection('cycles').updateOne({_id: new ObjectId(id)}, {$set: {
            name: name,
            price: price,
            overprice: overprice,
            desc: desc,
            categories: categories,
            stock: stock,
            coupon: coupon,
            emi: emi,
            quantity: quantity,
            category: category,
            brand: brand,
            weight: weight,
            "suspension": suspension,
            "wheel size": wheel,
            "rear deraileur": rear,
            "front deraileur": front,
            "frame material": frame,
            "no. of gears": gear,
            userType: userType
        }}).then((response)=>{
            res.send(response)
        })
    } else if(product === 'access'){
        let {descPoint1, descPoint2, descPoint3, descPoint4, riderType, cycleType, forProduct} = req.body    
        db.collection('cycles').updateOne({_id: new ObjectId(id)}, {$set: {
            name: name,
            price: price,
            overprice: overprice,
            desc: desc,
            categories: categories,
            stock: stock,
            coupon: coupon,
            emi: emi,
            quantity: quantity,
            category: category,
            brand: brand,
            descPoint1: descPoint1,
            descPoint2: descPoint2,
            descPoint3: descPoint3,
            descPoint4: descPoint4,
            riderType: riderType,
            cycleType: cycleType,
            forProduct: forProduct
        }}).then((response)=>{
            res.send(response)
        })
    }else{
        let {descPoint1, descPoint2, descPoint3, descPoint4} = req.body;
        db.collection('cycles').updateOne({_id: new ObjectId(id)}, {$set: {
            name: name,
            price: price,
            overprice: overprice,
            desc: desc,
            stock: stock,
            emi: emi,
            quantity: quantity,
            brand: brand,
            descPoint1: descPoint1,
            descPoint2: descPoint2,
            descPoint3: descPoint3,
            descPoint4: descPoint4,
            category: category,
            categories: categories,
            coupon: coupon
        }}).then((response)=>{
            res.send(response)
        })
    }
})    
    exports.addProduct = router;



    //db.collection('cycles').updateOne({_id: new ObjectId(id)}, {$set: {
        //     name: name,
        //     price: price,
        //     type: type,
        //     category: category,
        //     desc: desc,
        //     coupon: coupon,
        //     overprice: overprice,
        //     emi: emi,
        //     brand: brand,
        //     stock: stock,
        //     quantity: quantity
        // }}).then((response)=>{
        //     console.log(response)
        //     res.send(response)
        // })
        // // db.collection('cycles').find({ _id: ObjectId(id) }).toArray().then((response) => {
        // //     if (response.length > 0) {
        // //         db.collection('cycles').updateOne({ _id: id }, {
        // //             $set: {
        // //                 name: name,
        // //                 price: price,
        // //                 type: type,
        // //                 category: category,
        // //                 desc: desc,
        // //                 coupon: coupon,
        // //                 overprice: overprice,
        // //                 emi: emi,
        // //                 brand: brand,
        // //                 stock: stock
        // //             }
        // //         }).then((response) => {
        // //             console.log(response)
        // //             if (response) {
        // //                 res.send(response);
        // //             } else {
        // //                 res.send({status: 'Some Error Has Occured'})
        // //             }
        // //         })
        // //     } else {
        // //         res.send({status: 'Not in the Database'})
        // //     }