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
  this.path = Resources.finder.findPath(x, y, Resources.destination.x, Resources.destination.y, grid)
}

/**
 * Calculate creep path
 * @param {object} grid
 */
Creep.prototype.setPath = function() {
  this.pathPos = 0;
  var grid = new PF.Grid(Resources.x, Resources.y);
  for(var i=0; i<=Resources.blocks.length-1; i++) {
    grid.setWalkableAt(Resources.blocks[i][0], Resources.blocks[i][1], false)
  }

  this.path = Resources.finder.findPath(this.node[0], this.node[1], Resources.destination.x, Resources.destination.y, grid)
}

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
}

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
}

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

