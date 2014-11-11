'use strict';

var Handlers = {};

Handlers.erasePad = function() {
  Resources.ctx.top.clearRect(0, 0, Resources.width(), Resources.height())
}

Handlers.disablePad = function() {
  Resources.pad.started = false;
  Handlers.erasePad();
}
/**
 * 
 * @param {number} point mouse location x or y
 * @param {string} axis asociated to the point
 * @return The position where the drawing of the 
 * placement pad begins.
 *
 * if point is between [10 - 30] start drawing at 0
 * if point is between [30 - 50] start drawing at 20
 * if point is between [50 - 70] start drawing at 40
 * if point is between [70 - 90] start drawing at 60
 *        
 * [30 - 50] 
 *        
 * Case 1) 31 => floor to 30 % 20 === 0 ? no
 *         31 => ceil to  40 % 20 === 0 ? yes => 30 - 10 = 20
 * Case 2) 49 => floor to 40 % 20 === 0 ? yes => 40 - 20 = 20
 *        
 *        
 * Not ideal, definitely could be refactored. 
 * probably overly complex
 * There seriously has to be a smarter way to do this.
 */

Handlers.getCorner = function(point, axis) {
  // transforms 43 into 40
  var normalized = Math.floor(point/10) * 10;
  var corner;
  // if mouse is not on canvas draw it far far away
  if (point === 1000) {
    return;
  }

  // if point is between height - 30 or width -30
  // draw placement pad starting at height - 40 or
  // width -40
  if (axis === 'x' && point >= Resources.width() - 10) {
    return Math.floor(Resources.width/10) * 10-40 + 1;
  } else if (axis === 'y' && point >= Resources.height() - 10) {
    return Math.floor(Resources.height/10) * 10-40 + 1;
  };

  // if point is smaller than 30 draw starting at margin 
  if (point < 30) {
    corner = 0;
  } else if (Math.floor(point/10) * 10 % 20 === 0) {
    corner = normalized - 20; 
  } else if (Math.ceil(point/10) * 10 % 20 === 0) {
    corner = normalized - 10;
  } else {
    corner = normalized - 30;
  }

  // +1 to not draw over grid
  return corner + 1;
}


/**
 * Draws the placement pad on the canvas, stores the 
 * last calculated corner and if it changes clear the
 * canvas and draw it again at new position.
 * @param {object} event
 */  
Handlers.drawPad = function(e) {

  var x = e.offsetX;
  var y = e.offsetY;
  var cornerX = Handlers.getCorner(x, 'x');
  var cornerY = Handlers.getCorner(y, 'y');
  var oX = (cornerX-1)/20;
  var oY = (cornerY-1)/20;
  var block;
  var r = Resources;

  var spawnEnd = r.spawnZone().end;
  var arriveStart = r.arriveZone().start;
  var arriveEnd = r.arriveZone().end;
  r.pad.started = true;
  r.mousePos.x = oX;
  r.mousePos.y = oY;
  // If we are on the same pad don't change anything 
  if (Handlers.currentX === oX && Handlers.currentY === oY) {
    return;
  // check if pad is in starter/arrival zone
  } else if ( oY < spawnEnd.y ||
             (oX > arriveStart.x - 2 && 
              oX <= arriveEnd.x &&
              oY >= arriveStart.y - 1) ) {
    r.pad.blockedTower = true;
    Handlers.erasePad();
    r.ctx.top.fillStyle = 'rgba(255, 50, 42, 0.2)';
    r.ctx.top.fillRect(cornerX, cornerY, 39, 39)

  } else {
    r.pad.blockedTower = false;
    Handlers.erasePad();
    if (r.pad.blockedTower) {
      r.ctx.top.fillStyle = 'rgba(255, 50, 42, 0.2)';
    } else {
      r.ctx.top.fillStyle = 'rgba(42, 255, 50, 0.2)';
    }

    // if tower pad overlaps another tower, deny placement
    r.blocks.forEach(function(block) {
      if ((block[0] === oX && block[1] ===oY) ||
          (block[0] === oX+1 && block[1] === oY) ||
          (block[0] === oX && block[1] === oY+1) ||
          (block[0] === oX+1 && block[1] === oY+1)) {
        r.pad.blockedTower = true;
        r.ctx.top.fillStyle = 'rgba(255, 50, 42, 0.2)';
      }
    })

    r.ctx.top.fillRect(cornerX, cornerY, 39, 39)
  }
  Handlers.currentX = oX;
  Handlers.currentY = oY;
}

Handlers.creepBlock = function() {
  var r = Resources;
  if (r.pad.blockedTower || !r.pad.started) {
    return;
  }
  // console.log(Resources.pad.blockedTower);
  r.pad.blockedCreep = false;

  var oX = r.mousePos.x;
  var oY = r.mousePos.y;
  var creepThere = false;
  // made an 'aura' around the block to detect incoming creeps
  allCreeps.forEach(function (creep) {
    for (var i = 0; i<=3; ++i) {
      for (var j = 0; j<=3; ++j) {
        // optimisation - and creep.path goes through center 4 blocks
        if (creep.node[0] === oX + i -1 && creep.node[1] === oY + j - 2) {
          creepThere = true;
        }
      }
    }
  })

  if (creepThere) {
    Handlers.erasePad();
    r.pad.blockedCreep = true;
    r.ctx.top.fillStyle = 'rgba(255, 50, 42, 0.2)';
  } else {
    Handlers.erasePad();
    r.pad.blockedCreep = false;
    r.ctx.top.fillStyle = 'rgba(42, 255, 50, 0.2)';
  }
  r.ctx.top.fillRect(oX*20+1, oY*20+1, 39, 39)
}

/**
 * Places the tower on the map, blocks the path for the tower position
 * Creates the grid and calculates the path
 * @param {object} event
 */
Handlers.placeTower = function(event) {
  var r = Resources;
  if (r.pad.blockedTower || 
      r.pad.blockedCreep) {
    return;
  };
  r.pad.placeable = false;
  var startX = Handlers.getCorner(event.offsetX, 'x');
  var startY = Handlers.getCorner(event.offsetY, 'y');
  var oX = (startX-1)/20;
  var oY = (startY-1)/20;
  // check if tower will block path, ugly way will have
  // to refactor after
  var towerBlock = [];
  towerBlock.push([oX, oY])
  towerBlock.push([oX+1, oY])
  towerBlock.push([oX, oY+1])
  towerBlock.push([oX+1, oY+1])
  var towers = towerBlock.concat(towerBlock, r.blocks)
  var grid = new PF.Grid(r.x, r.y);

  for(var i=0; i<=towers.length-1; i++) {
    if (typeof towers[i][0] !== 'undefined' && 
        typeof towers[i][1] !== 'undefined') {
      grid.setWalkableAt(towers[i][0], towers[i][1], false);
    }
  }
  var creepPath = r.finder.findPath(0, 0, r.destination.x, r.destination.y, grid);
  
  if (creepPath.length === 0) {
    Handlers.erasePad();
    r.ctx.top.fillStyle = 'rgba(255, 0, 0, 0.2)';
    r.ctx.top.fillRect(startX, startY, 39, 39);
    return;
  }

  // add new blocks
  var padBlocks = [[oX, oY], [oX+1, oY], [oX, oY+1], [oX+1, oY+1]]
  r.blocks.push([oX, oY])
  r.blocks.push([oX+1, oY])
  r.blocks.push([oX, oY+1])
  r.blocks.push([oX+1, oY+1])
  var tower = new Tower(startX, startY, {range: r.range,
                                         board: 'player',
                                         blocks: padBlocks})
  console.log('player', tower);
  socket.emit('built', tower)
  allTowers.push(tower);

  // recalculate path
  allCreeps.forEach(function(creep) {
    creep.setPath();
  })
 
  // Resources.ctx.main.fillStyle = 'rgb(0,92,9)';
  // Resources.ctx.main.fillRect(startX, startY, 39, 39);
  // once the 
  Handlers.erasePad();
  r.ctx.top.fillStyle = 'rgba(255, 0, 0, 0.2)';
  r.ctx.top.fillRect(startX, startY, 39, 39);

}

