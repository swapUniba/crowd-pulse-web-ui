(function() {
  'use strict';

  angular.module('webUi')
    .controller('LogDialogCtrl', LogDialogCtrl);

  /** @ngInject */
  function LogDialogCtrl($scope, $stateParams, config, logsSocket, run, TerminalTrain) {
    $scope.terminal = TerminalTrain;

    $scope.getFullLogUrl = function() {
      return config.$$state.value.api + 'projects/' + $stateParams.projectId + '/runs/' + run._id + '/log';
    };

    // forward all events to this scope
    logsSocket.forward(['logs:clear','logs:cat', 'logs:tail'], $scope);

    logsSocket.emit('openLog', run._id);

    $scope.$on('socket:logs:tail', function (ev, data) {
      $scope.terminal.add(data);
    });
  }

})();
