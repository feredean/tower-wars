(function() {

  var addCreep = document.getElementById('add-creep');
  var clearTowers = document.getElementById('clear-towers');

  addCreep.addEventListener('mousedown', function() {
    sendCreep();
  })
  
  clearTowers.addEventListener('mousedown', function() {
    allTowers = [];
    Resources.blocks = [];
  })

  function sendCreep() {
    var x = Math.floor(Math.random() * 17);
    var y = Math.floor(Math.random() * 3);
    var creep = new Creep(x, y, {board: 'enemy'})
    enemyCreeps.push(creep);
    socket.emit('sent', {x: x, y: y});
  }

}(this))