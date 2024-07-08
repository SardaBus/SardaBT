const express = require('express');
const router = express.Router();

const grant_type = 'client_credentials';
const client_id = '96dHZVzsAuv-SZd-ImmjvMIDbZbOH3BfMY-a3G0OvjzfX-drtxGKWLyluFV3IMAH0_e51_I1oOnNl1OXuzXBhQ=='
const client_secret = 'lrFxI-iSEg892AiBZWXI6Xr7LeL9uFh567Cwv-8nQPklYRnXus2FXQinEWvH3lq3JTmeYyhahOnYdO0QCANtwBYQTdKlmd4p'

router.get('/get-token', async (req, res) => {
  try {
    const response = await fetch('https://outpost.mappls.com/api/security/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=${grant_type}&client_id=${client_id}&client_secret=${client_secret}`
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json({ token: data.access_token });
  } catch (error) {
    console.error('Error fetching token:', error);
    res.status(500).json({ error: 'Failed to fetch token' });
  }
});

module.exports = router;
