express3_boilerplate
====================

Express3 app with mongoose, passport, redis sessions, shared server/client jade templates, twitter bootstrap LESS, socket.io, and separate routes for UI and API functionality

All user-specific UI elements (except in the ```/me``` routes) are handled with an AJAX call after the page loads. This will make the pages more cache-friendly when it comes time to scale.

The following will do ```npm install``` as well as copy and fetch client-side libraries to ```public``` and ```assets```:

```
chmod +x setup.sh
./setup.sh
```
