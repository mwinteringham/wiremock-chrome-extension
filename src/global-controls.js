$(document).ready(function() {
  $('#aboutView').hide();
  $('#mappingView').hide();

  $(document).on('click', '#mappingControl', function(event){
    $('#stubView').hide();
    $('#aboutView').hide();
    $('#mappingView').show();
  });

  $(document).on('click', '#aboutControl', function(event){
    $('#stubView').hide();
    $('#mappingView').hide();
    $('#aboutView').show();
  });

  $(document).on('click', '#stubControl', function(event){
    $('#mappingView').hide();
    $('#aboutView').hide();
    $('#stubView').show();
  });

});
