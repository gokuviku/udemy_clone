
const { createRazorpayInstance } = require("../config/razorpay");
const { Address } = require("../Model/Address")
const crypto = require("crypto");
const dotenv = require('dotenv');
dotenv.config();

const createPayorder = async (req, res) => {
    const { amount } = req.body;

    if (!amount) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields"
        });
    }

    const razorpayInstance = createRazorpayInstance();
    const options = {
        amount: amount * 100, // Convert to smallest currency unit
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
    };

    try {
        const response = await razorpayInstance.orders.create(options);
        return res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



const verifyPayment = async (req, res) => {
    const { order_id, payment_id, signature, customerName, paymentMethod, amount, items, customerNumber, adress } = req.body;
    const User = req.user["id"];
    console.log("For Payment Create",User)
    console.log("Data get in req body", req.body)
    const secret = process.env.RAZORPAY_KEY_SECRET;

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(order_id + "|" + payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === signature) {
        // If payment is verified, create order data
        const order = new Address({
            orderId: order_id,
            customerName: customerName,
            customerNumber: customerNumber,
            paymentMethod: paymentMethod,
            paymentStatus: "Verified",
            adress: adress,
            amount: amount,
            User: User,
            items: items.map(item => ({
                itemName: item.title,
                quantity: item.quantity,
                price: item.price
            }))
        });
        console.log("Order is come", order)
        // Save order to the database
        try {
            await order.save();
            return res.status(200).json({
                success: true,
                message: "Payment verified and order created successfully",
                order: order
            });
        } catch (error) {
            console.error("Error saving order:", error);
            return res.status(500).json({
                success: false,
                message: "Payment verified but failed to create order",
                error: error.message
            });
        }
    } else {
        return res.status(400).json({
            success: false,
            message: "Payment rejected",
        });
    }
};

const getAllPayment = async (req, res) => {
    try {
        const data = await Address.find();
        res.json({ data });

    } catch {
        console.error("Error fetching payment:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// create 1 get1Payment

const getPayment = async (req, res) => {
    const id = req.params["id"]

    try {
        const payment = await Address.findOne({ _id: id });
        if (!payment) return res.status(404).json({ message: "Payment not found" });
        res.json({ payment });
    } catch (erroe) {
        console.log("Error fetching payment:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }

}


module.exports = { verifyPayment, createPayorder, getAllPayment, getPayment }