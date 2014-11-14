var socket = io.connect();

socket.on('enemySent', function(data) {
  var r = Resources;
  r.increaseIncome(data.income, 'enemy');
  data.board = 'player';
  // transform x, y from px to grid location
  var creep = new Creep((data.x-9)/20, (data.y-9)/20, data)
  allCreeps.push(creep);
})

socket.on('enemyBuilt', function(data) {
  data.board = 'enemy';
  // anti centering..
  var tower = new Tower(data.x-20, data.y-20, data);
  console.log('1: ', Resources.blocks);
  // console.log(Resources.enemyBlocks);
  data.nodes.forEach(function(block) {
    Resources.enemyBlocks.push(block);
  })
  console.log('2: ', Resources.blocks);
  
  enemyTowers.push(tower);
  enemyCreeps.forEach(function(creep) {
    creep.setPath();
  })
  console.log('3: ', Resources.blocks);

})