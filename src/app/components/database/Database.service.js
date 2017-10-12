(function() {
  'use strict';

  angular
    .module('webUi')
    .factory('Database', Database);

  /** @ngInject */
  function Database(Restangular) {
    return Restangular.service('databases');
  }

})();
