(function () {
  'use strict';

  angular
    .module('secrets')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Secrets',
      state: 'secrets',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'secrets', {
      title: 'List Secrets',
      state: 'secrets.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'secrets', {
      title: 'Create Secret',
      state: 'secrets.create',
      roles: ['user']
    });
  }
}());
//menuService