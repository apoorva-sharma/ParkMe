// ParkMe
// lot.js
// Apoorva Sharma - September 2014

// Stores and keeps track of the current state of a Lot.
// Lots are a collection of Sparks, which manage a few Spots.
// Lots also store the physical mapping of spots.

var EventEmitter = require("events").EventEmitter;

var Spark = require('./spark').Spark;

// to handle the database operations
var pg = require('pg');
var conString = process.env.DATABASE_URL || "postgres://parkme:park1234@localhost:5432/lots";

function Lot(lot_id) {
   // Subclass EventEmitter
   EventEmitter.call(this);

   this.m_id = lot_id; // id of lot, as it appears in db

   // the elements below are loaded from the database
   this.m_width = 0; // width of lot
   this.m_height = 0; // height of lot
   this.m_grid = []; // 2D array representing the parking lot
   this.m_sparks = []; // The Sparks connected to this lot
   this.m_spot2pos = {}; // Map of spot id to position in lot

   this.loadFromDb();
}

Lot.prototype.__proto__ = EventEmitter.prototype;

// Sets up the lot based on ID lookup in the database.
// Starts listening to the Sparks in the lot.
Lot.prototype.loadFromDb = function() {
   // TODO: actually use a database

   this.m_width = 20;
   this.m_height = 9;

   // spot id 1 is always a full spot
   // spot id -1 means a road 

   this.m_grid = [[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                  [-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1,-1],
                  [-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1],
                  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                  [-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1,-1],
                  [-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1],
                  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
                  [-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];

   this.m_sparks = [new Spark(1, "53ff73065075535147451187"), new Spark(2, "53ff76065075535118471187")];

   this.m_spot2pos = {1: {r:2,c:16}, 2: {r:5,c:11}};

   this.m_sparks.forEach(function(spot) {
      spot.on("change", this.handleSparkChange);
   }, this)
}

// Runs whenever a spark in the lot reports a change.
Lot.prototype.handleSparkChange = function(data) {
   var spot_id = data.spot_id;
   var gridpos = this.m_spot2pos[spot_id];
   var r = gridpos.r;
   var c = gridpos.c;

   this.m_grid[r][c] = ("free" ? 0 : 1);

   console.log(this.m_grid);

   this.emit("change");
}

exports.Lot = Lot;

