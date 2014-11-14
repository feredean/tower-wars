'use strict';

/**
 * Not sure if this is what resources is supposed to do
 * but i find it handy.
 */

var Resources = {
  // Grid
  ctx: {},

  y: 30,
  x: 17,
  
  width: function() {
    return this.x * 20 + 1;
  },
  height: function() {
    return this.y * 20 + 1;
  },
  
  // Creep
  // speed is 1 or 2 atm
  speed: 2,
  finder: new PF.BestFirstFinder({allowDiagonal:true, dontCrossCorners: true}),
  spawnZone: function() {
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
  arriveZone: function() {
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
  destination: {
    x: 8,
    y: 29
  },
  mousePos: {
    x: 0,
    y: 0 
  },
  path: [],

  creeps: {
    one: {
      health: 10,
      color: 'blue',
      speed: 1,
      cost: 5,
      income: 1
    },
    two: {
      health: 30,
      color: 'green',
      speed: 2,
      cost: 5,
      income: 1
    },
    three: {
      health: 300,
      color: 'red',
      speed: 2,
      cost: 5,
      income: 1
    },
    god: {
      health: 1000000,
      color: 'black',
      speed: 1,
      cost: 5,
      income: 1
    },
  },

  // Towers
  blocks: [],
  towerType: undefined,
  enemyBlocks: [],
  pad: { 
    started: false,
    blockedTower:false, 
    blockedCreep: false
  },
  tower: {
    normal: {
      type: 'normal',
      range: 200,
      speed: 1000,
      cost: 20,
      invert: true,
      projectile: {
        size: 3,
        color: '#333',
        dmg: 10
      } 
    },
    speed: {
      type: 'speed',
      range: 100,
      speed: 50,
      cost: 20,
      invert: false,
      projectile: {
        size: 2,
        color: '#FFF',
        dmg: 3
      } 
    },
    blade: {
      type: 'blade',
      range: 40,
      speed: 10,
      cost: 100,
      invert: false,
      dmg: 5
    }
  }
}