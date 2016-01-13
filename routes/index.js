var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.render('explore', { type: 'not specified' });
});

router.get('/map/:id', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.render('explore', { type: 'map', id: req.params.id });
});

router.get('/sphere/:id', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.render('explore', { type: 'sphere', id: req.params.id });
});

module.exports = router;
