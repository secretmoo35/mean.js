'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // menu 
    $scope.loadMenu = function () {
      // var el = '.js-menu';
      // var myMenu = cssCircleMenu(el);

    }
    // This provides Authentication context.
    $scope.authentication = Authentication;


  }
]);
