var buildPayload = function(path, pathType, method, priority, queryStringMatchersPayload, requestHeadersPayload, requestPayload, statusCode, responseHeadersPayload, responsePayload, callback){
  payload = {
    "request": {
        "method": method
    },
    "response": {
      "status": statusCode
    }
  };

  payload.priority = priority.length >= 1 ? priority : '1';

  if(queryStringMatchersPayload.length > 0){
    payload.request.queryParameters = {};

    for(var i = 0; i < queryStringMatchersPayload.length; i++){
      var key = queryStringMatchersPayload[i].key;
      var matcher = queryStringMatchersPayload[i].matcher;
      var value = queryStringMatchersPayload[i].value;

      payload.request.queryParameters[key] = {};
      payload.request.queryParameters[key][matcher] = value;
    }
  }

  if(requestHeadersPayload.length > 0){
    payload.request.headers = {};

    for(var i = 0; i < requestHeadersPayload.length; i++){
      var key = requestHeadersPayload[i].key;
      var matcher = requestHeadersPayload[i].matcher;
      var value = requestHeadersPayload[i].value;

      payload.request.headers[key] = {};
      payload.request.headers[key][matcher] = value;
    }
  }

  if(responseHeadersPayload.length > 0 ){
    payload.response.headers = {};

    for(var i = 0; i < responseHeadersPayload.length; i++){
      var key = responseHeadersPayload[i].key;
      var value = responseHeadersPayload[i].value;

      payload.response.headers[key] = value;
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

  if(requestPayload){
    switch (requestPayload.charAt(0)) {
      case '{':
        payload.request.bodyPatterns = [{
          "equalToJson": requestPayload
        }];
        break;
      case '$':
        payload.request.bodyPatterns = [{
          "matchesJsonPath": requestPayload
        }];
        break;
      case '<':
        payload.request.bodyPatterns = [{
          "equalToXml": requestPayload
        }];
        break;
      case '/':
        payload.request.bodyPatterns = [{
          "matchesXPath": requestPayload
        }];
        break;
    }
  }

  if(responsePayload.length > 0){
    payload.response.body = responsePayload;
  }

  callback(payload);
}
