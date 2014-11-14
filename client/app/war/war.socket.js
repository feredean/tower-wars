var socket = io.connect();
var r = Resources;

socket.on('enemySent', function(data) {
  data.board = 'player';
  // transform x, y from px to grid location
  var creep = new Creep((data.x-9)/20, (data.y-9)/20, data)
  console.log('Received creep: ', data);
  allCreeps.push(creep);
})

socket.on('enemyBuilt', function(data) {
  data.board = 'enemy';
  // anti centering.. 
  var tower = new Tower(data.x-20, data.y-20, data);

  data.nodes.forEach(function(block) {
    Resources.enemyBlocks.push(block);
  })
  
  enemyTowers.push(tower);
  enemyCreeps.forEach(function(creep) {
    creep.setPath();
  })
})