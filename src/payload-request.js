$(document).ready(function() {
    $('#makeRequest').click(function() {
      var path = $('#requestPath').val();
      var pathType = $('#requestType').val();
      var method = $('#requestMethod').val();

      buildPayload(path, pathType, method, function(payload){
        postToMappingsNew(payload);
      });
    });

    $(document).on('click', 'a', function(event){
      event.preventDefault();

      $(this).parent().remove();

      console.log($('.headerMatcher').length);

      if($('.headerMatcher').length === 1){
        $('#blankRequestHeader .delete').remove();
      }
    });

    $(document).on('click', '#blankRequestHeader > input', function(event){
      var currentNewEntry = $('#blankRequestHeader');

      if($('#requestHeaders li').length === 1){
        currentNewEntry.append('<a href="#" class="delete">Delete</a>')
      }

      currentNewEntry.removeAttr('id');
      var newHeaderOption = '<li class="headerMatcher" id="blankRequestHeader"><input type="text" class="key" /><select class="matcher"><option>equalTo</option><option>matches</option><option>doesNotMatch</option><option>contains</option></select><input type="text" class="value" /><a href="#" class="delete">Delete</a></li>'

      $('#requestHeaders').append(newHeaderOption);
    });


});

var postToMappingsNew = function(payload){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:8080/__admin/mappings/new', true);
  xhr.setRequestHeader("Content-Type","application/json");
  xhr.send(JSON.stringify(payload));
}
