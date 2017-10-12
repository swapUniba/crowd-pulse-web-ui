(function() {
  'use strict';

  angular
    .module('webUi')
    .controller('AdminProjectNewController', AdminProjectNewController);

  /** @ngInject */
  function AdminProjectNewController() {
    var vm = this;

    var newTemplate = {
      process: {
        name: "My new shiny project"
      }
    };
    newTemplate = JSON.stringify(newTemplate, null, '  ');

    vm.project = {
      config: newTemplate
    };
  }
})();
