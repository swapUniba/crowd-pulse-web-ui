(function() {
  'use strict';

  angular
    .module('webUi')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($stateParams, $location, $mdDialog, $mdToast, $auth, $scope, Account) {
    var vm = this;


    $scope.login = function() {
      $auth.login($scope.user)
        .then(function() {
          showToast('You have successfully signed in!');
          $location.path('/');
        })
        .catch(function(error) {
          showToast(error.data.message, error.status);
        });
    };

    $scope.signup = function() {
      $auth.signup($scope.user)
        .then(function(response) {
          $auth.setToken(response);
          $location.path('/');
          showToast('You have successfully created a new account and have been signed-in');
        })
        .catch(function(response) {
          showToast(response.data.message);
        });
    };

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
           showToast(error);
        });
    };


    $scope.isAuthenticated = function() {
         return $auth.isAuthenticated();
    };


    $scope.getProfile = function() {
      Account.getProfile()
        .then(function(response) {
          $scope.user = response.data;
        })
        .catch(function(response) {
          showToast(response.data.message);
        });
    };

    var showToast = function(message) {
      var toast = $mdToast.simple()
        .content(message)
        .position('bottom right');
      return $mdToast.show(toast);
    };

    $scope.logout = function(){
      $auth.logout()
      .then(function() {
        showToast.info('You have been logged out');
        $location.path('/');
      });
    };
    $scope.getProfile();

  }
})();
