'use strict';

/**
 * Creep constructor
 * @param {number} x, spawn x-axis position on matrix
 * @param {number} y, spawn y-axis position on matrix
 * @param {object} opt, Creep options
 * - name (debug info)
 * - color
 * - board - on which it will be spawned
 */
var Creep = function(x, y, opt) { 
  // id
  if (allCreeps.length === 0 && opt.board === 'player') {
    this.id = 'p0';
  } else if (enemyCreeps.length === 0 && opt.board === 'enemy') {
    this.id = 'e0';
  } else if (opt.board === 'enemy') {
    // not pretty
    this.id = 'e' + (parseInt(enemyCreeps[enemyCreeps.length-1].id.slice(1))+1);
  } else {
    this.id = 'p' + (parseInt(allCreeps[allCreeps.length-1].id.slice(1))+1);
  }
  
  // grid
  var grid = new PF.Grid(Resources.x, Resources.y);
  this.board = opt.board;
  this.x = x * 20 + 9;
  this.y = y * 20 + 9;
  this.node = [x, y];
  this.pathPos = 0;
  // path
  this.path = Resources.finder.findPath(x, y, Resources.destination.x, Resources.destination.y, grid);
  this.setPath();
  // misc
  this.color = opt.color;
  this.type = opt.type;
  this.alive = true;
  // stats
  this.health = opt.health;
  this.speed = opt.speed;
  this.cost = opt.cost;
  this.bounty = opt.bounty;
  this.income = opt.income;


};

/**
 * Calculate creep path
 * @param {object} grid
 */
Creep.prototype.setPath = function() {
  var blocks;
  var r = Resources;
  console.log('setPath: ', this.id, r.blocks);
  console.log(this.board);
  if (this.board === 'player') {
    blocks = r.blocks;
  } else {
    blocks = r.enemyBlocks;
  }

  this.pathPos = 0;
  var grid = new PF.Grid(r.x, r.y);
  for(var i=0; i<=blocks.length-1; i++) {
    if (typeof blocks[i][0] !== 'undefined' && 
        typeof blocks[i][1] !== 'undefined') {
      grid.setWalkableAt(blocks[i][0], blocks[i][1], false);
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
 * also important when cpu is at max, now the animation 
 * slows down.
 */
Creep.prototype.update = function(dt) {
  var r = Resources;
  var projectiles;
  // We reached the end of the path, here we stop
  if (this.path.length-1 === this.pathPos) {
    if (this.id[0] === 'p') {
      r.takeLifePoint('player');
      projectiles = allProjectiles;
    } else {
      r.takeLifePoint('enemy');
      projectiles = enemyProjectiles;
    }
    purgeProjectiles(projectiles, this.id);
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
        this.x -= this.speed;
      } else {
        this.x += this.speed;
      }
    } 
    if (this.y !== roadToY) {
      if (nextNode[1] < this.node[1]) {
        this.y -= this.speed;
      } else {
        this.y += this.speed;
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
  var r = Resources;
  var ctx;
  var start;
  var end;

  if (this.board === 'player') {
    ctx = r.ctx.anim;
  } else {
    ctx = r.ctx.enemyAnim;
  } 
  var hp = (this.health/r.creeps[this.type].health)*20;

  ctx.beginPath();
  ctx.fillStyle = 'green';
  ctx.fillRect(this.x-10, this.y-11, hp, 3);
  ctx.fill();
  ctx.arc(this.x, this.y, 6, 0, 2 * Math.PI, false);
  ctx.fillStyle = '#333';
  // ctx.fillText(this.health, this.x+10, this.y);
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  // i'm too tired to know what i'm doing but this should 
  // a clue as to how much hp the creep has
  // ctx.arc(this.x, this.y, 6, 1 * Math.PI, 0.9 * Math.PI)

  if (start === 0.4 && end === 2.6) {
    start = 0.5;
    end = 2.5;
  }
  ctx.arc(this.x, this.y, 6, 0 * Math.PI, 2 * Math.PI, true)
  ctx.fillStyle = this.color;
  ctx.fill();
};

Creep.prototype.takeDamage = function(damage) {
  var r = Resources;
  var projectiles;
  this.health -= damage;
  if (this.health <= 0) {
    if (this.id[0] === 'p') {
      r.ajustGold(this.bounty, 'player');
      projectiles = allProjectiles;
    } else {
      r.ajustGold(this.bounty, 'enemy');
      projectiles = enemyProjectiles;
    }
    // delete the projectiles heading for this creep
    purgeProjectiles(projectiles, this.id);
    this.alive = false;

  }
};

var allCreeps = [];
var enemyCreeps = [];


/**
 * Tower constructor
 * @param {array} blocks
 * @param {number} x, cornerX for tower block
 * @param {number} y, cornerY for tower block
 * @param {number} range, tower range
 */
var Tower = function(x, y, opt) {
  this.x = x+20;
  this.y = y+20;
  this.nodes = opt.blocks;
  this.board = opt.board;
  this.type = opt.type;
  this.range = opt.range;
  this.speed = opt.speed;
  this.invert = opt.invert;
  // not sure what to think about this
  this.reload = undefined;
  if (opt.type !== 'blade') {
    this.projectile = {
      size: opt.projectile.size,
      color: opt.projectile.color,
      dmg: opt.projectile.dmg,
      board: opt.board,
    };
  } else {
    this.spin = 0;
    this.dmg = opt.dmg;
  }
}

Tower.prototype.render = function() {
  var self = this;
  var c = {};
  var angle;
  var ctx;
  var creeps;
  var projectiles;
  var radius;
  var start;
  var end;
  var centering;

  if (this.board === 'player') {
    ctx = Resources.ctx.anim;
    creeps = allCreeps;
    projectiles = allProjectiles;
  } else {
    ctx = Resources.ctx.enemyAnim;
    creeps = enemyCreeps;
    projectiles = enemyProjectiles;
  } 

  if (this.type === 'blade') {
    if (!this.reload) {
      for(var i = 0; i <= creeps.length-1; ++i) {
        c.x = creeps[i].x;
        c.y = creeps[i].y;
        if (Math.pow(c.x - this.x, 2) + Math.pow(c.y - this.y, 2) <= Math.pow(this.range, 2)) {
          // start blades
          centering = 10;
            creeps[i].takeDamage(this.dmg);
        }
      }
      self.reload = setTimeout(function() {
        self.reload = undefined;
      }, self.speed);
    }
    // at some point it'll get to long double
    // this solution is trippy
    // this.spin = (this.spin + 0.25) % 2*Math.PI;
    // so
    this.spin = this.spin > 100000 ? this.spin = 0 : this.spin += 0.35;
    ctx.lineWidth = 20;
    start = this.spin;
    end = this.spin+0.5;
    radius = 3;


  } else {

    for(var i = 0; i <= creeps.length-1; ++i) {
      c.x = creeps[i].x;
      c.y = creeps[i].y;
      var road = Math.sqrt(Math.pow(c.x - this.x,2) + Math.pow(c.y - this.y,2));
      // aim for the first creep
      // here there's a problem with the first creep not being the physically first due to 
      // randomization of spawn areas.
      if (Math.pow(c.x - this.x, 2) + Math.pow(c.y - this.y, 2) <= Math.pow(this.range, 2)) {
        angle =  Math.atan2(c.y - this.y, c.x - this.x);
        if (!this.reload) {
          var x = self.x + 20*(c.x - self.x)/road;
          var y = self.y + 20*(c.y - self.y)/road;
          var opt = self.projectile;
          opt.creepId = creeps[i].id;

          projectiles.push(new Projectile(x, y, opt))
          self.reload = setTimeout(function() {
            self.reload = undefined;
          }, self.speed);
        }
        break;
      }
    }
    ctx.lineWidth = 9;
    radius = 11;
    // centering the canon with a radian of 0.15
    start = angle + 0.075;
    end = angle - 0.075;
    centering = 15;
  }

  ctx.beginPath();
  ctx.fillStyle = '#FFF';
  ctx.fillRect(this.x-20, this.y-20, 39, 39);
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.arc(this.x, this.y, centering, start, end, this.invert);
  ctx.stroke();

  ctx.beginPath();6
  ctx.strokeStyle = '#333';
  ctx.arc(this.x, this.y, radius, 0* Math.PI, 2* Math.PI, false);
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.stroke();
}


var allTowers = [];
var enemyTowers = [];

/**
 * Projectile constructor
 * @param {number} x, projectile start x
 * @param {number} y, projectile start y
 * @param {number} creepId 
 */
var Projectile = function(x, y, opt) {
  this.x = x;
  this.y = y;
  this.board = opt.board;
  this.speed = 4;
  this.dmg = opt.dmg;
  this.color = opt.color;
  this.size = opt.size;
  this.creepId = opt.creepId;
  this.alive = true;
}

Projectile.prototype.render = function() {
  var ctx = this.board === 'player' ? Resources.ctx.anim : Resources.ctx.enemyAnim;

  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.stroke();
}

Projectile.prototype.update = function() {
  var creeps = this.board === 'player' ? allCreeps : enemyCreeps;
  var c = {};
  // if tower is focusing on this creep

  for(var i = 0; i <= creeps.length-1; ++i) {
    if(creeps[i].id === this.creepId){
      c = creeps[i];
      break;  
    }
  }

  // check if creep is dead, destroy projectile
  if (!c.alive) {
    this.alive = false;
    return;
  }

  var road = Math.sqrt(Math.pow(c.x - this.x,2) + Math.pow(c.y - this.y,2));

  // go kill it
  this.x += this.speed*(c.x - this.x)/road;
  this.y += this.speed*(c.y - this.y)/road;
  if (this.y > c.y-5 && this.y < c.y+5 && 
      this.x > c.x-5 && this.x < c.x+5) {
    this.alive = false;
    c.takeDamage(this.dmg);
  }
}

function purgeProjectiles(arr, id) {
  for (var i = 0; i <= arr.length-1; ++i) {
    if (arr[i].creepId === id) {
      arr.splice(i,1);
    }
  }
}

var allProjectiles = [];
var enemyProjectiles = [];



