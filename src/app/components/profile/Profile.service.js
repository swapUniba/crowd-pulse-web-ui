(function() {
  'use strict';

  angular
    .module('webUi')
    .factory('Profile', Profile);

  /** @ngInject */
  function Profile(Restangular) {
    return Restangular.service('profiles');
  }

})();
