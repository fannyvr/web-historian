var path = require('path');
var archive = require('../helpers/archive-helpers');
var utils = require('./http-helpers')
var urlParser = require('url')
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  res.end(archive.paths.list);
};

var actions = {
  'GET': function(request, response){
    //if you load the page now you should see the local file path for paths.list
    var parts = urlParser.parse(request.url);
    var pathName = parts.pathname === '/' ? '/index.html' : parts.pathname;
    utils.serveAssets(response, pathName);

      // archive.isUrlInList(pathName, function(isThere){
      //   if (!isThere){
      //     utils.send404(response);
      //   }else{
      //     archive.isUrlArchived(pathName, function(isArchived){
      //       if (!isArchived){
      //         utils.serveAssets(response, '/loading.html');
      //       }else{
      //         utils.serveAssets(response, pathName);
      //       }
      //     });
      //   }
      // });
 
     
    //response.end(archive.paths.list);
  },

  'POST': function(request, response){
    utils.collectData(request, function(data){
      var siteUrl = data.substring(4);
      
      archive.isUrlInList(siteUrl, function(isThere){
        if (!isThere){
          archive.addUrlToList(siteUrl);
        }
      });
    })

  }
}

exports.handleRequest = function(request, response){
  var action = actions[request.method];

  if (action){
    action(request, response);
  }else{
    utils.sendResponse(response, 'Not Found', 404);
  }
};