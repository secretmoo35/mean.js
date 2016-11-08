// Secrets service used to communicate Secrets REST endpoints
(function () {
  'use strict';

  angular
    .module('secrets')
    .factory('SecretsService', SecretsService);

  SecretsService.$inject = ['$resource'];

  function SecretsService($resource) {
    return $resource('api/secrets/:secretId', {
      secretId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
