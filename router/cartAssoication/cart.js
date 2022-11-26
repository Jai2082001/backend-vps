const express = require('express');
const router = express.Router();
const getDb = require('../../database/database').getDb;
const { ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')


router.use('/cartItemDelete', (req, res, next)=>{
    let db = getDb()
    const {userid, productid} = req.body;
    db.collection('users').findOne({_id: new ObjectId(userid)}).then((response)=>{
        // const newCart = response.cart.filter((singleItem)=>{   
        //     productid !== singleItem.product._id
        // })
        let newCart = []
        for(let i=0;i<response.cart.length;i++){
            if(productid !== response.cart[i].product._id){
                newCart.push(response.cart[i])
            }
        }
        db.collection('users').updateOne({_id: new ObjectId(userid)}, {
            $set: {
                cart: newCart
            }
        }).then((response)=>{
            res.send({cart: newCart})
        })
    })  
})

router.use('/cartDisplay', (req, res, next)=>{
    console.log('Cart Display');
    let db = getDb();
    const {userid} = req.headers;
    console.log(userid)
    db.collection('users').findOne({_id: new ObjectId(userid)}).then((response)=>{
        console.log(response)
        res.send({user: response})
    })
})

router.use('/cartItemDecrease', (req, res, next)=>{
    let db = getDb()
    const {userid, productid} = req.body;
    db.collection('users').findOne({_id: new ObjectId(userid)}).then((response)=>{
        const newCart = response.cart.map((singleItem)=>{
            if(productid !== singleItem.product._id){
                return singleItem        
            }else{
                const newObj = singleItem;
                newObj.quantity = newObj.quantity - 1;
                return newObj
            }
        })
        db.collection('users').updateOne({_id: new ObjectId(userid)}, {
            $set: {
                cart: newCart
            }
        }).then((response)=>{
            res.send(newCart)
        })
    })
})

router.use('/cartItemIncrease', (req, res, next)=>{
    let db = getDb()
    const {userid, productid} = req.body;
    db.collection('users').findOne({_id: new ObjectId(userid)}).then((response)=>{
        const newCart = response.cart.map((singleItem)=>{
           
            if(productid !== singleItem.product._id){
                return singleItem        
            }else{
                const newObj = singleItem;
                newObj.quantity = newObj.quantity + 1;
                return newObj
            }
        })
        db.collection('users').updateOne({_id: new ObjectId(userid)}, {
            $set: {
                cart: newCart
            }
        }).then((response)=>{
            res.send(newCart)
        })
    })
})

router.use('/cartAssociation', (req, res, next) => {
    console.log('-------------------------------------------------------')
    const { carts, userid, quantity, status } = req.body;
    let db = getDb()
    if(status){
        console.log('Associated status')
        db.collection('users').findOne({_id: new ObjectId(userid)}).then((response)=>{
            if(response.cart){
                let array = response.cart;
                console.log(carts)
                console.log(array)
                for(let i=0;i<carts.length;i++){
                    flag = 0 
                    for(let j=0;j<response.cart.length;j++){
                        console.log('-------------------')
                        console.log(response.cart[j].product)
                        console.log(carts[i].product)
                        if(response.cart[j].product._id === carts[i].product._id){
                            flag++
                            array[j].quantity = array[j].quantity + carts[i].quantity
                            console.log('flag ++ ')
                        }
                    }
                    if(flag == 0){
                        array.push({product: carts[i].product, quantity: carts[i].quantity})
                    }
                }
                db.collection('users').updateOne({_id: new ObjectId(userid)}, {
                    $set: {
                        cart: array
                    }
                }).then((response)=>{
                    res.send({status: 'done'})
                })
            }else{
                console.log('-carts')
                console.log(carts)
                db.collection('users').updateOne({_id: new ObjectId(userid)}, {$set: {
                    cart: carts
                }}).then((response)=>{
                    res.send({status: 'done'})
                })
            }
        })
    }else{
        console.log("Associated")
        db.collection('users').findOne({ _id: new ObjectId(userid) }).then((response) => {
            let product;
            let flag = 0;
            if (response.cart) {        
                for (let i = 0; i < response.cart.length; i++) {
                    if (flag > 0) {
                        break;
                    }
                    if (response.cart[i].product._id === carts._id) {
                        flag++
                        product = { product: response.cart[i].product, quantity: response.cart[i].quantity + quantity }
                        const updateObj = { $set: {} };
                        updateObj.$set['cart.'+i] = product;
                        db.collection('users').updateOne({ _id: new ObjectId(userid) }, updateObj).then((response) => {
                            res.send({ status: 'done'})
                        })
                    } 
                }    
    
                if (flag === 0) {
                    db.collection('users').updateOne({ _id: new ObjectId(userid) }, {
                        $push: {
                            cart: {product: carts, quantity: quantity}
                        }
                    }).then((response) => {
                        res.send({status: 'done'})
                    })
                }
                    
            }   
            else {
                db.collection('users').updateOne({ _id: new ObjectId(userid) }, {
                    $push: {
                        cart: {product: carts, quantity: quantity}
                    }
                }).then((response) => {
                    res.send({status: 'done'})
                })
            }
        })
    }
    
})


exports.cart = router


