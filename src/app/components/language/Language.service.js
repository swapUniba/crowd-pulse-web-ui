(function() {
  'use strict';

  angular
    .module('webUi')
    .factory('Language', Language);

  /** @ngInject */
  function Language(Restangular) {
    return Restangular.service('languages');
  }

})();
