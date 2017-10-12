(function() {
  'use strict';

  angular
    .module('webUi')
    .controller('AdminProjectEditController', AdminProjectEditController);

  /** @ngInject */
  function AdminProjectEditController($stateParams, $mdDialog, $mdToast, Project) {
    var vm = this;

    Project.one($stateParams.projectId).get()
      .then(function(model) {
        vm.project = model;
      });

    vm.start = function(event) {
      var confirm = $mdDialog.confirm()
        .title('Start new run')
        .content('Do you really want to start a new run for the project ' + vm.project.name + '?')
        .ariaLabel('Start new run')
        .targetEvent(event)
        .ok('Yes, start it')
        .cancel('Don\'t start it');
      return $mdDialog.show(confirm)
        .then(function() {
          return _start();
        })
        .then(function() {
          showToast('Run started.');
        });
    };

    var _start = function() {
      // create a new run, then refresh the project
      return vm.project.customPOST({}, 'runs')
        .then(function() {
          return vm.project.customGET();
        })
        .then(function(updatedProject) {
          vm.project = updatedProject;
          Project.cache.updateWithProject(updatedProject);
        });
    };

    var showToast = function(message) {
      var toast = $mdToast.simple()
        .content(message)
        .position('bottom right');
      return $mdToast.show(toast);
    };

  }
})();
