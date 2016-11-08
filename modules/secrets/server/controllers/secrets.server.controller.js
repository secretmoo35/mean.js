'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Secret = mongoose.model('Secret'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Secret
 */
exports.create = function(req, res) {
  var secret = new Secret(req.body);
  secret.user = req.user;

  secret.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(secret);
    }
  });
};

/**
 * Show the current Secret
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var secret = req.secret ? req.secret.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  secret.isCurrentUserOwner = req.user && secret.user && secret.user._id.toString() === req.user._id.toString();

  res.jsonp(secret);
};

/**
 * Update a Secret
 */
exports.update = function(req, res) {
  var secret = req.secret;

  secret = _.extend(secret, req.body);

  secret.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(secret);
    }
  });
};

/**
 * Delete an Secret
 */
exports.delete = function(req, res) {
  var secret = req.secret;

  secret.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(secret);
    }
  });
};

/**
 * List of Secrets
 */
exports.list = function(req, res) {
  Secret.find().sort('-created').populate('user', 'displayName').exec(function(err, secrets) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(secrets);
    }
  });
};

/**
 * Secret middleware
 */
exports.secretByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Secret is invalid'
    });
  }

  Secret.findById(id).populate('user', 'displayName').exec(function (err, secret) {
    if (err) {
      return next(err);
    } else if (!secret) {
      return res.status(404).send({
        message: 'No Secret with that identifier has been found'
      });
    }
    req.secret = secret;
    next();
  });
};
