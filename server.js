const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// Apple API credentials
const keyId = 'MDMNRC24F3';
const issuerId = 'c1f2a749-8ed8-461d-8809-3a8f2911182c'; // Replace with your issuer ID
const privateKey = fs.readFileSync('C:/Users/Asad Yousaf/myAppStoreIntegration/keys/AuthKey_MDMNRC24F3.p8'); // Updated path to your .p8 file

function generateJWT() {
  const token = jwt.sign({}, privateKey, {
    algorithm: 'ES256',
    expiresIn: '1h',
    issuer: 'c1f2a749-8ed8-461d-8809-3a8f2911182c',
    header: {
      alg: 'ES256',
      kid: MDMNRC24F3
    }
  });
  return token;
}

async function verifyPurchase(receiptData) {
  const token = generateJWT();
  const response = await axios.post('https://buy.itunes.apple.com/verifyReceipt', {
    'receipt-data': receiptData,
    'password': '8b696c731a604dab9e72e12edd024e2e' // Replace with your app's shared secret
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}

app.post('/verify-purchase', (req, res) => {
  const { packageName, productId, token } = req.body;

  // Your verification logic here
  // Example response
  res.json({ success: true, message: 'Purchase verified' });
}

      res.status(200).send('Purchase verified and recorded');
    } else {
      res.status(400).send('Purchase not verified');
    }
  } catch (error) {
    console.error('Error verifying purchase:', error);
    res.status(500).send('Error verifying purchase');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
