(function() {
  'use strict';

  angular
    .module('webUi')
    .factory('Account', Account);

  /** @ngInject */
  function Account($http) {
      return {
            getProfile: function() {

                return $http.get('/api/me');

            },
            updateProfile: function(profileData) {
                  return $http.put('/api/me', profileData);
            }
      };
  }

})();
