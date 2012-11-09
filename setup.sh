#!/bin/sh

# Install NPM dependencies
npm install

# Fetch latest stable jQuery into assets
curl http://code.jquery.com/jquery.js > assets/js/jquery.js

# Fetch jQuery.validate 1.10.0 into assets
curl https://raw.github.com/jzaefferer/jquery-validation/1.10.0/jquery.validate.js > assets/js/jquery.validate.js

# Copy Twitter Bootstrap LESS and Javascript from node module to assets directories
cp -rf node_modules/twitter-bootstrap/less/ assets/css/bootstrap
cp -rf node_modules/twitter-bootstrap/js/ assets/js/bootstrap
cp -rf node_modules/twitter-bootstrap/img/ public/img
# Lazy way to rid ourselves of stuff we don't want
rm -r assets/css/bootstrap/tests
rm -r assets/js/bootstrap/tests
rm assets/js/bootstrap/.jshintrc

# Fetch Underscore and Backbone into assets
curl http://underscorejs.org/underscore.js > assets/js/underscore.js
curl http://backbonejs.org/backbone.js > assets/js/backbone.js

# Copy socket.io client to assets
cp node_modules/socket.io-client/dist/socket.io.js assets/js/socket.io.js
