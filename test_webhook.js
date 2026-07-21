const crypto = require('crypto');
const axios = require('axios');
const fs = require('fs');

// Read the secret directly from the .env file
const envContent = fs.readFileSync('.env', 'utf8');
const secretMatch = envContent.match(/RAZORPAY_WEBHOOK_SECRET=(.*)/);
const secret = secretMatch ? secretMatch[1].trim() : '';

if (!secret) {
    console.error("Could not find RAZORPAY_WEBHOOK_SECRET in .env file");
    process.exit(1);
}

// Simulated Razorpay Payload
const payload = {
  "entity": "event",
  "account_id": "acc_BFQ7uQEGoOAwA",
  "event": "payment.captured",
  "contains": [
    "payment"
  ],
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_test_payment_123",
        "entity": "payment",
        "amount": 5000,
        "currency": "USD",
        "status": "captured",
        "order_id": "order_test_order_123", // Replace this with a real Order ID from your database if you want to test full email generation
        "method": "card"
      }
    }
  }
};

const bodyStr = JSON.stringify(payload);
const signature = crypto.createHmac('sha256', secret).update(bodyStr).digest('hex');

console.log("Testing Razorpay Webhook with signature:", signature);

axios.post('http://localhost:5001/api/payment/webhook', bodyStr, {
    headers: {
        'x-razorpay-signature': signature,
        'Content-Type': 'application/json'
    }
}).then(res => {
    console.log("✅ Webhook accepted by server!");
    console.log("Server Response:", res.status, res.data);
}).catch(err => {
    console.error("❌ Webhook rejected by server!");
    console.error("Error details:", err.response ? err.response.data : err.message);
});
