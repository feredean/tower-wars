'use strict';

/**
 * Creep constructor
 * @param {number} x, spawn x-axis position on matrix
 * @param {number} y, spawn y-axis position on matrix
 */
var Creep = function(x, y, opt) { 
  var grid = new PF.Grid(Resources.x, Resources.y);
  this.name = opt.name;
  this.color = opt.color;
  this.x = x * 20 + 9;
  this.y = y * 20 + 9;
  this.node = [x, y];
  this.pathPos = 0;
  this.path = Resources.finder.findPath(x, y, Resources.destination.x, Resources.destination.y, grid);
  this.setPath();
  this.alive = true;
};

/**
 * Calculate creep path
 * @param {object} grid
 */
Creep.prototype.setPath = function() {
  var r = Resources;
  this.pathPos = 0;
  var grid = new PF.Grid(r.x, r.y);
  for(var i=0; i<=r.blocks.length-1; i++) {
    if (typeof r.blocks[i][0] !== 'undefined' && 
        typeof r.blocks[i][1] !== 'undefined') {
      grid.setWalkableAt(r.blocks[i][0], r.blocks[i][1], false);
    }
  }

  this.path = r.finder.findPath(this.node[0], this.node[1], r.destination.x, r.destination.y, grid);
};

/**
 * Update creep position
 * @param {number} dt, a time delta between ticks
 * Practically it's used because the browser stops
 * animation when the tab is in the background 
 * so in order to update it we need to know how much
 * time passed from putting it on hold to resuming it.
 * TODO update animation if dt > 2*last_dt? 
 */
Creep.prototype.update = function(dt) {
  // We reached the end of the path, here we stop
  if (this.path.length-1 === this.pathPos) {
    this.alive = false;
    return;
  };
  // Get next node where we need to go
  var nextNode = this.path[this.pathPos];
  if (nextNode) {
    // When we arrived at the next node increment path and get next node
    if (nextNode[0] === this.node[0] && nextNode[1] === this.node[1]) {
      this.pathPos += 1;
      nextNode = this.path[this.pathPos];
    }

    // Transform a node [x, y] in placement (px) on the map
    // it's node+1 to align the map with the grid
    var roadToX = (nextNode[0]+1) * 20 - 9;
    var roadToY = (nextNode[1]+1) * 20 - 9;

    // If we did not arrive at next node, move creep
    if (this.x !== roadToX) {
      // Direction decision
      if (nextNode[0] < this.node[0]) {
        this.x -= Resources.speed;
      } else {
        this.x += Resources.speed;
      }
    } 
    if (this.y !== roadToY) {
      if (nextNode[1] < this.node[1]) {
        this.y -= Resources.speed;
      } else {
        this.y += Resources.speed;
      }
    } 

    // If we arrived, update creep node
    if (this.y === roadToY && this.x ===roadToX) {
      this.node = nextNode;
      Handlers.creepBlock();
    }
  };
};

Creep.prototype.render = function() {
  var ctx = Resources.ctx.anim;
  
  ctx.beginPath();
  ctx.fillStyle =this.color;
  ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI, false);
  ctx.fill();
  // ctx.fillText(this.node, this.x+10, this.y);
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#999';
  ctx.stroke();
};

var allCreeps = [];
var startingCreeps = [[2, 1, {name: 'bravo', color: '#F00'}],
                      // [15,2, 'alpha'], 
                      [6, 3, {name: 'charlie', color: '#0F0'}], ];
                      // [0,0], 
                      // [11,5], 
                      // [10,2], 
                      // [9,1]];

for (var i=0; i<=startingCreeps.length-1; ++i){
  var creep = startingCreeps[i];
  allCreeps.push(new Creep(creep[0], creep[1], creep[2])); //... no
}

/**
 * Tower constructor
 * @param {array} blocks
 * @param {number} x, cornerX for tower block
 * @param {number} y, cornerY for tower block
 * @param {number} range, tower range
 */
var Tower = function(blocks, x, y, range) {
  this.nodes = blocks;
  this.x = x+20;
  this.y = y+20;
  this.range = range;

}

Tower.prototype.render = function() {
  var c = {};
  var angle;
  for(var i = 0; i <= allCreeps.length-1; ++i) {
    c.x = allCreeps[i].x;
    c.y = allCreeps[i].y;
    if (Math.pow(c.x - this.x, 2) + Math.pow(c.y - this.y, 2) <= Math.pow(this.range, 2)){
      angle =  Math.atan2(c.y - this.y, c.x - this.x);
      break;
    }
  }

  var ctx = Resources.ctx.anim;

  ctx.beginPath();
  ctx.fillStyle = '#FFF';
  ctx.fillRect(this.x-20, this.y-20, 39, 39);
  ctx.lineWidth = 9;
  ctx.arc(this.x, this.y, 15, angle , angle - 0.15, true);
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = '#333';
  ctx.arc(this.x, this.y, 11, 0* Math.PI, 2* Math.PI, false);
  ctx.lineWidth = 1;
  ctx.stroke();
}


var allTowers = [];




