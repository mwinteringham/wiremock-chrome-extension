$(document).ready(function() {

  $(document).on('click', '#mappingControl', function(event){
    buildMappingList();
  });

  $(document).on('click', '.mappingTitle', function(event){
    $(this).parent().find('.mappingDetails').toggle();
  });

  $(document).on('click', '.deleteMapping', function(event){
    var id = $(this).attr('href').split('/')[1];

    $.ajax({
        url: 'http://localhost:8080/__admin/mappings/' + id,
        type: 'DELETE',
        success: function(result) {
            buildMappingList();
        }
    });
  });

});

var buildMappingList = function(){
  $.getJSON('http://localhost:8080/__admin/mappings', function(mappingsData) {
    $('#mappings').empty();

    for(var i = 0; i < mappingsData.mappings.length; i++){
      var mapping = mappingsData.mappings[i];
      $('#mappings').append('<li class="mapping"><div class="mappingTitle">' + mapping.request.method + ' ' + mapping.request.url + ' - ' + mapping.response.status + "</div><a href='#/" + mapping.id + "' class='deleteMapping'>Delete</a>" +
                            '<div class="mappingDetails" style="display: none">' + JSON.stringify(mapping) + '</div></li>');
    }
  })
  .fail(function(error) {
    $('#mappings').text(JSON.stringify(error));
  })
}
