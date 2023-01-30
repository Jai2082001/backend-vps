const express = require('express');
const router = express.Router();
const getDb = require('../../database/database').getDb;
const { ObjectId } = require('mongodb');
const https = require('https');


var http = require('http'),
    fs = require('fs'),
    ccav = require('./ccavutil.js'),
    crypto = require('crypto'),
    qs = require('querystring');

// exports.postReq = function(request,response){
// var body = '',
// workingKey = 'B97EAF4DC59065991363F9FBD2FF2F0B',	//Put in the 32-Bit key shared by CCAvenues.
// accessCode = 'AVPE12KA23BQ20EPQB',			//Put in the Access Code shared by CCAvenues.
// encRequest = 'wdadad',
// formbody = '';

// //Generate Md5 hash for the key and then convert in base64 string
// var md5 = crypto.createHash('md5').update(workingKey).digest();
// var keyBase64 = Buffer.from(md5).toString('base64');

// //Initializing Vector and then convert in base64 string
// var ivBase64 = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d,0x0e, 0x0f]).toString('base64');

// request.on('data', function (data) {
// body += data;
// encRequest = ccav.encrypt(body, keyBase64, ivBase64); 
// formbody = '<form id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><script language="javascript">document.redirect.submit();</script></form>';
// });

// request.on('end', function () {
//     response.writeHeader(200, {"Content-Type": "text/html"});
// response.write(formbody);
// response.end();
// });
//    return; 
// };

router.use('/orderIssue', (req, res, next) => {
    let db = getDb();
    const { user, address, amount } = req.body;
    const newDate = new Date().toLocaleDateString();
    console.log(newDate)
    db.collection('orders').insertOne({ userid: user._id, name: user.name, email: user.email, number: user.number, cart: user.cart, address: address, status: '', amount: amount, date: newDate }).then((response2) => {
        db.collection('users').updateOne({ _id: new ObjectId(user._id) }, {
            $set: {
                cart: []
            }
        }).then((response) => {
            res.send(response2)
        })
    })
})

router.use('/orderIssueNet', (req, res, next) => {
    let db = getDb();
    const { user, address, amount } = req.body;
    const newDate = new Date().toLocaleDateString();
    db.collection('orders').insertOne({ userid: user._id, name: user.name, email: user.email, number: user.number, cart: user.cart, address: address, status: '', amount: amount, date: newDate }).then((response2) => {
        db.collection('users').updateOne({ _id: new ObjectId(user._id) }, {
            $set: {
                cart: []
            }
        }).then((response) => {
            res.send(response2)
        })
    })
})

router.use('/invoice', (req, res, next) => {
    let db = getDb();
    const { orderid } = req.headers;
    console.log(orderid)
    db.collection('orders').findOne({ _id: new ObjectId(orderid) }).then((response) => {
        console.log(response)
        res.send(response)
    })
})

router.use('/orderUser', (req, res, next) => {
    let db = getDb();
    let { id } = req.headers;
    db.collection('orders').find({ userid: id }).toArray().then((response) => {
        res.send(response)
    })
})

router.use('/orderReceived', (req, res, next) => {
    console.log('order received')
    let db = getDb();
    db.collection('orders').find({ status: '' }).sort({ _id: -1 }).toArray().then((response) => {
        res.send(response)
    })
})

router.use('/orderReject', (req, res, next) => {
    let { _id } = req.body;
    let db = getDb();
    db.collection('orders').updateOne({ _id: new ObjectId(_id) }, {
        $set: {
            status: 'reject'
        }
    }).then((response) => {
        res.send({ status: 'ok' })
    })
})



router.use('/orderAccept', async (req, res, next) => {
    let anotherCart = req.body;
    console.log(anotherCart)
    let { _id } = req.body;
    let { length, width, weight, height } = req.headers
    console.log(req.headers)
    let db = getDb();
    db.collection('orders').find({ _id: new ObjectId(_id) }).toArray().then((response) => {
        let responsePar = response[0];
        db.collection('address').find({ _id: new ObjectId(anotherCart.address) }).toArray().then((response) => {
            console.log(response)

            let postData = JSON.stringify({
                "order_id": responsePar._id,
                "order_date": "01/27/2022",
                "pickup_location": "Primary",
                "channel_id": "",
                "comment": "",
                "reseller_name": "cycling hub",
                "company_name": "",
                "billing_customer_name": response[0].fullname,
                "billing_last_name": "-",
                "billing_address": response[0].address,
                "billing_address_2": "-",
                "billing_isd_code": "",
                "billing_city": response[0].city,
                "billing_pincode": response[0].pincode,
                "billing_state": response[0].state,
                "billing_country": "india",
                "billing_email": "",
                "billing_phone": response[0].number,
                "billing_alternate_phone": "",
                "shipping_is_billing": true,
                "shipping_customer_name": response[0].fullname,
                "shipping_last_name": "",
                "shipping_address": response[0].address,
                "shipping_address_2": "",
                "shipping_city": response[0].city,
                "shipping_pincode": response[0].pincode,
                "shipping_country": response[0].city,
                "shipping_state": response[0].state,
                "shipping_email": "",
                "shipping_phone": "",
                "order_items": [
                    {
                        "name": "cycke",
                        "sku": "1",
                        "units": "1",
                        "selling_price": "1000",
                        "discount": "200",
                        "tax": "0.2",
                        "hsn": "1"
                    }
                ],
                "payment_method": "cod",
                "shipping_charges": "",
                "giftwrap_charges": "",
                "transaction_charges": "",
                "total_discount": "",
                "sub_total": responsePar.amount,
                "length": length,
                "breadth": width,
                "height": height,
                "weight": weight,
                "ewaybill_no": "",
                "customer_gstin": "",
                "invoice_number": "",
                "order_type": ""
            })
            let orderArray = [];
            responsePar.cart.map((singleItem) => {
                orderArray.push({
                    name: singleItem.product.name,
                    sku: "1",
                    units: singleItem.quantity,
                    selling_price: singleItem.product.price,
                    discount: "",
                    hsn: singleItem.product.hsn,
                    tax: singleItem.product.gst
                })
            })
            postData['order_items'] = orderArray
            let options = {
                'method': 'POST',
                'hostname': 'apiv2.shiprocket.in',
                'path': '/v1/external/orders/create/adhoc',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjI0OTk3NTgsImlzcyI6Imh0dHBzOi8vYXBpdjIuc2hpcHJvY2tldC5pbi92MS9leHRlcm5hbC9hdXRoL2xvZ2luIiwiaWF0IjoxNjQ4MjcyNzE5LCJleHAiOjE2NDkxMzY3MTksIm5iZiI6MTY0ODI3MjcxOSwianRpIjoidWlFSkg0aldpWGR4a3prNCJ9.jfo7J57Lg3inM0k-2Ior-RgTnkrIZWQL8Wy921MsHpA'
                },
                'maxRedirects': 20
            };

            let request = https.request(options, function (res) {
                let chunks = [];

                res.on('data', function (chunk) {
                    chunks.push(chunk)
                })

                res.on('end', function (chunnk) {
                    var body = Buffer.concat(chunks);
                    console.log(body.toString());
                })

                res.on("error", function (error) {
                    console.error(error);
                });
            })


            request.write(postData)
            request.end();

            let { cart, _id } = req.body;
            let flag = 0;

            for (let i = 0; i < cart.length; i++) {
                (function (i) {
                    db.collection('cycles').findOne({ _id: new ObjectId(cart[i].product._id) }).then((response) => {
                        let quant = parseInt(response.quantity);
                        if (quant > cart[i].quantity) {
                            let quan;
                            db.collection('cycles').findOne({ _id: new ObjectId(cart[i].product._id) }).then((response) => {
                                quan = parseInt(response.quantity);
                                quan = quan - cart[i].quantity;
                                db.collection('cycles').updateOne({ _id: new ObjectId(response._id) }, {
                                    $set: {
                                        quantity: quan.toString()
                                    }
                                }).then((response) => {
                                })
                            })
                        } else if (quant === cart[i].quantity) {
                            db.collection('cycles').findOne({ _id: new ObjectId(cart[i].product._id) }).then((response) => {
                                let quan = parseInt(response.quantity);
                                quan = quan - cart[i].quantity;
                                db.collection('cycles').updateOne({ _id: new ObjectId(response._id) }, {
                                    $set: {
                                        quantity: quan.toString(),
                                        stock: false
                                    }
                                }).then((response) => {
                                })
                            })

                        } else {
                            flag++
                        }
                    })
                })(i)
            }

            if (flag) {
                res.send({ message: 'Some Stock is not available', status: 'error' })
            } else {
                db.collection('orders').updateOne({ _id: new ObjectId(_id) }, {
                    $set: {
                        status: 'Accepted'
                    }
                }).then((response) => {
                    res.send({ message: 'Order Accepted', status: 'ok' })
                })
            }

        })
    })


})

exports.order = router