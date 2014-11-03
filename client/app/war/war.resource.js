'use strict';

/**
 * Not sure if this is what resources is supposed to do
 * but i find it handy.
 */

var Resources = {
  // Grid
  ctx : {},

  y : 30,
  x : 17,
  
  width : function() {
    return this.x * 20 + 1;
  },
  height : function() {
    return this.y * 20 + 1;
  },
  
  // Creep
  // speed is 1 or 2 atm
  speed: 2,
  finder : new PF.BestFirstFinder({allowDiagonal:true, dontCrossCorners: true}),
  destination : {
    x: 7,
    y: 29
  },

  mousePos : {
    x : 0,
    y : 0 
  },
  
  path : [],

  // Towers
  blocks : [],
  pad : { 
    started : false,
    blockedTower :false, 
    blockedCreep: false
  },
  range : 50


}