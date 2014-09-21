// ParkMe
// spot.js
// Apoorva Sharma - September 2014

// Class to represent one parking spot. Holds the information of 
// 

var EventEmitter = require("events").EventEmitter;

var EventSource = require('eventsource');

// spot_id: Unique-in-lot id of this spot
// device_id: Spark core id
// device_sensor_index: int of which sensor on the spark is mapped to this spot
function Spot(spot_id, device_id, device_sensor_index) {
   // Subclass EventEmitter
   EventEmitter.call(this);

   this.m_id = spot_id;
   this.m_device_id = device_id;
   var accessToken = "9b818456900c9cc9224fbf9fe6c29e92e2e90210";

   // string of event to subscribe to
   this.m_eventName = "sensor" + device_sensor_index.toString();

   var url = "https://"
   this.m_eventSource = new EventSource("https://api.spark.io/v1/devices/" 
                                        + this.m_device_id + "/events/" 
                                        + this.m_eventName
                                        + "?access_token="+accessToken );

   var self = this;
   this.m_eventSource.addEventListener(this.m_eventName, function(e) {
      var eventData = JSON.parse(e.data);
      var data = {"spot_id": self.m_id, "state": eventData.data};
      self.emit("change", data);
   });
}

Spot.prototype.__proto__ = EventEmitter.prototype;

module.exports.Spot = Spot;

