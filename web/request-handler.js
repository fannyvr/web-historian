var path = require('path');
var archive = require('../helpers/archive-helpers');
var utils = require('./http-helpers')
var urlParser = require('url')

exports.handleRequest = function (req, res) {
  res.end(archive.paths.list);
};

var actions = {
  'GET': function(request, response){
    var parts = urlParser.parse(request.url);
    var pathName = parts.pathname === '/' ? '/index.html' : parts.pathname;
    utils.serveAssets(response, pathName);

    },

  'POST': function(request, response){
    utils.collectData(request, function(data){
      var siteUrl = data.substring(4);
     
      archive.isUrlInList(siteUrl, function(isThere){
        if (!isThere){
          archive.addUrlToList(siteUrl);
        }else{
          console.log(siteUrl);
          archive.isUrlArchived(siteUrl, function(isArchived){     
            if(isArchived){
              utils.sendRedirect(response, '/' + siteUrl);
            }else{
              utils.sendRedirect(response, '/loading.html')
            }
          });
        }
      });
    });
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