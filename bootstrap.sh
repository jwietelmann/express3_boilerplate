#!/bin/sh

# Copy Twitter Bootstrap LESS and Javascript from node module to assets directories
cp -rf node_modules/twitter-bootstrap/less/ assets/css/bootstrap
cp -rf node_modules/twitter-bootstrap/js/ assets/js/bootstrap
cp -rf node_modules/twitter-bootstrap/img/ public/img

# Lazy way to rid ourselves of stuff we don't want
rm -r assets/css/bootstrap/tests
rm -r assets/js/bootstrap/tests
rm assets/js/bootstrap/.jshintrc
