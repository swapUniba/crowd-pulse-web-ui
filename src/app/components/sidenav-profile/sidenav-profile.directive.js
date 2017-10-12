(function() {
  'use strict';

  angular
    .module('webUi')
    .directive('sidenavProfile', sidenavProfile);

  /** @ngInject */
  function sidenavProfile() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/sidenav-profile/sidenav-profile.html',
      scope: {
        dataViz: '=',
        params: '='
      },
      controller: SidenavProfileController,
      controllerAs: 'sidenavProfileVm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function SidenavProfileController($scope, $state, $mdToast, $mdSidenav, $auth, Account) {
      var sidenavProfileVm = this;

	    $scope.authenticate = function(provider) {
		$auth.authenticate(provider)
		.then(function(response) {
		    showToast('You have successfully signed in with ' + provider + '!');
		    Account.getProfile()
			.then(function(response) {
			  $scope.provider=provider;
			  $scope.user = response.data;
			})
			.catch(function(response) {
			  showToast(response.data.message);
			});
		})
		.catch(function(error) {
		   showToast(error.data.message);
		});
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
