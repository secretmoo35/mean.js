'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Secret Schema
 */
var SecretSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Secret name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Secret', SecretSchema);
