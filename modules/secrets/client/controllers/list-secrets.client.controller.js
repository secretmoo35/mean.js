(function () {
  'use strict';

  angular
    .module('secrets')
    .controller('SecretsListController', SecretsListController);

  SecretsListController.$inject = ['SecretsService'];

  function SecretsListController(SecretsService) {
    var vm = this;

    vm.secrets = SecretsService.query();
  }
}());
