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
    let db = getDb();
    const {userid} = req.headers;
    db.collection('users').findOne({_id: new ObjectId(userid)}).then((response)=>{
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
    const { carts, userid, quantity } = req.body;
    let db = getDb()
    console.log(userid);
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
})
// router.use('/cartDelete', (req, res, next) => {
//     db.collection('users')
// })
exports.cart = router




// const add = (a, b) => {
//     return a + b
// }

// const coo = (add) => {
//     console.log('adasd');
//     add();
// }