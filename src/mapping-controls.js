$(document).ready(function() {

  $(document).on('click', '#mappingControl', function(event){
    $.getJSON('http://localhost:8080/__admin/mappings', function(mappingsData) {
      $('#mappings').empty();

      for(var i = 0; i < mappingsData.mappings.length; i++){
        var mapping = mappingsData.mappings[i];
        $('#mappings').append('<li class="mapping"><div class="mappingTitle">' + mapping.request.method + ' ' + mapping.request.url + ' - ' + mapping.response.status + "</div>" +
                              '<div class="mappingDetails" style="display: none">' + JSON.stringify(mapping) + '</div></li>');
      }
    })
    .fail(function(error) {
      $('#mappings').text(JSON.stringify(error));
    })
  });

  $(document).on('click', '.mapping', function(event){
    $(this).find('.mappingDetails').toggle();
  });

});
