const jwt = require('jsonwebtoken');

const payload = {
  subdomain: 'biocon', // you can change this to your subdomain
  user: 'helix-user'
};

const secret = process.env.JWT_SECRET; // match your JWT_SECRET

const token = jwt.sign(payload, secret, { expiresIn: '1h' });

console.log('✅ Your JWT Token:\n', token);
