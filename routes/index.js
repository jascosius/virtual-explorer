var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('explore', { type: 'not specified' });
});

router.get('/:type/:id', function(req, res, next) {
  if(req.params.type == "error") {
    res.render('jserror', {id: req.params.id});
  } else {
    res.render('explore', {type: req.params.type, id: req.params.id});
  }
});

module.exports = router;
