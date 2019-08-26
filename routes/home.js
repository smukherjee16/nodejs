const express = require('express');
const router = express.Router();

//endpoint http://localhost:3000
//HTTP Method: GET
router.get('/', (req, res) => {
    res.send('Hello World!!!');
});

module.exports = router;