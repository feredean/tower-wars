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
  */
  var canvasBackground = doc.createElement('canvas');
  var mainCtx = canvasBackground.getContext('2d');
  canvasBackground.width = Resources.width();
  canvasBackground.height = Resources.height();
  doc.getElementById('canvas-main').appendChild(canvasBackground);
  /**
   * Top Canvas
   * - buildings placement engine
   */
  var canvasTop = doc.createElement('canvas');
  var topCtx = canvasTop.getContext('2d');
  canvasTop.width = Resources.width();
  canvasTop.height = Resources.height();
  doc.getElementById('canvas-top').appendChild(canvasTop);

  /**
   * Animation Canvas
   * - enemy animation
   * - tower animations
   */
  var canvasAnim = doc.createElement('canvas');
  var animCtx = canvasAnim.getContext('2d');
  canvasAnim.width = Resources.width();
  canvasAnim.height = Resources.height();
  doc.getElementById('canvas-anim').appendChild(canvasAnim);

  Resources.ctx.main = mainCtx;
  Resources.ctx.top = topCtx;
  Resources.ctx.anim = animCtx;

  function main() {
    renderGrid();
    animate();
  }

  function animate() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
    lastTime = now;
    update(dt)
    renderCreeps();
    win.requestAnimationFrame(animate);
    // setInterval(function() {
    //   update(dt);
    //   renderCreeps();
    // }, 33)

  }

  function init() {
    lastTime = Date.now();
    main();
  }

  function update(dt) {
    updateCreeps(dt);
  }


  /**
   * Draws and updates the position of the creeps on the 
   * Animation Canvas 
   */  
  function updateCreeps(dt) {
    animCtx.clearRect(0, 0, Resources.width(), Resources.height())
    allCreeps.forEach(function(creep) {
      creep.update(dt);
    });
  }


  /**
   * Creates a grid
   */
  function renderGrid() {
    var row;
    var col;

    mainCtx.strokeStyle = '#DDD';
    mainCtx.lineWidth = 1;

    for (row = 0; row <= Resources.y; ++row) {
      mainCtx.beginPath();
      // mainCtx.fillText(row, 0 + 0.5, row*20 - 6 + 0.5);
      mainCtx.moveTo( 0 + 0.5, row*20 + 0.5);
      mainCtx.lineTo( 600 + 0.5, row*20 + 0.5);
      mainCtx.stroke();
    }

    for (col = 0; col <= Resources.x; ++col) {
      mainCtx.beginPath();
      mainCtx.moveTo( col*20 + 0.5, 0 + 0.5);
      mainCtx.lineTo( col*20 + 0.5, 600 + 0.5);
      mainCtx.stroke(); 
    }

  }

  function renderCreeps() {
    allCreeps.forEach(function(creep) {
      creep.render();
    });
  }


  init();

  /**
   * Event handlers for the Top Canvas 
   */  
  canvasTop.addEventListener('mousemove', Handlers.drawPad)

  canvasTop.addEventListener('mouseleave', Handlers.disablePad)

  canvasTop.addEventListener('mousedown', Handlers.placeTower)

}(this))