(function() {
  'use strict';

  angular.module('webUi')
    .service('TerminalTrain', TerminalTrainFactory);

  /** @ngInject */
  function TerminalTrainFactory() {
    this.listeners = [];

    this.add = function(what) {
      this.listeners.forEach(function(fn) {
        fn(what);
      });
    };

    this.addWriteListener = function(fn) {
      this.listeners.push(fn);
    };

    this.removeWriteListener = function(fn) {
      this.listeners.splice(this.listeners.indexOf(fn, 1));
    };
  }

})();
