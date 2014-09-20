// ParkMe
// spark.js
// Apoorva Sharma - September 2014

// Class to represent one spark core, that manages one to four spots.

var EventEmitter = require("events").EventEmitter;

var Spot = require("./spot").Spot;

function Spark(spark_id, device_id) {
   // Subclass EventEmitter
   EventEmitter.call(this);

   this.m_id = spark_id;
   this.m_device_id = device_id;
   this.m_spots = [];

   this.loadFromDb();
}


Spark.prototype.__proto__ = EventEmitter.prototype;

Spark.prototype.loadFromDb = function() {
   // TODO: Actually use a database.

   if (this.m_id == 1) {
      this.m_spots.push(new Spot(1, this.m_device_id, 0));
   } else {
      this.m_spots.push(new Spot(2, this.m_device_id, 0));
   }

   this.m_spots.forEach( function(spot) {
      spot.on("change", this.handleSpotChange);
   }, this)
}

// Runs whenever a spot connected to the Spark reports a change
Spark.prototype.handleSpotChange = function(e) {
   // ripple the change up
   this.emit("change", e);
}

module.exports.Spark = Spark;