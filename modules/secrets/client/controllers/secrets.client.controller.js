(function () {
  'use strict';

  // Secrets controller
  angular
    .module('secrets')
    .controller('SecretsController', SecretsController);

  SecretsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'secretResolve'];

  function SecretsController ($scope, $state, $window, Authentication, secret) {
    var vm = this;

    vm.authentication = Authentication;
    vm.secret = secret;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Secret
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.secret.$remove($state.go('secrets.list'));
      }
    }

    // Save Secret
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.secretForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.secret._id) {
        vm.secret.$update(successCallback, errorCallback);
      } else {
        vm.secret.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('secrets.view', {
          secretId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
