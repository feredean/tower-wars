(function() {
  var r = Resources;
  // creeps
  var sendOne = document.getElementById('send-one');
  var sendTwo = document.getElementById('send-two');
  var sendThree = document.getElementById('send-three');
  var sendGod = document.getElementById('send-god');
  // towers
  var selectNormalTower = document.getElementById('normal-tower');
  var selectSpeedTower = document.getElementById('speed-tower');
  var selectBladeTower = document.getElementById('blade-tower');
  // var clearTowers = document.getElementById('clear-towers');

  sendOne.addEventListener('mousedown', function() {
    sendCreep(r.creeps.one);
  })

  sendTwo.addEventListener('mousedown', function() {
    sendCreep(r.creeps.two);
  })

  sendThree.addEventListener('mousedown', function() {
    sendCreep(r.creeps.three);
  })

  sendGod.addEventListener('mousedown', function() {
    sendCreep(r.creeps.god);
  })

  selectNormalTower.addEventListener('mousedown', function() {
    selectMenu(selectNormalTower, 'normal');
  })

  selectSpeedTower.addEventListener('mousedown', function() {
    selectMenu(selectSpeedTower, 'speed');
  })

  selectBladeTower.addEventListener('mousedown', function() {
    selectMenu(selectBladeTower, 'blade');
  })
  
  // clearTowers.addEventListener('mousedown', function() {
  //   allTowers = [];
  //   r.blocks = [];
  // })

  // utility
  function clearSelect() {
    selectNormalTower.classList.remove('select');
    selectSpeedTower.classList.remove('select');
    selectBladeTower.classList.remove('select');
  }

  // actions
  function sendCreep(type) {
    var x = Math.floor(Math.random() * 17);
    var y = Math.floor(Math.random() * 3);
    type.board = 'enemy';
    var creep = new Creep(x, y, type)
    enemyCreeps.push(creep);
    socket.emit('sent', creep);
  }

  function selectMenu(node, name) {
    clearSelect();
    r.towerType = r.towerType === name ? undefined : name;
    if (r.towerType === name) {
      node.classList.add('select');
    } else {
      node.classList.remove('select')
    }
  }


}(this))