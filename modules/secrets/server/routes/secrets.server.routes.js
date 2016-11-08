'use strict';

/**
 * Module dependencies
 */
var secretsPolicy = require('../policies/secrets.server.policy'),
  secrets = require('../controllers/secrets.server.controller');

module.exports = function(app) {
  // Secrets Routes
  app.route('/api/secrets').all(secretsPolicy.isAllowed)
    .get(secrets.list)
    .post(secrets.create);

  app.route('/api/secrets/:secretId').all(secretsPolicy.isAllowed)
    .get(secrets.read)
    .put(secrets.update)
    .delete(secrets.delete);

  // Finish by binding the Secret middleware
  app.param('secretId', secrets.secretByID);
};
