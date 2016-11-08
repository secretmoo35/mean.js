'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Secret = mongoose.model('Secret'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  secret;

/**
 * Secret routes tests
 */
describe('Secret CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Secret
    user.save(function () {
      secret = {
        name: 'Secret name'
      };

      done();
    });
  });

  it('should be able to save a Secret if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Secret
        agent.post('/api/secrets')
          .send(secret)
          .expect(200)
          .end(function (secretSaveErr, secretSaveRes) {
            // Handle Secret save error
            if (secretSaveErr) {
              return done(secretSaveErr);
            }

            // Get a list of Secrets
            agent.get('/api/secrets')
              .end(function (secretsGetErr, secretsGetRes) {
                // Handle Secrets save error
                if (secretsGetErr) {
                  return done(secretsGetErr);
                }

                // Get Secrets list
                var secrets = secretsGetRes.body;

                // Set assertions
                (secrets[0].user._id).should.equal(userId);
                (secrets[0].name).should.match('Secret name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Secret if not logged in', function (done) {
    agent.post('/api/secrets')
      .send(secret)
      .expect(403)
      .end(function (secretSaveErr, secretSaveRes) {
        // Call the assertion callback
        done(secretSaveErr);
      });
  });

  it('should not be able to save an Secret if no name is provided', function (done) {
    // Invalidate name field
    secret.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Secret
        agent.post('/api/secrets')
          .send(secret)
          .expect(400)
          .end(function (secretSaveErr, secretSaveRes) {
            // Set message assertion
            (secretSaveRes.body.message).should.match('Please fill Secret name');

            // Handle Secret save error
            done(secretSaveErr);
          });
      });
  });

  it('should be able to update an Secret if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Secret
        agent.post('/api/secrets')
          .send(secret)
          .expect(200)
          .end(function (secretSaveErr, secretSaveRes) {
            // Handle Secret save error
            if (secretSaveErr) {
              return done(secretSaveErr);
            }

            // Update Secret name
            secret.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Secret
            agent.put('/api/secrets/' + secretSaveRes.body._id)
              .send(secret)
              .expect(200)
              .end(function (secretUpdateErr, secretUpdateRes) {
                // Handle Secret update error
                if (secretUpdateErr) {
                  return done(secretUpdateErr);
                }

                // Set assertions
                (secretUpdateRes.body._id).should.equal(secretSaveRes.body._id);
                (secretUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Secrets if not signed in', function (done) {
    // Create new Secret model instance
    var secretObj = new Secret(secret);

    // Save the secret
    secretObj.save(function () {
      // Request Secrets
      request(app).get('/api/secrets')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Secret if not signed in', function (done) {
    // Create new Secret model instance
    var secretObj = new Secret(secret);

    // Save the Secret
    secretObj.save(function () {
      request(app).get('/api/secrets/' + secretObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', secret.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Secret with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/secrets/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Secret is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Secret which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Secret
    request(app).get('/api/secrets/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Secret with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Secret if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Secret
        agent.post('/api/secrets')
          .send(secret)
          .expect(200)
          .end(function (secretSaveErr, secretSaveRes) {
            // Handle Secret save error
            if (secretSaveErr) {
              return done(secretSaveErr);
            }

            // Delete an existing Secret
            agent.delete('/api/secrets/' + secretSaveRes.body._id)
              .send(secret)
              .expect(200)
              .end(function (secretDeleteErr, secretDeleteRes) {
                // Handle secret error error
                if (secretDeleteErr) {
                  return done(secretDeleteErr);
                }

                // Set assertions
                (secretDeleteRes.body._id).should.equal(secretSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Secret if not signed in', function (done) {
    // Set Secret user
    secret.user = user;

    // Create new Secret model instance
    var secretObj = new Secret(secret);

    // Save the Secret
    secretObj.save(function () {
      // Try deleting Secret
      request(app).delete('/api/secrets/' + secretObj._id)
        .expect(403)
        .end(function (secretDeleteErr, secretDeleteRes) {
          // Set message assertion
          (secretDeleteRes.body.message).should.match('User is not authorized');

          // Handle Secret error error
          done(secretDeleteErr);
        });

    });
  });

  it('should be able to get a single Secret that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Secret
          agent.post('/api/secrets')
            .send(secret)
            .expect(200)
            .end(function (secretSaveErr, secretSaveRes) {
              // Handle Secret save error
              if (secretSaveErr) {
                return done(secretSaveErr);
              }

              // Set assertions on new Secret
              (secretSaveRes.body.name).should.equal(secret.name);
              should.exist(secretSaveRes.body.user);
              should.equal(secretSaveRes.body.user._id, orphanId);

              // force the Secret to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Secret
                    agent.get('/api/secrets/' + secretSaveRes.body._id)
                      .expect(200)
                      .end(function (secretInfoErr, secretInfoRes) {
                        // Handle Secret error
                        if (secretInfoErr) {
                          return done(secretInfoErr);
                        }

                        // Set assertions
                        (secretInfoRes.body._id).should.equal(secretSaveRes.body._id);
                        (secretInfoRes.body.name).should.equal(secret.name);
                        should.equal(secretInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Secret.remove().exec(done);
    });
  });
});
