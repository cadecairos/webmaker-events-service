module.exports = function (env, app, models, userClient) {

  var events = require('./event-controller')(models, userClient);
  var dev = require('./dev-controller')(models);
  var attendee = require('./attendee-controller.js')(models, userClient);
  var confirmation = require('./confirmation.js')(models, userClient);
  var auth = require('./auth')(env);
  var cors = require('./cors')(env);

  // Healthcheck
  app.get('/', function (req, res) {
    res.send('Webmaker Events Service is up and running');
  });
  app.get('/healthcheck', dev.healthcheck(env));

  app.get('/events', cors.withAuth, events.get.all);
  app.get('/events/:id', cors.withAuth, events.get.id);

  // Protected routes
  app.post('/events', cors.withAuth, auth.verifyUser, events.post);
  app.put('/events/:id', cors.withAuth, auth.verifyUser, events.put);
  app.delete('/events/:id', cors.withAuth, auth.verifyUser, events.delete);

  // Mentor confirmation
  app.post('/confirm/mentor/:token', cors.withAuth, auth.verifyUser, confirmation.update);

  // RSVP
  app.get('/attendee/event/:id', cors.withAuth, attendee.get.event);
  app.get('/attendee/user/:id', cors.withAuth, auth.verifyUser, attendee.get.user);
  app.post('/attendee', cors.withAuth, auth.verifyUser, attendee.post);

  // Login
  app.options('*', cors.withAuth);

  // CAUTION: Use with 'dev' db only
  app.get('/dev/fake', cors.readOnly, auth.dev, dev.fake);

};
