const path = require('path');

const express = require('express');

// const adminController = require('../controllers/admin');
const paymentController = require('../controllers/payment')

const router = express.Router();

// /admin/add-product => GET
router.get('/paymentInterface', paymentController.paymentDone);

module.exports = router;
