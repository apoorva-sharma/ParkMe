// ParkMe
// server.js
// Apoorva Sharma - September 2014

var port = process.env.PORT || 5000;
var app = require('http').createServer(handler).listen(port)
  , fs = require('fs')
  , url = require('url')
  , querystring = require('querystring');

var Lot = require('./lib/lot').Lot;

var Planner = require('./lib/planner.js');

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
      var query = querystring.parse(url.parse(req.url).query);
      console.log(query);
      var lot_id = query.lot;
      if (!lot_id) {
         res.writeHead(500);
         return res.end("invalid request");
      }

      if (!lots[lot_id]) {
         res.writeHead(500);
         return res.end("invalid request");
      }

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


   // server function to generate the plan and give it to the client
   else if (path == '/plan') 
   {
      var query = querystring.parse(url.parse(req.url).query);
      console.log(query);
      var lot_id = query.lot;
      var r = query.r;
      var c = query.c;

      if (!lot_id || !r || !c) {
         res.writeHead(500);
         return res.end("invalid request");
      }

      if (!lots[lot_id]) {
         res.writeHead(500);
         return res.end("invalid request");
      }

      var source = {"r":r,"c":c};
      var grid = lots[lot_id].m_grid;
      var path = Planner.plan(source,grid);
      res.writeHead(200);
      res.end(JSON.stringify(path));
   } 

   // server function to give the current lot state to the client
   else if (path == '/lot') 
   {
      var query = querystring.parse(url.parse(req.url).query);
      var lot_id = query.lot;

      if (!lots[lot_id]) {
         res.writeHead(500);
         return res.end("invalid request");
      }

      var grid = lots[lot_id].m_grid;
      if (!grid) {
         res.writeHead(500);
         return res.end("Unknown Lot Id");
      }
      res.writeHead(200);
      res.end(JSON.stringify(grid));
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

