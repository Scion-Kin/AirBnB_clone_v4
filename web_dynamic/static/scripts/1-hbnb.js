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
});
