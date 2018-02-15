exports.register = function(socket) {

  socket.on('sent', function(data) {
    socket.broadcast.emit('enemySent', data);
  })

  socket.on('built', function(data) {
    socket.broadcast.emit('enemyBuilt', data);
  })
}
