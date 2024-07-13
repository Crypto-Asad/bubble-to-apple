const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// Apple API credentials
const keyId = 'MDMNRC24F3';
const issuerId = 'c1f2a749-8ed8-461d-8809-3a8f2911182c';
const privateKeyPath = 'C:/Users/Asad Yousaf/myAppStoreIntegration/keys/AuthKey_MDMNRC24F3.p8';

// Read private key file
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

function generateJWT() {
  const token = jwt.sign({}, privateKey, {
    algorithm: 'ES256',
    expiresIn: '1h',
    issuer: 'c1f2a749-8ed8-461d-8809-3a8f2911182c',
    header: {
      alg: 'ES256',
      kid: 'MDMNRC24F3',
    }
  });
  return token;
}

async function verifyPurchase(receiptData) {
  const token = generateJWT();
  try {
    const response = await axios.post('https://buy.itunes.apple.com/verifyReceipt', {
      'receipt-data': receiptData,
      'password': '8b696c731a604dab9e72e12edd024e2e' // Replace with your app's shared secret
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error verifying purchase:', error);
    throw error; // Re-throw error for handling in caller
  }
}

app.post('/verify-purchase', async (req, res) => {
  const { receiptData } = req.body;

  try {
    const verificationResult = await verifyPurchase(receiptData);
    console.log('Verification result:', verificationResult);
    res.status(200).json({ success: true, message: 'Purchase verified' });
  } catch (error) {
    console.error('Error in purchase verification:', error);
    res.status(500).json({ success: false, error: 'Error verifying purchase' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
