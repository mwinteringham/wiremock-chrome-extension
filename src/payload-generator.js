var buildPayload = function(path, callback){
  payload = {
    "request": {},
  };

  payload.request.url = path;

  callback(payload);
}
