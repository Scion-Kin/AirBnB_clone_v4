$(function () {
  let selected;
  $('INPUT[type=checkbox]').on('change', function () {
    $('.amenities h4').text('');
    selected = $('INPUT[type=checkbox]:checked').map(function () {
      return $(this).attr('data-id');
    });
    let selectedNames = $('INPUT[type=checkbox]:checked').map(function () {
      return $(this).attr('data-name');
    });
    for (let i = 0; i < selectedNames.length; i++) {
      if (i === selectedNames.length - 1) {
        $('.amenities h4').append(selectedNames[i]);
      }
      else {
        $('.amenities h4').append(selectedNames[i] + ', ');
      }
    }
  });
  $.get('http://0.0.0.0:5001/api/v1/status/', function(data, textStatus) {
      if (data.status == 'OK') {
        $('div#api_status').addClass('available');
      }
    }
  );
  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    data: JSON.stringify({}),
    contentType: 'application/json',
    success: function (data, textStatus) {
      
      for (let i = 0; i < data.length; i++) {
        let article = document.createElement('article');
        const titleDiv = document.createElement('div');
        const h2 = document.createElement('h2');
        const priceDiv = document.createElement('div');
        $(priceDiv).addClass('price_by_night');
        $(titleDiv).addClass('title_box');

        $(h2).text(data[i].name);
        $(priceDiv).text(data[i].price_by_night);

        $(titleDiv).append([h2, priceDiv]);

        const informationDiv = document.createElement('div');
        const max_guest = document.createElement('div');
        const number_rooms = document.createElement('div');
        const number_bathrooms = document.createElement('div');
        $(max_guest).addClass('max_guest');
        $(number_rooms).addClass('number_rooms');
        $(number_bathrooms).addClass('number_bathrooms');
        $(informationDiv).addClass('information');

        $(max_guest).text(data[i].max_guest + ' Guests');
        $(number_rooms).text(data[i].number_rooms + ' Rooms');
        $(number_bathrooms).text(data[i].number_bathrooms + ' Bathrooms');

        $(informationDiv).append([max_guest, number_rooms, number_bathrooms]);

        const owner = document.createElement('div');
        $(owner).addClass(owner);
        $.get('http://0.0.0.0:5001/api/v1/users/' + data[i].user_id, function(userdata, textStatus) {
          $(owner).html('<b>Owner: </b>' + userdata.first_name + ' ' + userdata.last_name);
        });

        const description = document.createElement('div');
        $(description).addClass('description');
        $(description).text(data[i].description);

        $(article).append([titleDiv, informationDiv, owner, description]);
        $('section.places').append(article);
      }
    }
  });
});
