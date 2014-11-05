(function() {

  var addCreep = document.getElementById('add-creep');

  addCreep.addEventListener('mousedown', function() {
    var randomX = Math.floor(Math.random() * 17);
    var randomY = Math.floor(Math.random() * 3);
    allCreeps.push(new Creep(randomX, randomY, {color:'#00F'}));
  })

}(this))