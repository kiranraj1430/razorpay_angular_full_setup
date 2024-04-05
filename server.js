const express = require("express"); //install express from npm
const Razorpay = require('razorpay'); // install razorpay node npm package 
const bodyParser = require('body-parser'); // install body parser from npm
const cors = require("cors"); // install cors from npm

const app = express(); // Initialize app first
app.use(express.json()); // Use middleware after initialization
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const razorpay = new Razorpay({
    key_id: 'rzp_test_57zVLAgyfytfytf7PSyWfpL',
    key_secret: '0bJ6AoZjjIP8985r6fi0sIr87tyfo2x56o'
});

// Create a payment order 
app.post('/createorders', (req, res) => {
    const { amount, currency, receipt } = req.body;

    const options = {
        amount,
        currency,
        receipt,
        payment_capture: 1,
    };

    MyOrder = razorpay.orders.create(options, (err, order) => {
        console.log(order);
        if (err) {
            console.error('Error creating order:', err);
            return res.status(500).json({ error: 'Failed to create payment order' });
        }
        res.json(order);
    });
});

// Fetch payment details 
app.post('/fetch-payment', (req, res) => {
    const { payment_id } = req.body;

    razorpay.payments.fetch(payment_id, (err, payment) => {
        if (err) {
            console.error('Error fetching payment details:', err);
            return res.status(500).json({ error: 'Failed to fetch payment details' });
        }
        res.json(payment);
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
