'use strict';
/* global $ mapModule */

var daysModule = function(){



  function addDay () {
    days.push({
      hotels: [],
      restaurants: [],
      activities: []
    });
    $.post('/api/days/' + String(days.length -1), function(req,res,next){
      console.log('successsss');
    }).fail(function(err){
      console.log(':(');
    });
    renderDayButtons();
    switchDay(days.length - 1);
  }

  function switchDay (index) {
    var $title = $('#day-title');
    if (index >= days.length) index = days.length - 1;
    $title.children('span').remove();
    $title.prepend('<span>Day ' + (index + 1) + '</span>');
    currentDay = days[index];
    renderDay();
    renderDayButtons();
  }

  function removeCurrentDay () {
    if (days.length === 1) return;
    var currentDayNum = $("#day-title span").text().slice(-1) -1;
    $.ajax( {
      url: '/api/days/' + currentDayNum,
      method: 'DELETE',
      success: function(data){
        console.log('gj');
      },
      error: function(err){
        console.log(err.message, ':(');
      }
    });
    var index = days.indexOf(currentDay);
    days.splice(index, 1);
    switchDay(index);
  }

  function renderDayButtons () {
    var $daySelect = $('#day-select');
    $daySelect.empty();
    days.forEach(function(day, i){
      $daySelect.append(daySelectHTML(day, i, day === currentDay));
    });
    $daySelect.append('<button class="btn btn-circle day-btn new-day-btn">+</button>');
  }

  function daySelectHTML (day, i, isCurrentDay) {
    return '<button class="btn btn-circle day-btn' + (isCurrentDay ? ' current-day' : '') + '">' + (i + 1) + '</button>';
  }

  exports.addAttraction = function(attraction) {

    //console.log(currentDay);
    var currentDayNum = $("#day-title span").text().slice(-1) -1;
    $.post('/api/days/'+currentDayNum+'/'+attraction.type, attraction)
    .done(function(data){
      var attractionType = attraction.type;
      if(attraction.type === 'hotels') var attractionType = 'hotel';
      console.log(attraction);
      if (currentDay[attractionType].indexOf(attraction) !== -1) return;
      currentDay[attractionType].push(attraction);
      renderDay(currentDay);
    })
    .fail(function(err){
      console.error(err.message);
    });

  };

  exports.removeAttraction = function (attraction) {
    var index = currentDay[attraction.type].indexOf(attraction);
    if (index === -1) return;
    currentDay[attraction.type].splice(index, 1);
    renderDay(currentDay);
  };

  function simplify(day){
    var simpleDay = {
      restaurants: day.restaurants,
      activities: day.activities,
      hotel: []
    };
    if(day.hotel) simpleDay.hotel.push(day.hotel);
    return simpleDay;
  }

  function renderDay(day) {
    mapModule.eraseMarkers();
    day = day || currentDay;
    var simpleDay = simplify(day);
    Object.keys(simpleDay).forEach(function(type){
      var $list = $('#itinerary ul[data-type="' + type + '"]');
      $list.empty();
      simpleDay[type].forEach(function(attraction){
        $list.append(itineraryHTML(attraction));
        mapModule.drawAttraction(attraction);
      });
    });
  }

  function itineraryHTML (attraction) {
    return '<div class="itinerary-item><span class="title>' + attraction.name + '</span><button data-id="' + attraction._id + '" data-type="' + attraction.type + '" class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
  }

  $(document).ready(function(){
    switchDay(0);
    $('.day-buttons').on('click', '.new-day-btn', addDay);
    $('.day-buttons').on('click', 'button:not(.new-day-btn)', function() {
      switchDay($(this).index());
    });
    $('#day-title').on('click', '.remove', removeCurrentDay);
  });

  return exports;

};

  var exports = {},
      days,
      currentDay;

  $.get('/api/days', function(data){
    if(!data.length) {
       $.post('/api/days/0', function(day0){
          days = data;
          data.push(day0);
          days.forEach(function(day){
            if(!day.hotel) day.hotel = [];
          });
          daysModule = daysModule();
          currentDay = days[0];
      }).fail(function(err){
          console.log(err.message);
      });
    }
    else {
      days = data;
      days.forEach(function(day){
        if(!day.hotel) day.hotel = [];
      });
      daysModule = daysModule();
      currentDay = days[0];
    }

  });
