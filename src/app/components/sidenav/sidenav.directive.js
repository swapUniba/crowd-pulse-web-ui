(function() {
  'use strict';

  angular
    .module('webUi')
    .directive('sidenav', sidenav);

  /** @ngInject */
  function sidenav() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/sidenav/sidenav.html',
      transclude: true,
      controller: SidenavController,
      controllerAs: 'sidenavVm',
      bindToController: true,
      replace: true
    };

    return directive;

    /** @ngInject */
    function SidenavController($mdMedia) {
      var sidenavVm = this;

      sidenavVm.evalMdMedia = function(sizing) {
        return $mdMedia(sizing);
      };
    }
  }

})();
