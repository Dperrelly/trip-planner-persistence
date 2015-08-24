var express = require('express');
var router = express.Router();
var models = require('../../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;
var Promise = require('bluebird');

router.get('/:dayNum',function(req, res, next){
  var dayNum = req.params.dayNum;
  Day.findOne({number: dayNum}, function(err, day){
    if(err) res.send(err.message);
    else if(!day) res.send('No day found')
    else {
      res.send(day)
      console.log('Finding One')
    }
  })
})


router.post('/:dayNum',function(req, res, next){
  Day.create({number: req.params.dayNum})
  .then(function(day){
    res.send(day)
  })
  .then(null, function(err){
    res.send(err.message);
  })
})

router.put('/:dayNum/itemType',function(req, res, next){

})

router.delete('/:dayNum',function(req, res, next){
  Day.remove({number: req.params.dayNum}, function(err){
    res.send(err.message);
  })
})

module.exports = router;
