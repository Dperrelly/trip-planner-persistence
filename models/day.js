var mongoose = require('mongoose');
var HotelSchema = require('./hotel').schema;
var RestaurantSchema = require('./restaurant').schema;
var ActivitySchema = require('./activity').schema;

var DaySchema = new mongoose.Schema ({
    number: {type: Number, unique: true, required: true},
    hotel: {type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', unique: true},
    restaurants: [{type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', unique: true}],
    activities: [{type: mongoose.Schema.Types.ObjectId, ref: 'Activity', unique: true}]
});
// var day = mongoose.model('Day', DaySchema);
// console.log('Dayday : ', day)

module.exports = mongoose.model('Day', DaySchema);
