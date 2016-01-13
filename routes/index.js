var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.render('explore', { title: 'Map' });
});

router.get('/map/:id', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.render('explore', { title: 'Map', id: req.params.id });
});

module.exports = router;
