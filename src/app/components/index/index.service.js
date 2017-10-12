(function() {
  'use strict';

  angular
    .module('webUi')
    .factory('Index', Index);

  /** @ngInject */
  function Index(Restangular, config) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl(config.index);
    });
  }

})();
