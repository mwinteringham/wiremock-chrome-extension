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
      var id = $('#editId').val();

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
                     if(id.length > 0){
                       postMappingsToEdit(id, payload)
                     } else {
                       postToMappingsNew(payload);
                     }
                   });
    });

    $(document).on('click', '.requestHeader a', function(event){
      event.preventDefault();

      $(this).parent().parent().remove();
    });

    $(document).on('focus', '#blankRequestHeader input', function(event){
      var currentNewEntry = $('#blankRequestHeader');

      currentNewEntry.append('<div class="col-xs-1"><a href="#" class="delete glyphicon glyphicon-remove"></a></div>')

      var newHeaderOption = '<div class="row center requestHeader" id="blankRequestHeader">' +
                            '   <div class="col-xs-4">' +
                            '    <input type="text" class="key" placeholder="Header key"/>' +
                            '  </div>' +
                            '  <div class="col-xs-3">' +
                            '    <select class="matcher">' +
                            '      <option value="equalTo">equalTo</option>' +
                            '      <option value="matches">matches</option>' +
                            '      <option value="doesNotMatch">doesNotMatch</option>' +
                            '      <option value="contains">contains</option>' +
                            '    </select>' +
                            '  </div>' +
                            '  <div class="col-xs-4">' +
                            '    <input type="text" class="value" placeholder="Header value" />' +
                            '  </div>' +
                            '</div>';

      currentNewEntry.after(newHeaderOption)
      currentNewEntry.removeAttr('id');
    });

    $(document).on('click', '.queryStringMatcher a', function(event){
      event.preventDefault();

      $(this).parent().parent().remove();
    });

    $(document).on('focus', '#blankQueryString input', function(event){
      var currentNewEntry = $('#blankQueryString');

      currentNewEntry.append('<div class="col-xs-1"><a href="#" class="delete glyphicon glyphicon-remove"></a></div>')

      var newQueryOptions = '<div class="row center queryStringMatcher" id="blankQueryString">' +
                            '  <div class="col-xs-4">' +
                            '        <input type="text" class="key" placeholder="Query key"/>' +
                            '      </div>' +
                            '      <div class="col-xs-3">' +
                            '        <select class="matcher">' +
                            '          <option value="equalTo">equalTo</option>' +
                            '          <option value="matches">matches</option>' +
                            '          <option value="doesNotMatch">doesNotMatch</option>' +
                            '          <option value="contains">contains</option>' +
                            '        </select>' +
                            '      </div>' +
                            '      <div class="col-xs-4">' +
                            '        <input type="text" class="value" placeholder="Query value" />' +
                            '      </div>' +
                            ' </div>' +
                            '</div>';

      currentNewEntry.after(newQueryOptions);
      currentNewEntry.removeAttr('id');
    });

    $(document).on('click', '.responseHeader a', function(event){
      event.preventDefault();

      $(this).parent().parent().remove();
    });

    $(document).on('focus', '#blankResponseHeader input', function(event){
      var currentNewEntry = $('#blankResponseHeader');

      currentNewEntry.append('<div class="col-xs-1"><a href="#" class="delete glyphicon glyphicon-remove"></a></div>')

      var newHeaderOption = '<div class="row center responseHeader" id="blankResponseHeader">' +
                            '   <div class="col-xs-5">' +
                            '    <input type="text" class="key" placeholder="Header key"/>' +
                            '  </div>' +
                            '  <div class="col-xs-1"></div>' +
                            '  <div class="col-xs-5">' +
                            '    <input type="text" class="value" placeholder="Header value"/>' +
                            '  </div>' +
                            '</div>';

      currentNewEntry.after(newHeaderOption)
      currentNewEntry.removeAttr('id');
    });

    $(document).on('click', '#newForm', function(){
      clearForm();
    });

});

var postToMappingsNew = function(payload){
  $.ajax({
      url: protocol + '://' + host + ':' + port + '/__admin/mappings/new',
      type: 'POST',
      ContentType: 'application/json; charset=UTF-8',
      data: JSON.stringify(payload),
      success: function (response) {
        getLatestCreatedId();
        $('#makeRequest').text('Update');
        $('#makeRequest').removeClass('btn-success');
        $('#makeRequest').addClass('btn-warning');
        $('#newForm').text('Create new stub');
        $('#status').text('Stub created').delay(5000).fadeOut();
      }
  })
  .fail(function() {
    $('#status').text('An error occurred contacting Wiremock');

    setTimeout(function(){
      $('#status').fadeOut(1000);
    }, 5000);
  });
};

var postMappingsToEdit = function(id, payload){
  $.ajax({
      url: protocol + '://' + host + ':' + port + '/__admin/mappings/' + id,
      type: 'PUT',
      ContentType: 'application/json; charset=UTF-8',
      data: JSON.stringify(payload),
      success: function (response) {
        $('#status').text('Stub updated!');
      }
  })
  .fail(function() {
    $('#status').text('An error occurred contacting Wiremock');

    setTimeout(function(){
      $('#status').fadeOut(1000);
    }, 5000);
  });
};

var getLatestCreatedId = function(){
  $.getJSON(protocol + '://' + host + ':' + port + '/__admin/mappings', function(mappingsData) {
    $('#editId').val(mappingsData.mappings[0].id);
  })
  .fail(function() {
    $('#status').text('An error occurred contacting Wiremock');

    setTimeout(function(){
      $('#status').fadeOut(1000);
    }, 5000);
  });
}

var generateRequestHeadersArray = function(){
  var headers = $('.requestHeader');
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
  var headers = $('.queryStringMatcher');
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
  var headers = $('.responseHeader');
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

var clearForm = function(){
  $('#stubView #form input').each(function(){ this.value = '' });
  $('#stubView #form textarea').each(function(){ this.value = '' });

  $('#requestType').val('PATH');
  $('#requestMethod').val('GET');

  $('div').remove('.queryStringMatcher');
  $('div').remove('.requestHeader');
  $('div').remove('.responseHeader');

  $('#pathRow').after('<div class="row center queryStringMatcher" id="blankQueryString">' +
                      '    <div class="col-xs-4">' +
                      '      <input type="text" class="key" placeholder="Query key"/>' +
                      '    </div>' +
                      '    <div class="col-xs-3">' +
                      '      <select class="matcher">' +
                      '        <option value="equalTo">equalTo</option>' +
                      '        <option value="matches">matches</option>' +
                      '        <option value="doesNotMatch">doesNotMatch</option>' +
                      '        <option value="contains">contains</option>' +
                      '      </select>' +
                      '    </div>' +
                      '    <div class="col-xs-4">' +
                      '      <input type="text" class="value" placeholder="Query value" />' +
                      '    </div>' +
                      '  </div>');

  $('#blankQueryString').after('<div class="row center requestHeader" id="blankRequestHeader">' +
                               '    <div class="col-xs-4">' +
                               '      <input type="text" class="key" placeholder="Header key"/>' +
                               '    </div>' +
                               '    <div class="col-xs-3">' +
                               '      <select class="matcher">' +
                               '        <option value="equalTo">equalTo</option>' +
                               '        <option value="matches">matches</option>' +
                               '        <option value="doesNotMatch">doesNotMatch</option>' +
                               '        <option value="contains">contains</option>' +
                               '      </select>' +
                               '    </div>' +
                               '    <div class="col-xs-4">' +
                               '      <input type="text" class="value" placeholder="Header value" />' +
                               '    </div>' +
                               '  </div>')

  $('#statusRow').after('<div class="row center responseHeader" id="blankResponseHeader">' +
                        '    <div class="col-xs-5">' +
                        '      <input type="text" class="key" placeholder="Header key"/>' +
                        '    </div>' +
                        '    <div class="col-xs-1"></div>' +
                        '    <div class="col-xs-5">' +
                        '      <input type="text" class="value" placeholder="Header value"/>' +
                        '    </div>' +
                        '</div>');

  $('#makeRequest').removeClass('btn-warning');
  $('#makeRequest').addClass('btn-success');
  $('#makeRequest').text('Create');
  $('#newForm').text('Clear');
  $('#editId').val()
}
