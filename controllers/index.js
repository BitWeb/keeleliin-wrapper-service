var express = require('express');
var router = express.Router();
var config = require(__base + 'config');

router.use('/api/v1/service', require(__base + 'controllers/api/v1/service'));
router.use('/api/v1/statistics', require(__base + 'controllers/api/v1/statistics'));

/* GET home page. Service description from config */
router.get('/', function( req, res ) {
  res.render('index', {
    title: config.wrapper.title
  });
});

module.exports = router;
