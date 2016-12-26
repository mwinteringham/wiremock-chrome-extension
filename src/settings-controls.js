var host, port;

chrome.storage.local.get(['host', 'port'], function(item){
  if(Object.getOwnPropertyNames(item).length === 0){
    host = 'localhost';
  } else {
    host = item.host;
  }

  if(Object.getOwnPropertyNames(item).length === 0){
    port = '8080';
  } else {
    port = item.port;
  }
});

$(document).ready(function() {
  $('#host').val(host);
  $('#port').val(port);

  $(document).on('click', '#updateWiremockHost', function(event){
    var tmpHost = $('#host').val();
    var tmpPort = $('#port').val();

    chrome.storage.local.set({ "host": tmpHost, "port": tmpPort }, function(){
      host = tmpHost;
      port = tmpPort;

      $('#updateWiremockMessage').text("Updated!")

      setTimeout(function(){
        $('#updateWiremockMessage').fadeOut("slow");
      }, 5000);
    });
  });

});
