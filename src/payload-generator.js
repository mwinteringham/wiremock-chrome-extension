document.addEventListener('DOMContentLoaded', function() {
    var submit = document.getElementById('makeRequest');

    submit.addEventListener('click', function() {
      console.log('Success!');
      var result = document.getElementById('result')
      result.innerHTML = 'success';
    });
});

var postToMappingsNew = function(payload){
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:8080/__admin/mappings/new', true);
  xhr.setRequestHeader("Content-Type","application/json");
  xhr.send(JSON.stringify(payload));

  xhr.onreadystatechange = function(){
    var result = document.getElementById('result')
    result.innerHTML = xhr.status,

    setTimeout(function(){
        result.innerHTML = '';
    }, 3000);
  }
}
