(function() {
  'use strict';

  angular
    .module('webUi')
    .factory('Term', Term);

  /** @ngInject */
  function Term(Restangular) {
    return Restangular.service('terms');
  }

})();
