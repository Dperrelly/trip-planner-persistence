var express = require('express');
var router = express.Router();
var models = require('../../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;
var Promise = require('bluebird');

router.get('/days/:dayNum',function(req, res, next){
  var dayNum = req.params.dayNum;
  Day.findOne({number: dayNum}, function(err, day){
    if(err) res.send(err.message);
    else if(!day) res.send('No day found');
    else {
      res.send(day);
    }
  });
});

router.get('/days', function(req, res, next){
  Day.find({})
  .populate('hotel restaurants activities')
  .exec(function(err, days){
    if(err) res.send(err.message);
    else {
      res.send(days);
    }
  });
});

router.get('/attractions/',function(req, res, next){
  var attractions = {};

  var hotelPromise = Hotel.find({}, function(err, hotels){
    if(err) res.send(err.message);
    else {
      attractions.hotels = (hotels);
    }
  });

  var restaurantPromise = Restaurant.find({}, function(err, restaurants){
    if(err) res.send(err.message);
    else {
      attractions.restaurants = restaurants;
    }
  });

  var activityPromise = Activity.find({}, function(err, activities){
    if(err) res.send(err.message);
    else {
      attractions.activities = activities;
    }
  });

  Promise.all([hotelPromise, restaurantPromise, activityPromise]).then(function(){
    res.send(attractions);
  }).then(null, function(err){
    res.send(err.message);
  });
});


router.post('/days/:dayNum',function(req, res, next){
  Day.create({number: req.params.dayNum})
  .then(function(day){
    res.send(day);
  })
  .then(null, function(err){
    res.send(err.message);
  });
});

router.post('/days/:dayNum/:itemType',function(req, res, next){
  var itemType = req.params.itemType;
  Day.findOne({number: req.params.dayNum}, function(err, day){
    if(err) res.send(err.message);
    else {
      if(itemType === 'hotels'){
        day.hotel = req.body._id;
      }
      else if(itemType === 'restaurants' || itemType === 'activities'){
        if(day[itemType].indexOf(req.body._id) === -1) day[itemType].push(req.body._id);
      }
      day.save(function(err, day){
        if(err) res.send(err.message);
        res.send(day);
      });
    }
  });
});

router.put('/days/:dayNum', function(req, res){
  Day.findOne({number: req.params.dayNum}, function(err, day){
    if(err) res.send(err.message);
    else {
      for(var i in req.body){
        day[i] = req.body[i];
      }
      day.save(function(err, day){
        if(err) res.send(err.message);
        res.send(day);
      });
    }
  })
})

router.delete('/days/:dayNum',function(req, res, next){
  Day.remove({number: req.params.dayNum}, function(err){
    if(err) res.send(err.message);
    else res.send("Removed day: ", req.params.dayNum);
  });
});

module.exports = router;
