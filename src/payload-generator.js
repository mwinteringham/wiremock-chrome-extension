var buildPayload = function(path, pathType, method, headerMatchersPayload, callback){
  payload = {
    "request": {
        "method": method
    }
  };

  if(headerMatchersPayload.length > 0){
    payload.request.headers = {};

    for(var i = 0; i < headerMatchersPayload.length; i++){
      var key = headerMatchersPayload[i].key;
      var matcher = headerMatchersPayload[i].matcher;
      var value = headerMatchersPayload[i].value;

      payload.request.headers[key] = {};
      payload.request.headers[key][matcher] = value;
    }
  }

  switch(pathType){
    case 'PATH':
      payload.request.url = path;
      break;
    case 'REGEX':
      payload.request.urlPattern = path;
      break;
    case 'PARTIAL':
      payload.request.urlPath = path;
      break;
  }

  callback(payload);
}
