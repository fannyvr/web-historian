var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');


exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

exports.readListOfUrls = function(callback){
  var sites;
  fs.readFile(this.paths.list, 'UTF-8', function(err, data){
    if(err){
      throw err;
    }
      sites = data.split('\n');
      callback(sites);
  });
  
};

exports.isUrlInList = function(userInput, callback){
    var isThere = false;
    exports.readListOfUrls(function(sites){
     _.each(sites, function(element){
         if (element === userInput){
             isThere = true;
         }
     });
    if (callback){
      callback(isThere);
    }
    });
};

exports.addUrlToList = function(userInput, callback){
    //var newSite = ;
    fs.appendFile(exports.paths.list, '\n' + userInput, function(err){
        if (err){
            throw err;
        }
    if (callback){
      callback();
    }
    });
};

exports.isUrlArchived = function(userInput, callback){
    fs.readdir(exports.paths.archivedSites, function(err, files){
        if (err){
            throw err
        }else{
            var isArchived = false;
            _.each(files, function(filename){
                if (filename === userInput){
                    isArchived = true;
                }
            });
            if (callback){
              callback(isArchived);
            }
        }
    })
};

exports.downloadUrls = function(listOfUrls){
    _.each(listOfUrls, function(url){
      exports.isUrlArchived(url, function(truthy){
        if (!truthy){
          var newPath = exports.paths.archivedSites + '/' + url;
          var destination = fs.createWriteStream(newPath);
          var fullurl = 'http://' + url
          request(fullurl).pipe(destination).on('error', function(error){
            console.log(error);
          });
        }
      })
    });
};
