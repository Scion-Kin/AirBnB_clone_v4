$(function () {
  const selected = [];
  const selectedNames = [];
  const selectedStates = [];
  const stateNames = [];
  const selectedCities = [];
  const cityNames = [];
  getPlaces();
  $('.amenities INPUT[type=checkbox]').on('change', function () {
    $('.amenities h4').text('');
    pushPop([selected, selectedNames], $(this).is(':checked'), $(this).attr('data-id'), $(this).attr('data-name'));
    selectedNames.sort();
    $('.amenities h4').html(selectedNames.join(', '));
  });

  $('.locations INPUT[type=checkbox]').on('change', function () {
    $('.locations h4').text('');
    if ($(this).attr('location-type') === 'state') {
        pushPop([selectedStates, stateNames], $(this).is(':checked'), $(this).attr('data-id'), $(this).attr('data-name'));
    }  else if ($(this).attr('location-type') === 'city') {
        pushPop([selectedCities, cityNames], $(this).is(':checked'), $(this).attr('data-id'), $(this).attr('data-name'));
    }
    let displayLocations = [...cityNames, ...stateNames]; // assign the values of the arrays into one.
    displayLocations.sort();
    $('.locations h4').html(displayLocations.join(', '));
  });

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, textStatus) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    }
  });

  $('button').click(function () { getPlaces(); });

  function pushPop(arr, isChecked, dataId, dataName) {
    if (isChecked) {
      if (!arr[0].includes(dataId)) {
          arr[0].push(dataId);
          arr[1].push(dataName);
      }
    } else {
      if (arr[0].includes(dataId)) {
        arr[0].splice(arr[0].indexOf(dataId), 1);
        arr[1].splice(arr[1].indexOf(dataName), 1);
      }
    }
  }

  function getPlaces () {
    let requestData = { amenities: selected,  states: selectedStates, cities: selectedCities};

    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      data: JSON.stringify(requestData),
      contentType: 'application/json',
      success: function (data, textStatus) {
        $('section.places').html('');
        for (let i = 0; i < data.length; i++) {
          const article = document.createElement('article');
          const titleDiv = document.createElement('div');
          const h2 = document.createElement('h2');
          const priceDiv = document.createElement('div');
          $(priceDiv).addClass('price_by_night');
          $(titleDiv).addClass('title_box');

          $(h2).text(data[i].name);
          $(priceDiv).text(data[i].price_by_night);

          $(titleDiv).append([h2, priceDiv]);

          const informationDiv = document.createElement('div');
          const maxGuest = document.createElement('div');
          const numberRooms = document.createElement('div');
          const numberBathrooms = document.createElement('div');
          $(maxGuest).addClass('max_guest');
          $(numberRooms).addClass('number_rooms');
          $(numberBathrooms).addClass('number_bathrooms');
          $(informationDiv).addClass('information');

          $(maxGuest).text(data[i].max_guest + ' Guests');
          $(numberRooms).text(data[i].number_rooms + ' Rooms');
          $(numberBathrooms).text(data[i].number_bathrooms + ' Bathrooms');

          $(informationDiv).append([maxGuest, numberRooms, numberBathrooms]);

          const owner = document.createElement('div');
          $(owner).addClass(owner);
          $.get('http://0.0.0.0:5001/api/v1/users/' + data[i].user_id, function (userdata, textStatus) {
            $(owner).html('<b>Owner: </b>' + userdata.first_name + ' ' + userdata.last_name);
          });

          const description = document.createElement('div');
          $(description).addClass('description');
          $(description).text(data[i].description);

          const reviewSection = document.createElement('section');
          $(reviewSection).addClass('reviews');
          const reviewsHeader = document.createElement('div');
          $(reviewsHeader).addClass('top');
          const allReviews = document.createElement('ul');
          $.get('http://0.0.0.0:5001/api/v1/places/' + data[i].id + '/reviews', function (reviews, textStatus) {
          const headerH2 = document.createElement('h2');
          const span = document.createElement('span');
          $('.top span').click(function () {
            $('.reviews ul').toggeClass('visible gone');
            $('.top span').addClass('dummy');
          });
          $(headerH2).text(reviews.length + ' Reviews');
            for (let i = 0; i < reviews.length; i++) {
              const wholeReview = document.createElement('li');
              const reviewHeader = document.createElement('h3');
              $.get('http://0.0.0.0:5001/api/v1/users/' + reviews[i].user_id, function (userdata, textStatus) {
                $(reviewHeader).html('<b>' + userdata.first_name + ' ' + userdata.last_name + '</b>');
              });
              const review = document.createElement('p');
              $(review).text(reviews[i].text);
              $(wholeReview).append([reviewHeader, review]);
              $(allReviews).append(wholeReview);
            }
            $(reviewsHeader).append([headerH2, span]);
            $(reviewSection).append([reviewsHeader, allReviews]);
          });

          $(article).append([titleDiv, informationDiv, owner, description, reviewSection]);
          $('section.places').html(article);
        }
      }
    });
  }
});
