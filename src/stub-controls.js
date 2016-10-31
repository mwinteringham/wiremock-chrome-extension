$(document).ready(function() {
    $('#makeRequest').click(function() {
      var path = $('#requestPath').val();
      var pathType = $('#requestType').val();
      var method = $('#requestMethod').val();
      var requestHeaders = generateRequestHeadersArray();
      var queryString = generateQueryStringArray();
      var payload = $('#requestPayload').val();
      var statusCode = $('#statusCode').val();
      var priority = $('#priority').val();
      var responseHeaders = generateResponseHeadersArray();
      var responsePayload = $('#responsePayload').val();

      buildPayload(path,
                   pathType,
                   method,
                   priority,
                   queryString,
                   requestHeaders,
                   payload,
                   statusCode,
                   responseHeaders,
                   responsePayload,
                   function(payload){
                     postToMappingsNew(payload);
                   });
    });

    $(document).on('click', '#requestHeaders a', function(event){
      event.preventDefault();

      $(this).parent().remove();

      if($('.requestHeader').length === 1){
        $('#blankRequestHeader .delete').remove();
      }
    });

    $(document).on('focus', '#blankRequestHeader > input', function(event){
      var currentNewEntry = $('#blankRequestHeader');

      if($('#requestHeaders li').length === 1){
        currentNewEntry.append('<a href="#" class="delete">Delete</a>')
      }

      currentNewEntry.removeAttr('id');
      var newHeaderOption = '<li class="requestHeader" id="blankRequestHeader"><input type="text" class="key" /><select class="matcher"><option>equalTo</option><option>matches</option><option>doesNotMatch</option><option>contains</option></select><input type="text" class="value" /><a href="#" class="delete">Delete</a></li>'

      $('#requestHeaders').append(newHeaderOption);
    });

    $(document).on('click', '#requestQueryString a', function(event){
      event.preventDefault();

      $(this).parent().remove();

      if($('.queryStringMatcher').length === 1){
        $('#blankQueryString .delete').remove();
      }
    });

    $(document).on('focus', '#blankQueryString > input', function(event){
      var currentNewEntry = $('#blankQueryString');

      if($('#requestQueryString li').length === 1){
        currentNewEntry.append('<a href="#" class="delete">Delete</a>')
      }

      currentNewEntry.removeAttr('id');
      var newHeaderOption = '<li class="queryStringMatcher" id="blankQueryString"><input type="text" class="key" /><select class="matcher"><option>equalTo</option><option>matches</option><option>doesNotMatch</option><option>contains</option></select><input type="text" class="value" /><a href="#" class="delete">Delete</a></li>'

      $('#requestQueryString').append(newHeaderOption);
    });

    $(document).on('click', '#responseHeaders a', function(event){
      event.preventDefault();

      $(this).parent().remove();

      if($('.responseHeader').length === 1){
        $('#blankResponseHeader .delete').remove();
      }
    });

    $(document).on('focus', '#blankResponseHeader > input', function(event){
      var currentNewEntry = $('#blankResponseHeader');

      if($('#responseHeaders li').length === 1){
        currentNewEntry.append('<a href="#" class="delete">Delete</a>')
      }

      currentNewEntry.removeAttr('id');
      var newHeaderOption = '<li class="responseHeader" id="blankResponseHeader"><input type="text" class="key" /><input type="text" class="value" /><a href="#" class="delete">Delete</a></li>'

      $('#responseHeaders').append(newHeaderOption);
    });

});

var postToMappingsNew = function(payload){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:8080/__admin/mappings/new', true);
  xhr.setRequestHeader("Content-Type","application/json");
  xhr.send(JSON.stringify(payload));
};

var generateRequestHeadersArray = function(){
  var headers = $('#requestHeaders li');
  var arrayToReturn = [];
  var arrayCount = 0;

  for(var i = 0; i < headers.length; i++){
    if(headers.eq(i).find('.key').val().length !== 0){
      arrayToReturn[arrayCount] = {
        'key': headers.eq(i).find('.key').val(),
        'matcher': headers.eq(i).find('.matcher').val(),
        'value': headers.eq(i).find('.value').val()
      }

      arrayCount++;
    }
  }

  return arrayToReturn;
};

var generateQueryStringArray = function(){
  var headers = $('#requestQueryString li');
  var arrayToReturn = [];
  var arrayCount = 0;

  for(var i = 0; i < headers.length; i++){
    if(headers.eq(i).find('.key').val().length !== 0){
      arrayToReturn[arrayCount] = {
        'key': headers.eq(i).find('.key').val(),
        'matcher': headers.eq(i).find('.matcher').val(),
        'value': headers.eq(i).find('.value').val()
      }

      arrayCount++;
    }
  }

  return arrayToReturn;
};

var generateResponseHeadersArray = function(){
  var headers = $('#responseHeaders li');
  var arrayToReturn = [];
  var arrayCount = 0;

  for(var i = 0; i < headers.length; i++){
    if(headers.eq(i).find('.key').val().length !== 0){
      arrayToReturn[arrayCount] = {
        'key': headers.eq(i).find('.key').val(),
        'value': headers.eq(i).find('.value').val()
      }

      arrayCount++;
    }
  }

  return arrayToReturn;
};
