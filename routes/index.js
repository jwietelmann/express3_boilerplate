
var fs = require('fs');

// get the subdirectories
var routeDirs = fs.readdirSync(__dirname);

// for each subdirectory, build an object to hold API routes or UI routes or whatever
for(var i = 0; i < routeDirs.length; i++) {

  // should be like ['api', 'ui']
  var routeDirName = routeDirs[i];
  var routeDirPath = __dirname + '/' + routeDirName;

  if(fs.statSync(routeDirPath).isDirectory()) {

    // exports.ui = {}   <-- what happens
    var routeTypeObject = exports[routeDirName] = {};

    // should be like ['users.js', 'todos.js']  <-- each represents a resource
    var resourceFiles = fs.readdirSync(routeDirPath);

    // for each of these resource files, attach them to their route group
    for(var j = 0; j < resourceFiles.length; j++) {

      // raw filename like 'users.js'
      var resourceFileName = resourceFiles[j];
      if(resourceFileName.match('.swp'))
        continue;
      var resourceFilePath = routeDirPath + '/' + resourceFileName;
      console.log(resourceFilePath);

      // remove the .js so it's just 'users'
      var resourceName = resourceFileName.split('.')[0];

      // exports.ui.users = require('/Users/somebody/my_project/routes/ui/users.js')  <-- what happens
      routeTypeObject[resourceName] = require(resourceFilePath);
    }
  }
}
