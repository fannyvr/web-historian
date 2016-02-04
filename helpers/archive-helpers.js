var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

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

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!




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
    var newSite = '\n' + userInput;
    fs.appendFile(exports.paths.list, newSite, function(err){
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
  //exports.readListOfUrls(function(sites){
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






            // if (!error && response.statusCode == 200){
            //   
            //   fs.writeFile(newPath, body, function(err){
            //     if (err){
            //       throw err
            //     }
            //     console.log('success!');
            //   });
          //   }
          // ).pipe(request.put(archivedSites));
          // retrieve from website
          // store static website in sites

