
var fs = require('fs');

// get the subdirectories
var modelFiles = fs.readdirSync(__dirname);
for(var i = 0; i < modelFiles.length; i++) {
  // remove the .js so it's just 'user'
  var modelName = modelFiles[i].split('.')[0];
  // uppercase first letter so it's User
  modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
  // load and export the model
  exports[modelName] = require('./' + modelName);
}
