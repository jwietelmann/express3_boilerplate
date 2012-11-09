express3_boilerplate
====================

# Overview
Express3 app with mongoose, passport, mongo sessions, shared server/client jade templates, twitter bootstrap LESS, socket.io, and separate routes for UI and API functionality

# Setup
Just clone the repo and run ```chmod +x setup.sh && ./setup.sh``` from your terminal.

# Configuration
```config/index.js``` is designed to automatically require and export a configuration file that is named according to your ```NODE_ENV``` environment variable, e.g., ```config/development.js``` or ```config/production.js```.

# Response Caching
While there is no caching out of the box, all user-specific UI elements (except in the ```/me``` routes) are handled with an AJAX call after the page loads. Continuing to keep user-specific UI out of the initial page load will make the application more caching-friendly when the time comes.

