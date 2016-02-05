var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.sendResponse = function(response, obj, status){
    status = status || 200;
    response.writeHead(status, headers);
    response.end(obj);
};

exports.collectData = function(request, callback){
    var data = '';
    request.on('data', function(chunk){
        data += chunk;
    });
    request.on('end', function(){
        callback(data);
    });
};

exports.send404 = function(response){
    exports.sendResponse(response, '404: Page Not Found', 404);
};

exports.serveAssets = function(res, asset, callback) {

    fs.readFile(archive.paths.siteAssets + asset, {encoding: 'utf-8'},function(error, content){
        if (error){
            fs.readFile(archive.paths.archivedSites + asset, {encoding: 'utf-8'}, function(error, content){
                if (error){
                    callback ? callback() : exports.send404(res);
                }else{
                  exports.sendResponse(res, content);
                }
            });
        }else{
            exports.sendResponse(res, content);
        }
    });
};

exports.sendRedirect = function(response, location, status){
  console.log('sending redirect');
    status = status || 302;
    response.writeHead(status, {Location: location});
    response.end();
};