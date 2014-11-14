'use strict';

var Engine = (function(global){
  var doc = global.document;
  var win = global.window;
  var lastTime;
 /**
  * Background Canvas
  * - render grid
  * - place blocks
  * - calculate path
  * 
  * My solution got ugly fast, need to refactor it
  * Maybe move it into resource?
  */

  // Player
  var canvasBackground = doc.createElement('canvas');
  var mainCtx = canvasBackground.getContext('2d');
  canvasBackground.width = Resources.width();
  canvasBackground.height = Resources.height();
  doc.getElementById('canvas-main').appendChild(canvasBackground);

  // Enemy 
  var enemyBackground = doc.createElement('canvas');
  var enemyMain = enemyBackground.getContext('2d');
  enemyBackground.width = Resources.width();
  enemyBackground.height = Resources.height();
  doc.getElementById('enemy-main').appendChild(enemyBackground);

  /**
   * Top Canvas
   * - buildings placement engine
   */

  // Player
  var canvasTop = doc.createElement('canvas');
  var topCtx = canvasTop.getContext('2d');
  canvasTop.width = Resources.width();
  canvasTop.height = Resources.height();
  doc.getElementById('canvas-top').appendChild(canvasTop);

  // Enemy
  // var canvasTop = doc.createElement('canvas');
  // var topCtx = canvasTop.getContext('2d');
  // canvasTop.width = Resources.width();
  // canvasTop.height = Resources.height();
  // doc.getElementById('enemy-canvas-top').appendChild(canvasTop);

  /**
   * Animation Canvas
   * - enemy animation
   * - tower animations
   * - projectile animations
   */

  // Player
  var canvasAnim = doc.createElement('canvas');
  var animCtx = canvasAnim.getContext('2d');
  canvasAnim.width = Resources.width();
  canvasAnim.height = Resources.height();
  doc.getElementById('canvas-anim').appendChild(canvasAnim);

  // Enemy
  var enemyAnim = doc.createElement('canvas');
  var enemyAnimCtx = enemyAnim.getContext('2d');
  enemyAnim.width = Resources.width();
  enemyAnim.height = Resources.height();
  doc.getElementById('enemy-anim').appendChild(enemyAnim);

  Resources.ctx.main = mainCtx;
  Resources.ctx.enemyMain = enemyMain;
  Resources.ctx.top = topCtx;
  Resources.ctx.anim = animCtx;
  Resources.ctx.enemyAnim = enemyAnimCtx;

  function main() {
    renderPlayerGrid(Resources.ctx.main);
    renderEnemyGrid(Resources.ctx.enemyMain);
    animate();
  }

  function animate() {
    var now = Date.now();
    // dt is not implemented
    var dt = (now - lastTime) / 1000.0;
    lastTime = now;
    update(dt)
    renderCreeps();
    renderTowers();
    renderProjectiles() 
    win.requestAnimationFrame(animate);
    // setInterval(function() {
    //   update(dt);
    // renderTowers();
    //   renderCreeps();
    // }, 333)
  }

  function init() {
    lastTime = Date.now();
    main();
  }

  function update(dt) {
    animCtx.clearRect(0, 0, Resources.width(), Resources.height())
    enemyAnimCtx.clearRect(0, 0, Resources.width(), Resources.height())
    updateCreeps(allCreeps);
    updateCreeps(enemyCreeps);
    updateProjectiles(allProjectiles);
    updateProjectiles(enemyProjectiles);
  }


  /**
   * Draws and updates the position of the creeps on the 
   * Animation Canvas 
   */  
  function updateCreeps(creeps) {
    for (var i=0; i<=creeps.length-1; ++i) {
      if (creeps[i].alive) {
        creeps[i].update();
      } else {
        creeps.splice(i,1);
      }
    }
  }

  /**
   * Draws and updates the position of the projectiles on the 
   * Animation Canvas 
   */  
  function updateProjectiles(projectiles) {
    for (var i=0; i<=projectiles.length-1; ++i) {
      if (projectiles[i].alive) {
        projectiles[i].update();
      } else {
        projectiles.splice(i,1);
      }
    }
  }


  /**
   * Creates a grid
   */
  function renderPlayerGrid(ctx) {
    var row;
    var col;
    ctx.strokeStyle = '#CCC';
    ctx.lineWidth = 1;

    for (row = 0; row <= Resources.y; ++row) {
      ctx.beginPath();
      // ctx.fillText(row, 0 + 0.5, row*20 - 6 + 0.5);
      ctx.moveTo( 0 + 0.5, row*20 + 0.5);
      ctx.lineTo( 600 + 0.5, row*20 + 0.5);
      ctx.stroke();
    }

    for (col = 0; col <= Resources.x; ++col) {
      ctx.beginPath();
      ctx.moveTo( col*20 + 0.5, 0 + 0.5);
      ctx.lineTo( col*20 + 0.5, 600 + 0.5);
      ctx.stroke(); 
    }

    ctx.fillStyle = '#FFF';
    ctx.fillRect(1,1,Resources.x*20-1, 3*20-1)
    ctx.fillRect(Resources.arriveZone().start.x * 20 + 1, 
                Resources.arriveZone().start.y * 20 + 1, 59,59)
  }

  function renderEnemyGrid(ctx) {
    var row;
    var col;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo( 0 + 0.5, 0*20 + 0.5);
    ctx.lineTo( 600 + 0.5, 0*20 + 0.5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo( 0*20 + 0.5, 0 + 0.5);
    ctx.lineTo( 0*20 + 0.5, 600 + 0.5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo( 0 + 0.5, Resources.y*20 + 0.5);
    ctx.lineTo( 600 + 0.5, Resources.y*20 + 0.5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo( Resources.x*20 + 0.5, 0 + 0.5);
    ctx.lineTo( Resources.x*20 + 0.5, 600 + 0.5);
    ctx.stroke();
  }

  function renderCreeps() {
    allCreeps.forEach(function(creep) {
      creep.render();
    });
    enemyCreeps.forEach(function(creep) {
      creep.render()
    })
  }

  function renderTowers() {
    allTowers.forEach(function(tower) {
      tower.render();
    })
    enemyTowers.forEach(function(tower) {
      tower.render();
    })
  }

  function renderProjectiles() {
    allProjectiles.forEach(function(projectile) {
      projectile.render();
    })
    enemyProjectiles.forEach(function(projectile) {
      projectile.render();
    })
  }

  init();

  /**
   * Event handlers for the Top Canvas 
   */  
  canvasTop.addEventListener('mousemove', Handlers.drawPad)

  canvasTop.addEventListener('mouseleave', Handlers.disablePad)

  canvasTop.addEventListener('mousedown', Handlers.placeTower)

}(this))