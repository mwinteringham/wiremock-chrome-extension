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

  $(document).on('click', '.editMapping', function(event) {
    clearForm();
    
    $('#mappingView').hide();
    $('#stubView').show();

    var payload = JSON.parse($(this).parent().find('.mappingDetails').text());

    if(payload.request.url){
        $('#requestPath').val(payload.request.url);
        $('#requestType').val('PATH');
    } else if (payload.request.urlPattern){
        $('#requestPath').val(payload.request.urlPattern);
        $('#requestType').val('REGEX');
    } else if (payload.request.urlPath){
        $('#requestPath').val(payload.request.urlPath);
        $('#requestType').val('PARTIAL');
    }

    $('#requestMethod').val(payload.request.method);
    $('#priority').val(payload.priority);

    for (var queryKey in payload.request.queryParameters) {
      if (payload.request.queryParameters.hasOwnProperty(queryKey)) {
        $('#blankQueryString .key').val(queryKey);
        var subKey = Object.keys(payload.request.queryParameters[queryKey])[0];
        $('#blankQueryString .matcher').val(subKey);
        $('#blankQueryString .value').val(payload.request.queryParameters[queryKey][subKey]);
        $('#blankQueryString input').focus();
      }
    }

    for (var requestKey in payload.request.headers) {
      if (payload.request.headers.hasOwnProperty(requestKey)) {
        $('#blankRequestHeader .key').val(requestKey);
        var subKey = Object.keys(payload.request.headers[requestKey])[0];
        $('#blankRequestHeader .matcher').val(subKey);
        $('#blankRequestHeader .value').val(payload.request.headers[requestKey][subKey]);
        $('#blankRequestHeader input').focus();
      }
    }

    if(payload.request.bodyPatterns[0].equalToJson){
        $('#requestPayload').val(payload.request.bodyPatterns[0].equalToJson);
    } else if (payload.request.bodyPatterns[0].matchesJsonPath){
        $('#requestPayload').val(payload.request.bodyPatterns[0].matchesJsonPath);
    } else if (payload.request.bodyPatterns[0].equalToXml){
        $('#requestPayload').val(payload.request.bodyPatterns[0].equalToXml);
    } else if (payload.request.bodyPatterns[0].matchesXPath){
        $('#requestPayload').val(payload.request.bodyPatterns[0].matchesXPath);
    }

    $('#statusCode').val(payload.response.status);

    for (var responseKey in payload.response.headers) {
      if (payload.response.headers.hasOwnProperty(responseKey)) {
        $('#responseHeaders .key').val(responseKey);
        $('#responseHeaders .value').val(payload.response.headers[responseKey]);
        $('#responseHeaders input').focus();
      }
    }

    $('#responsePayload').val(payload.response.body);

    $('#editId').val(payload.id);
    $('#makeRequest').val("Update");
    $('#newForm').val("New stub");
  });

});

var buildMappingList = function(){
  $.getJSON('http://localhost:8080/__admin/mappings', function(mappingsData) {
    $('#mappings').empty();

    for(var i = 0; i < mappingsData.mappings.length; i++){
      var mapping = mappingsData.mappings[i];
      var url;

      if(mapping.request.url){
          url = mapping.request.url;
      } else if (mapping.request.urlPattern){
          url = mapping.request.urlPattern;
      } else if (mapping.request.urlPath){
          url = mapping.request.urlPath;
      }

      $('#mappings').append('<li class="mapping"><div class="mappingTitle">' + mapping.request.method + ' ' + url + ' - ' + mapping.response.status + "</div><a href='#/" + mapping.id + "' class='deleteMapping'>Delete</a> <a href='#' class='editMapping'>Edit</a>" +
                            '<div class="mappingDetails" style="display: none">' + JSON.stringify(mapping) + '</div></li>');
    }
  })
  .fail(function(error) {
    $('#mappings').text(JSON.stringify(error));
  })
}
