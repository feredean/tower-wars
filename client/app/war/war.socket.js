var socket = io.connect();
var r = Resources;

socket.on('enemySent', function(data) {
  var creep = new Creep(data.x, data.y, {board: 'player'})
  allCreeps.push(creep);
})

socket.on('enemyBuilt', function(data) {
  // anti centering.. 
  var tower = new Tower(data.x-20, data.y-20, {range: r.range,
                                         board: 'enemy',
                                         blocks: data.nodes});

  data.nodes.forEach(function(block) {
    Resources.enemyBlocks.push(block);
  })
  
  enemyTowers.push(tower);
  enemyCreeps.forEach(function(creep) {
    creep.setPath();
  })
})