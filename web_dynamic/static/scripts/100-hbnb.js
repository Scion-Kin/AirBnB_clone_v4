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

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, textStatus) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    }
  });

  $('button').click(function () { getPlaces(); });

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

          $(article).append([titleDiv, informationDiv, owner, description]);
          $('section.places').html(article);
        }
      }
    });
  }
});
