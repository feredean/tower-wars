/**
 * Not sure if this is what resources is supposed to do
 * but i find it handy.
 */

var Resources = {
  y : 30,
  x : 17,

  speed: 2,

  width : function() {
    return this.x * 20 + 1;
  },
  height : function() {
    return this.y * 20 + 1;
  },

  blocks : [],
  placeable : true,
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

  ctx : {}
}