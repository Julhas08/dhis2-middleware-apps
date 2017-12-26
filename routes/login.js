/**
* Login form load
* @method {GET} - 
*/
let express = require('express');
let router = express.Router();
router.get('/', function(req, res, next) {
  res.render('login');
});

module.exports = router;
