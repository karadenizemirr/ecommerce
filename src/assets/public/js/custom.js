$(document).ready(function(e){
  $('#checkout').click(function(e){
    e.preventDefault();

    $.ajax({
      url: $(this).attr('href'),
      method: 'GET',
    })
  })
})