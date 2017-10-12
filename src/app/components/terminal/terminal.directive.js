(function() {
  'use strict';

  angular.module('webUi')
    .directive('terminal', terminal);

  /** @ngInject  */
  function terminal($timeout) {
    var directive = {
      restrict: 'EAC',
      require: 'ngModel',
      templateUrl: 'app/components/terminal/terminal.html',
      link: termPostLink
    };

    function termPostLink(scope, elem, attrs, ngModelCtrl) {
      scope.items = [];
      var MAX_BUFFER = 100000;
      var domElem = elem[0];

      var listener = function(newLines) {
        Array.prototype.push.apply(scope.items, newLines);
        if (scope.items.length > MAX_BUFFER) {
          // remove the number of new elements from the top
          scope.items.splice(0, scope.items.length - MAX_BUFFER);
        }
        $timeout(function() {
          var curScroll = domElem.offsetHeight + domElem.scrollTop;
          if (curScroll < domElem.scrollHeight) {
            domElem.scrollTop = domElem.scrollHeight;
          }
        });
      };

      ngModelCtrl.$formatters.push(function(newValue) {
        newValue.addWriteListener(listener);

        scope.$on('$destroy', function() {
          newValue.removeWriteListener(listener);
        });
      });
    }

    return directive;
  }

})();
