// ParkMe
// server.js
// Apoorva Sharma - September 2014

var port = process.env.PORT || 5000;
var app = require('http').createServer(handler).listen(port)
  , fs = require('fs')
  , url = require('url');

var Lot = require('./lib/lot').Lot;

// map with id -> Lot with the id
var lot1 = new Lot(1);
var lots = {1: lot1};

// handles requests sent to the server
function handler (req, res) {
   var path =  url.parse(req.url).pathname;
   // ajax request

   // mainpage
   if (path == '/') { 
      fs.readFile(__dirname + '/pages/index.html',
         function (err, data) {
            if (err) {
             res.writeHead(500);
             return res.end('Error loading');
            }
            res.writeHead(200);
            res.end(data);
         });
   }

   // server function to generate the plan and give it to the client
   else if (path == '/plan') 
   {
      var query = url.parse(req.url).query;
      res.writeHead(500);
      return res.end("Feature not implemented");
   } 

   // The main "live view" navigation page
   else if (path == '/navigate') 
   {
      fs.readFile(__dirname + '/pages/navigate.html',
         function (err, data) {
            if (err) {
               res.writeHead(500);
               return res.end('Error loading');
            }
            res.writeHead(200);
            res.end(data);
         });
   }

   // stream of server-side events related to the lot whose
   // id is passed as the query (e.g. /status?1);
   else if (path == '/status') 
   {
      var lot_id = url.parse(req.url).query;
      res.writeHead(200, {
         'Content-Type': 'text/event-stream',
         'Cache-Control': 'no-cache',
         'Connection': 'keep-alive'
      });

      var id = (new Date()).toLocaleTimeString();

      // set up lister on the requested lot, and pass events to client
      lots[lot_id].on('change', function() {
         data = "";
         res.write('id: ' + id + '\n');
         res.write("data: change" + '\n\n');
      });
   } 

   // Otherwise, try and follow the file path
   else 
   {
      fs.readFile(__dirname + path,
      function (err, data) {
         if (err) {
            res.writeHead(404);
            return res.end('Not Found');
         }
         res.writeHead(200);
         res.end(data);
      });
   }
}

