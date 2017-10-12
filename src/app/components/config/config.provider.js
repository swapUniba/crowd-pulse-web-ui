(function() {
  'use strict';

  angular
    .module('webUi')
    .provider('config', configProvider);

  /** @njInject */
  function configProvider() {
    var configPath;
    var listeners = [];
    var config;

    this.useConfigPath = function(value) {
      configPath = value;
    };

    this.addConfigResolvedListener = function(fn) {
      listeners.push(fn);
    };

    this.$get = function configFactory($http, $log, $q) {
      if (!config) {
        config = $q.defer();
        $http.get(configPath).then(function(data) {
          // the old promise is extended with the new data
          var rawConfig = data.data;
          // run every attached listener
          listeners.forEach(function(listener) {
            listener(rawConfig);
          });
          $log.debug('Configuration downloaded and stored.');
          config.resolve(rawConfig);
        });
      }
      // return the temporary promise

      return config.promise;
    };

    return this;
  }

})();
