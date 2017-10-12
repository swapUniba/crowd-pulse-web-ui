(function() {
  'use strict';

  angular
    .module('webUi')
    .directive('toolbarLoader', toolbarLoader);

  /** @ngInject */
  function toolbarLoader(toolbarLoadedEvent, toolbarLoadingEvent) {
    var directive = {
      restrict: 'A',
      link: ToolbarLoaderPostLink
    };

    return directive;

    function ToolbarLoaderPostLink(scope, elem, attrs) {
      scope.$on(toolbarLoadedEvent, function() {
        attrs.$set('mdMode', '');
      });
      scope.$on(toolbarLoadingEvent, function() {
        attrs.$set('mdMode', 'indeterminate');
      });
    }
  }

})();
