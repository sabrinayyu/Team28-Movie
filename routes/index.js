var express = require('express');
var router = express.Router();

var manager_controller =require('../Controller/manager_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Hello' });
});

// GET request for rendering a initial view
router.get('/theaterDetail', manager_controller.theater_detail_get);





module.exports = router;