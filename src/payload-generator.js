var buildPayload = function(path, pathType, callback){
  payload = {
    "request": {},
  };

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
