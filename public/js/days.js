'use strict';
/* global $ mapModule */

var daysModule = (function(){

  var exports = {},
      days,
      currentDay;

  $.get('/days', function(data){
    days = data;
    currentDay = days[0];
    console.log(days);
  })

  function addDay () {
    days.push({
      hotels: [],
      restaurants: [],
      activities: []
    });
    // $.post('/days/'+days.length, function(req,res,next){
    //
    // })
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
    var currentDayNum = $("#day-title span").text().slice(-1);
    console.log(attraction);
    $.post('/api/days/'+currentDayNum+'/'+attraction.type, attraction)
    .done(function(data){
      if (currentDay[attraction.type].indexOf(attraction) !== -1) return;
      currentDay[attraction.type].push(attraction);
      renderDay(currentDay);
    })
    .fail(function(err){
      console.error(err.message);
    })

  };

  exports.removeAttraction = function (attraction) {
    var index = currentDay[attraction.type].indexOf(attraction);
    if (index === -1) return;
    currentDay[attraction.type].splice(index, 1);
    renderDay(currentDay);
  };

  function renderDay(day) {
    mapModule.eraseMarkers();
    day = day || currentDay;
    Object.keys(day).forEach(function(type){
      var $list = $('#itinerary ul[data-type="' + type + '"]');
      $list.empty();
      day[type].forEach(function(attraction){
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

}());
