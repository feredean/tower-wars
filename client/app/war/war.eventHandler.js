
var Handlers = {};

Handlers.erasePad = function() {
  Resources.ctx.top.clearRect(0, 0, Resources.width(), Resources.height())
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
  Resources.mousePos.x = oX;
  Resources.mousePos.y = oY;

  if (Handlers.currentX === oX && Handlers.currentY === oY) {
    return;
  } else {
    Resources.placeable = true;
    Handlers.erasePad();
    if (Resources.placeable) {
      Resources.ctx.top.fillStyle = 'rgba(42, 255, 50, 0.2)';
    } else {
      Resources.ctx.top.fillStyle = 'rgba(255, 50, 42, 0.2)';
    }
    Resources.blocks.forEach(function(block) {
      if ((block[0] === oX && block[1] ===oY) ||
          (block[0] === oX+1 && block[1] === oY) ||
          (block[0] === oX && block[1] === oY+1) ||
          (block[0] === oX+1 && block[1] === oY+1)) {
        Resources.placeable = false;
        Resources.ctx.top.fillStyle = 'rgba(255, 50, 42, 0.2)';
      }
    })


    // console.log('Blocks', Resources.blocks);
    // console.log('pos', [oX, oY]);
    // console.log('huhu', Resources.blocks.indexOf([oX, oY]));

    Resources.ctx.top.fillRect(cornerX, cornerY, 39, 39)
  }
  Handlers.currentX = oX;
  Handlers.currentY = oY;
}

Handlers.creepBlock = function() {
  var oX = Resources.mousePos.x;
  var oY = Resources.mousePos.y;
  var no = false;
  console.log(Resources.placeable);
  if (Resources.placeable) {
    allCreeps.forEach(function (creep) {
      if ((creep.node[0] === oX && creep.node[1] ===oY) ||
          (creep.node[0] === oX+1 && creep.node[1] === oY) ||
          (creep.node[0] === oX && creep.node[1] === oY+1) ||
          (creep.node[0] === oX+1 && creep.node[1] === oY+1)) {
        no = true;  
      }
    })
  };
    if (no) {
      Handlers.erasePad();
      Resources.placeable = false;
      Resources.ctx.top.fillStyle = 'rgba(255, 50, 42, 0.2)';
    } else {
      Handlers.erasePad();
      Resources.placeable = true;
      Resources.ctx.top.fillStyle = 'rgba(42, 255, 50, 0.2)';
    }
    Resources.ctx.top.fillRect(oX*20+1, oY*20+1, 39, 39)
}

/**
 * Places the tower on the map, blocks the path for the tower position
 * Creates the grid and calculates the path
 * @param {object} event
 */
Handlers.placeTower = function(event) {
  if (!Resources.placeable) {
    return;
  };
  Resources.placeable = false;
  var startX = Handlers.getCorner(event.offsetX, 'x');
  var startY = Handlers.getCorner(event.offsetY, 'y');

  var oX = (startX-1)/20;
  var oY = (startY-1)/20;
  // console.log([oX, oY], [oX+1, oY], [oX, oY+1], [oX+1, oY+1]);

  Resources.blocks.push([oX, oY])
  Resources.blocks.push([oX+1, oY])
  Resources.blocks.push([oX, oY+1])
  Resources.blocks.push([oX+1, oY+1])

  allCreeps.push(new Creep(0, 0, {name: 'jhondoe', color:'#00F'}));
  allCreeps.forEach(function(creep) {
    creep.setPath();
  })
 
  // allCreeps.forEach(function (creep) {
  //   if ((creep.node[0] === oX && creep.node[1] ===oY) ||
  //       (creep.node[0] === oX+1 && creep.node[1] === oY) ||
  //       (creep.node[0] === oX && creep.node[1] === oY+1) ||
  //       (creep.node[0] === oX+1 && creep.node[1] === oY+1)) {
  //     console.log('nope');
  //     Resources.placeable = false;
  //     Resources.ctx.top.fillStyle = 'rgba(255, 50, 42, 0.2)';

  //   }
  // })
  Resources.ctx.main.fillStyle = '#DDD';
  Resources.ctx.main.fillRect(startX, startY, 39, 39);
  // once the 
  Handlers.erasePad();
  Resources.ctx.top.fillStyle = 'rgba(255, 0, 0, 0.2)';
  Resources.ctx.top.fillRect(startX, startY, 39, 39);

}

