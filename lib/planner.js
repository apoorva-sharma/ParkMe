// ParkMe
// planner.js
// Apoorva Sharma - September 2014

// Basic path planner. Uses breadth first search - we have no clear heuristic 
// since both goals and source are dynamic.

actions = {"up":    {"name":"up",    "y":-1, "x":0,  "cost":1},
           "right": {"name":"right", "y":0,  "x":1,  "cost":1},
           "left":  {"name":"left",  "y":0,  "x":-1, "cost":1},
           "down":  {"name":"down",  "y":1,  "x":0,  "cost":1}};

function plan(source, grid) {
   var actiongrid = setUpActionGrid(grid);
   
   source.cost = 0;
   var queue = [source];

   var current = source;

   while (0 != queue.length) {
      // sort by cost to always choose the least costly path
      queue.sort(function(a,b) {
         return b.cost - a.cost;
      });

      current = queue.pop();
      if (isOpenSpot(current, grid)) {
         break;
      }

      var currY = current.r;
      var currX = current.c;

      // go through all the actions to populate queue
      for (a in actions) {
         action = actions[a];
         var newY = currY + action.y;
         var newX = currX + action.x;

         if (newY < grid.length && 0 <= newY && // valid y pos
             newX < grid[0].length && 0 <= newX && // valid x pos
             actiongrid[newY][newX] == "" && // haven't checked it already
             grid[newY][newX] != 1)  // it's a open spot
         { 
            var newCost = current.cost + action.cost;
            actiongrid[newY][newX] = action.name;
            queue.push({"r":newY,
                        "c":newX,
                        "cost":newCost});
         }
      }
   }

   if (!isOpenSpot(current, grid)) {
      return [];
   }

   var path = [];
   while (current.r != source.r || current.c != source.c) {
      var r = current.r;
      var c = current.c;
      var n = actiongrid[r][c];

      // add the action to the front of the path:
      path.unshift({"r":r, "c":c, "name":n});

      current.r -= actions[n].y;
      current.c -= actions[n].x;
   }
   return path;
}

function isOpenSpot(position, grid) {
   r = position.r;
   c = position.c;

   return grid[r][c] == 0;
}

function setUpActionGrid(grid) {
   actiongrid = [];

   grid.forEach(function(row) {
      actionrow = [];
      row.forEach(function(col) {
         actionrow.push("");
      });
      actiongrid.push(actionrow);
   });

   return actiongrid;
}

module.exports.plan = plan;