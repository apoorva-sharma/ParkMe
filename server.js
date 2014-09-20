var port = process.env.PORT || 5000;
var app = require('http').createServer(handler).listen(port)
  , fs = require('fs')
  , url = require('url');


// handles requests sent to the server
function handler (req, res) {
  var path =  url.parse(req.url).pathname;
  // ajax request
  if (path == '/') { // mainpage
    fs.readFile(__dirname + '/pages/index.html',
      function (err, data) {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading');
        }
        res.writeHead(200);
        res.end(data);
      });
  } else if (path == '/plan') {
    // server function to generate the plan and give it to the client
  	var query = url.parse(req.url).query;
    res.writeHead(200);
  	getURLText(query,res);
  } else if (path == '/navigate') {
    // The main "live view" navigation page
    fs.readFile(__dirname + '/pages/navigate.html',
      function (err, data) {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading');
        }
        res.writeHead(200);
        res.end(data);
      });
  } else {
    // The main "live view" navigation page
    fs.readFile(__dirname + path,
      function (err, data) {
        if (err) {
          res.writeHead(404);
          return res.end('Not Found');
        }
        res.writeHead(200);
        return res.end(data);
      });
  }
}

