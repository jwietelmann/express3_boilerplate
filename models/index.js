
var fs = require('fs')
  , mongoose = require('mongoose')
;

// get the subdirectories
var modelFiles = fs.readdirSync(__dirname);
for(var i = 0; i < modelFiles.length; i++) {
  var parts = modelFiles[i].split('.');
  if(parts[parts.length-1] != 'js') continue; // skip non-js files
  
  // remove the extension so it's just 'user'
  var modelName = parts[0];

  if(modelName == 'index') continue; // skip this file

  var schema = require('./' + modelName);
  // uppercase first letter so it's User
  modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
  // make the schema be UserSchema
  schemaName = modelName + 'Schema';
  // load and export the model
  exports[schemaName] = schema;
  exports[modelName] = mongoose.model(modelName, schema);
}
