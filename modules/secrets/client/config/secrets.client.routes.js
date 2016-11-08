(function () {
  'use strict';

  angular
    .module('secrets')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('secrets', {
        abstract: true,
        url: '/secrets',
        template: '<ui-view/>'
      })
      .state('secrets.list', {
        url: '',
        templateUrl: 'modules/secrets/views/list-secrets.client.view.html',
        controller: 'SecretsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Secrets List'
        }
      })
      .state('secrets.create', {
        url: '/create',
        templateUrl: 'modules/secrets/views/form-secret.client.view.html',
        controller: 'SecretsController',
        controllerAs: 'vm',
        resolve: {
          secretResolve: newSecret
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Secrets Create'
        }
      })
      .state('secrets.edit', {
        url: '/:secretId/edit',
        templateUrl: 'modules/secrets/views/form-secret.client.view.html',
        controller: 'SecretsController',
        controllerAs: 'vm',
        resolve: {
          secretResolve: getSecret
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Secret {{ secretResolve.name }}'
        }
      })
      .state('secrets.view', {
        url: '/:secretId',
        templateUrl: 'modules/secrets/views/view-secret.client.view.html',
        controller: 'SecretsController',
        controllerAs: 'vm',
        resolve: {
          secretResolve: getSecret
        },
        data: {
          pageTitle: 'Secret {{ secretResolve.name }}'
        }
      });
  }

  getSecret.$inject = ['$stateParams', 'SecretsService'];

  function getSecret($stateParams, SecretsService) {
    return SecretsService.get({
      secretId: $stateParams.secretId
    }).$promise;
  }

  newSecret.$inject = ['SecretsService'];

  function newSecret(SecretsService) {
    return new SecretsService();
  }
}());
