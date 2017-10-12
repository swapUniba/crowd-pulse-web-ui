(function() {
  'use strict';

  angular
    .module('webUi')
    .directive('mdChooseFile', mdChooseFile);

  /** @ngInject */
  function mdChooseFile($log, FileReader) {
    var directive = {
      restrict: 'A',
      require: 'ngModel',
      priority: 1000,
      link: MdChooseFilePostLink
    };

    function MdChooseFilePostLink(scope, elem, attr, ngModelCtrl) {
      // add the file input
      elem.append('<input type="file"/>');

      var button = elem;
      var input = elem.find('input');
      input.css({
        'width': '0.1px',
        'height': '0.1px',
        'opacity': '0',
        'overflow': 'hidden',
        'position': 'absolute',
        'z-index': '-1'
      });

      var handleClick = function() {
        input[0].click();
        return false;
      };

      var handleFile = function(evt) {
        var file = evt.target.files[0];

        if (!file) {
          return;
        }

        if (file.type !== 'application/json') {
          $log.warn('Unhandled file type ' + file.type);
          return;
        }

        var reader = new FileReader();
        reader.onload = function() {
          ngModelCtrl.$setViewValue(reader.result);
          ngModelCtrl.$modelValue = reader.result;
        };
        reader.readAsText(file);
      };

      // when the button is clicked
      button.bind('click', handleClick);
      input.bind('change', handleFile);

      scope.$on('$destroy', function() {
        button.unbind('click', handleClick);
      });
    }

    return directive;
  }

})();
