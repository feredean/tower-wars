var Announcement = {
  say: function(message) {
    document.getElementById('overlay').classList.remove('none')
    document.getElementById('announcement').innerHTML = message;
  }
}