document.addEventListener('DOMContentLoaded', function() {
    var submit = document.getElementById('makeRequest');

    submit.addEventListener('click', function() {
      var path = document.getElementById('requestPath').value;
      var pathType = document.getElementById('requestType').value;

      buildPayload(path, pathType, function(payload){
        postToMappingsNew(payload);
      });
    });
});

var postToMappingsNew = function(payload){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:8080/__admin/mappings/new', true);
  xhr.setRequestHeader("Content-Type","application/json");
  xhr.send(JSON.stringify(payload));
}
