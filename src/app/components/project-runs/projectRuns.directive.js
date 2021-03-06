(function() {
  'use strict';

  angular
    .module('webUi')
    .directive('projectRuns', projectRuns);

  /** @ngInject */
  function projectRuns() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/project-runs/project-runs.html',
      controller: ProjectRunsController,
      controllerAs: 'projectRunsVm',
      bindToController: true,
      replace: true,
      scope: {
        config: '='
      }
    };

    return directive;

    /** @ngInject */
    function ProjectRunsController($scope, $mdToast, $mdDialog, $filter, $document, Project, logsSocket) {
      var projectRunsVm = this;

      var showToast = function(message) {
        var toast = $mdToast.simple()
          .content(message)
          .position('bottom right');
        return $mdToast.show(toast);
      };

      $scope.$watchCollection('projectRunsVm.config.runs', function(newValue) {
        var runs = newValue || [];
        projectRunsVm.stopped = runs.filter(function(run) {
          return angular.isDefined(run.dateEnd);
        });

        projectRunsVm.running = runs.filter(function(run) {
          return angular.isUndefined(run.dateEnd);
        });
      }, true);

      projectRunsVm.showRunning = function() {
        return projectRunsVm.running.length > 0;
      };

      projectRunsVm.showStopped = function() {
        return projectRunsVm.stopped.length > 0;
      };

      projectRunsVm.showDivider = function() {
        return (projectRunsVm.showRunning() && projectRunsVm.showStopped());
      };

      projectRunsVm.stop = function(run, event) {
        event.stopPropagation();
        var formattedDate = $filter('date')(run.dateStart, 'short');
        var confirm = $mdDialog.confirm()
          .title('Stop run')
          .content('Do you really want to stop the run started at' + formattedDate + '?')
          .ariaLabel('Stop run')
          .targetEvent(event)
          .ok('Yes, stop it')
          .cancel('Don\'t stop it');
        return $mdDialog.show(confirm)
          .then(function() {
            return _stop(run);
          })
          .then(function() {
            showToast('Run stopped.');
          });
      };

      var _stop = function(run) {
        return projectRunsVm.config.one('runs', run._id).remove()
          .then(function() {
            return projectRunsVm.config.customGET();
          })
          .then(function(updatedProject) {
            projectRunsVm.config = updatedProject;
            Project.cache.updateWithProject(updatedProject);
          });
      };

      projectRunsVm.showLog = function(run, event) {
        return $mdDialog.show({
          controller: 'LogDialogCtrl',
          templateUrl: 'app/components/log-dialog/log-dialog.html',
          parent: angular.element($document.body),
          targetEvent: event,
          clickOutsideToClose: true,
          locals: {
            run: run
          }
        }).finally(function() {
          logsSocket.emit('closeLog', run._id);
        });
      };
    }
  }

})();
