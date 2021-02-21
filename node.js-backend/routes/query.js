var express = require('express');
var router = express.Router();
router.get('/', function(req, res) {
    console.log(req);
    res.send("Everything is Ok!");
});
module.exports = router;
