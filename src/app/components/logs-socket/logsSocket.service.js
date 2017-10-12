(function() {
  'use strict';

  angular.module('webUi')
    .factory('logsSocket', logsSocketFactory);

  /** @ngInject */
  function logsSocketFactory(io, socketFactory, config) {
    var logsIoSocket = io.connect(config.$$state.value.socket + 'logs');
    return socketFactory({
      ioSocket: logsIoSocket
    });
  }

})();
