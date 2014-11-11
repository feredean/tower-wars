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
  
  spawnZone : function() {
    return {
      start: {
        x: 0,
        y: 0
      },
      end: {
        x: this.x,
        y: 3
      }
    };
  },

  arriveZone : function() {
    return {
      start: {
        x: Math.floor(this.x/2) - 1,
        y: this.y - 3
      },
      end: {
        x: Math.floor(this.x/2) + 1,
        y: this.y - 1
      }
    }
  },

  destination : {
    x: 8,
    y: 29
  },

  mousePos : {
    x : 0,
    y : 0 
  },
  
  path : [],

  // Towers
  blocks : [],
  enemyBlocks : [],
  pad : { 
    started : false,
    blockedTower :false, 
    blockedCreep: false
  },
  range : 140


}