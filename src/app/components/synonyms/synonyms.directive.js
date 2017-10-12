(function() {
  'use strict';

  angular.module('webUi')
    .directive('synonyms', synonyms);

  /** @ngInject */
  function synonyms() {
    return {
      restrict: 'E',
      templateUrl: 'app/components/synonyms/synonyms.html',
      controller: SynonymsController,
      controllerAs: 'synonymsVm',
      bindToController: true,
      replace: true,
      scope: {
        synonymGroups: '='
      }
    };
  }

  /** @ngInject */
  function SynonymsController() {
    this.hasElements = function(group) {
      return angular.isArray(group.details);
    };
  }

})();
