(function() {
  'use strict';

  angular
    .module('webUi')
    .factory('Corpus', Corpus);

  /** @ngInject */
  function Corpus(Index) {
    return Index.service('indices');
  }

})();
