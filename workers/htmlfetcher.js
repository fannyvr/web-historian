var archive = require('../helpers/archive-helpers');

archive.readListOfUrls(function(list){
	archive.downloadUrls(list);
});

var fs = require('fs')
fs.appendFile(__dirname + '/log.txt', 'cron job executed at' + new Date() + '\n', function(err, written, string) {})