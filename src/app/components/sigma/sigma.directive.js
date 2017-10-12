(function() {
  'use strict';

  angular
    .module('webUi')
    .directive('sigma', sigmaDirective);

  /** @ngInject */
  function sigmaDirective($timeout, Sigma) {
    var directive = {
      restrict: 'E',
      scope: {
        graph: '='
      },
      link: linkFn
    };

    return directive;

    function linkFn(scope, elem) {
      // Let's first initialize sigma:
      var sigmaGraph = new Sigma({
        container: elem[0],
        settings: {
          defaultNodeColor: '#1A237E',
          defaultEdgeColor: '#5C6BC0',
          edgeColor: 'default',
          labelThreshold: 8
        }
      });

      scope.$watch('graph', function() {
        sigmaGraph.graph.clear();
        if (!scope.graph) {
          return;
        }
        if (scope.graph && scope.graph.hasOwnProperty('nodes') && scope.graph.hasOwnProperty('edges')) {
          sigmaGraph.graph.read(scope.graph);
        }
        sigmaGraph.killForceAtlas2();
        sigmaGraph.refresh();
        if (scope.graph.nodes.length > 0) {
          sigmaGraph.startForceAtlas2({worker: true, barnesHutOptimize: true});
          $timeout(function() {
            sigmaGraph.stopForceAtlas2();
          }, 3000);
        }
      });

      scope.$on('$destroy', function() {
        sigmaGraph.killForceAtlas2();
        sigmaGraph.graph.clear();
      });
    }
  }

})();
