$(function () {
  const selectedNames = [];
  $('INPUT[type=checkbox]').on('change', function () {
    $('.amenities h4').text('');
    if ($(this).is(':checked')) {
      if (!selectedNames.includes($(this).attr('data-name'))) {
        selectedNames.push($(this).attr('data-name'));
      }
    } else {
      if (selectedNames.includes($(this).attr('data-name'))) {
        selectedNames.splice(selectedNames.indexOf($(this).attr('data-name')), 1);
      }
    }
    selectedNames.sort();
    $('.amenities h4').html(selectedNames.join(', '));
  });

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, textStatus) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    }
  });
});
