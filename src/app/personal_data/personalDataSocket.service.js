(function() {
    'use strict';

    angular.module('webUi')
        .factory('personalDataSocket', personalDataSocketFactory);

    /** @ngInject */
    function personalDataSocketFactory(io, socketFactory, config) {
        var personalDataIoSocket = io.connect(config.$$state.value.socket);
        return socketFactory({
            ioSocket: personalDataIoSocket
        });
    }

})();
