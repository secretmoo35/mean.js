'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // menu 
    var btn = document.querySelector('.nav__button'), 
    container = document.querySelector('.container');

    btn.addEventListener('click', function () {
      this.classList.toggle('open');
      container.classList.toggle('active');
    });

    // This provides Authentication context.
    $scope.authentication = Authentication;


  }
]);
