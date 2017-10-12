(function() {
  'use strict';

  angular
    .module('webUi')
    .directive('toolbar', toolbar);

  /** @ngInject */
  function toolbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/toolbar/toolbar.html',
      scope: {
        title: '='
      },
      controller: ToolbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;


    /** @ngInject */
    function ToolbarController($mdSidenav, $state, $auth, $location, $mdToast) {
      var vm = this;

      vm.isAuthenticated = function() {
         return $auth.isAuthenticated();
      };

      vm.logout = function(){
         $auth.logout()
         .then(function() {
            showToast.info('You have been logged out');
            $location.path('/login');
        });
      };

      vm.toggleMainSidenav = function() {
        return $mdSidenav('main-sidenav').toggle();
      };

      vm.getActiveClass = function(state) {
        if ($state.current.name.indexOf(state) >= 0) {
          return 'md-accent md-hue-1';
        }
      };

    var showToast = function(message) {
      var toast = $mdToast.simple()
        .content(message)
        .position('bottom right');
      return $mdToast.show(toast);
    };
    }
  }

})();
