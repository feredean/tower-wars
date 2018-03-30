module.exports = function(app) {
  app.route('/war')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/war.html');
    });
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
