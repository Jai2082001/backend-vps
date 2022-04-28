const express = require('express');
const router = express.Router();
const getDb = require('../../database/database').getDb;



router.get('/productDisplayWithFilter', (req, res, next)=>{
    let db = getDb();
    const {filtertype, stocktype, filter} = req.headers;
    console.log(filtertype);
    console.log(stocktype);
    console.log(filter);
    if(filtertype !== 'undefined'){
        let stock;
        if(stocktype === 'cycles'){
            stock = 'Cycle'
        }else if(stocktype === 'accessories'){
            stock = 'access'
        }
        else{
            stock = stocktype
        }
        const query = {
            categories: stock
        }
        query[filtertype] = filter
        if(filtertype === 'users'){
            db.collection('cycles').find({categories: stock}).toArray().then((response)=>{
                let sendingArray = [];
                response.map((singleItem)=>{
                    let flag = 0;
                    console.log(singleItem)
                    singleItem.userType.map((singleItem2)=>{
                        if(singleItem2.label === filter){
                            flag++
                            return
                        }
                    })
                    if(flag){
                        sendingArray.push(singleItem)
                    }
                })
                res.send(sendingArray)
            })
        }
        if(filtertype === 'category'){
            db.collection('cycles').find({categories: stock}).toArray().then((response)=>{
                let sendingArray = [];
                response.map((item)=>{
                    if(item.category){
                        if(item.category.label === filter){
                            sendingArray.push(item)
                        }
                    }
                })
                res.send(sendingArray)
            })
        }

        if(filtertype === 'brand'){
            db.collection('cycles').find({categories: stock}).toArray().then((response)=>{
                let sendingArray = [];
                response.map((singleItem)=>{
                    if(singleItem.brand.label === filter){
                        sendingArray.push(singleItem);
                        // Hello
                        // world
                    }
                })
                res.send(sendingArray)
            })
        }

    }else {
        if(stocktype !== 'undefined'){
            let stock;
            if(stocktype === 'cycles'){
                stock = 'Cycle'
            }else{
                stock = 'access'
            }
            db.collection('cycles').find({categories: stock}).toArray().then((response)=>{
                res.send(response)
            })
        }
    }
    
    
})

router.use('/deleteProduct', (req, res, next)=>{
    console.log("Delete Product");

})


router.use('/productNames', (req, res, next)=>{
    let db = getDb();
    const products = [];
    db.collection('cycles').find({}).toArray().then((response)=>{
        response.map((singleItem)=>{
            products.push(singleItem.name);
        })
        res.send(products)
    })
})

router.use('/productDisplay', (req, res, next)=>{
    let db = getDb();
    let {name} = req.headers;
    console.log(name)
    db.collection('cycles').findOne({name: name }).then((response)=>{
        res.send({product: response})
    })
})

// router.use('/productDisplay', async (req, res, next) => {
//     let db = getDb();
//     const category = req.headers.category;

//     if (req.headers.filters) {
//         if (category === 'cycle') {
//         const filter = JSON.parse(req.headers.filters);
//         const filterResolve = (callback) => {
//             let idx = 0;
//             let responseArray = [];
//             filter.forEach(async (single) => {
//                     if (single.filterType === 'price') {
//                         let string = single.filter.replace(/ /g, "");             
//                         let array = string.split('-')            
//                         db.collection('cycles').find({categories: 'Cycle' ,"$expr": { "$and": [{ "$gte": [{ "$toInt": "$price" }, parseInt(array[0])]}, {"$lte": [{"$toInt": "$price"}, parseInt(array[1])]}]}}).toArray().then((response) => {
//                             if (response) {
//                                 response.map((single) => {
//                                     if (!(responseArray.includes(single))) {
//                                         responseArray.push(single)  
//                                     }
                                    
//                                 })

//                                 idx++
                                
//                                 if (idx === filter.length) {

//                                     callback(responseArray) 
//                                 }
//                             } else {
//                                 res.send({ status: 'not in database' })
//                             }
//                     })   
//                     } else {
//                         console.log('heeeerrreee')
//                         const query = {};
//                         console.log(single)
//                         query[single.filterType] = single.filter;
//                         query.categories = 'Cycle'
//                         db.collection('cycles').find(query).toArray().then((response) => {
//                             if (response) {
//                                 response.map((singleItem) => {
//                                     if (!(responseArray.includes(singleItem))) {
//                                         responseArray.push(singleItem)
//                                     }
//                                 })
//                                 idx++
//                                 if (idx === filter.length) {
//                                     callback(responseArray) 
//                                 }
//                             } else {
//                                 res.send({status: 'some error occured'})
//                             }
//                         })
//                     }
                    
//             })

//         }

//         filterResolve(( prreturn ) => {
//            res.send(prreturn)
//         })
//         }
//         else {
//             console.log('--------------------------------')
//             db.collection('cycles').find({categories: 'access'}).toArray().then((response) => {
//             if (response) {
//                 console.log('here')
//                 res.send(response);
                
//             } else {
//                 res.send({status: "Not in database"})
//                 console.log('not in database');
//             }
//         })       
//         }     
//     } 
//     else {
//         console.log('heheheheheh')
//         db.collection('cycles').find().toArray().then((response) => {
//         if (response) {
//             console.log('here')
//             res.send(response);
            
//         } else {
//             res.send({status: "Not in database"})
//             console.log('not in database');
//         }
//     })    
// }   
    
    
// })

router.get('/productDisplayWhole', (req, res, next)=>{
    let db = getDb();
    db.collection('cycles').find().toArray().then((response)=>{
        res.send(response)
    })
})

router.get('/productDisplayWholeSub', (req, res, next)=>{
    let db = getDb();
    db.collection('cycles').find({addedby: req.headers.subid}).toArray().then((response)=>{
        res.send(response)
    })
})

router.get('/productDisplayLatest', (req, res, next) => {
    let db = getDb();
    db.collection('cycles').find({}).sort({ _id: -1 }).limit(5).toArray().then((response) => {
        res.send(response)
    })

})

router.get('/productDisplayLimit', (req, res, next) => {
    let db = getDb();
    let limitHeader = parseInt(req.headers.limit);
    db.collection('cycles').find({}).limit(limitHeader).toArray().then((response) => {
        res.send(response)
    })
})


exports.product = router