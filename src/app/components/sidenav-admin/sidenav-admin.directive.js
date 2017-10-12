(function() {
  'use strict';

  angular
    .module('webUi')
    .directive('sidenavAdmin', sidenavAdmin);

  /** @ngInject */
  function sidenavAdmin() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/sidenav-admin/sidenav-admin.html',
      scope: {
        dataViz: '=',
        params: '='
      },
      controller: SidenavAdminController,
      controllerAs: 'sidenavAdminVm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function SidenavAdminController($scope, $state, $mdSidenav, Project) {
      var sidenavAdminVm = this;

      var updateProjects = function() {
        sidenavAdminVm.projects = Project.cache.projects;
      };

      Project.cache.addOnCacheChangeListener(updateProjects);

      Project.cache.getOrLoad();

      updateProjects();

      sidenavAdminVm.openProject = function(projectId) {
        $state.go('app.admin.project.edit', {projectId: projectId});
        $mdSidenav('main-sidenav').close();
      };

      sidenavAdminVm.goToNew = function() {
        $state.go('app.admin.project.new');
        $mdSidenav('main-sidenav').close();
      };

      $scope.$on('$destroy', function() {
        Project.cache.removeOnCacheChangeListener(updateProjects);
      });
    }
  }

})();
