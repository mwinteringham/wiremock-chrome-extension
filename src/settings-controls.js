var host = 'localhost',
    port = '8080',
    protocol = 'http';

chrome.storage.local.get(['host', 'port', 'protocol'], function(item){
  if(typeof item.host !== 'undefined'){
    host = item.host;
  }

  if(typeof item.port !== 'undefined'){
    port = item.port;
  }

  if(typeof item.protocol !== 'undefined'){
    protocol = item.protocol;
  }

});

$(document).ready(function() {
  $('#host').val(host);
  $('#port').val(port);
  $('#protocol').val(protocol)

  $(document).on('click', '#updateWiremockHost', function(event){
    var tmpHost = $('#host').val();
    var tmpPort = $('#port').val();
    var tmpProtocol = $('#protocol').val();

    chrome.storage.local.set({ 'host': tmpHost, 'port': tmpPort, 'protocol' : tmpProtocol }, function(){
      host = tmpHost;
      port = tmpPort;
      protocol = tmpProtocol;

      $('#updateWiremockMessage').text("Updated!")

      setTimeout(function(){
        $('#updateWiremockMessage').fadeOut("slow");
      }, 5000);
    });
  });

});
