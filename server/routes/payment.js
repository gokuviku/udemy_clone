const express = require('express');
const { verifyPayment, createPayorder, getAllPayment ,getPayment} = require('../Controlers/payment');
const { authenticateToken } = require("../Middlewear/authToken")

const PaymentRouter = express.Router();


PaymentRouter.post('/createPayment', createPayorder);
PaymentRouter.post('/verifyPayment',authenticateToken, verifyPayment);
PaymentRouter.get('/getPayment', getAllPayment);
PaymentRouter.get("/get1payment/:id", getPayment);



module.exports = { PaymentRouter };

