(function() {
  'use strict';

  angular.module('webUi')
    .controller('ExportController', ExportController);

  /** @ngInject */
  function ExportController($scope, $window, $mdToast, Database, Profile, Language, config) {
    var vm = this;

    vm.sentiments = [{
      type: '',
      value: 'Any'
    }, {
      type: 'positive',
      value: 'Positive'
    }, {
      type: 'neuter',
      value: 'Neuter'
    }, {
      type: 'negative',
      value: 'Negative'
    }];

    vm.params = {
      sentiment: ''
    };

    Database.getList().then(function(dbs) {
      vm.databases = dbs;
    });

    vm.searchAuthors = function(author, database) {
      return Profile.getList({
        db: database,
        username: author
      });
    };

    $scope.$watch('vm.params.database', function(newValue) {
      Language.getList({
        db: newValue
      }).then(function(languages) {
        vm.languages = [''].concat(languages);
      });
    });

    vm.download = function() {
      if (!vm.params.database) {
        return $mdToast.show(
          $mdToast.simple()
            .content('Please select a database first')
            .position('bottom right')
            .hideDelay(3000)
        );
      }
      var url = config.api + 'databases/' + vm.params.database + '?';
      if (vm.params.language) {
        url += 'language=' + vm.params.language + '&';
      }
      if (vm.params.author) {
        url += 'author=' + vm.params.author + '&';
      }
      if (vm.params.sentiment) {
        url += 'sentiment=' + vm.params.sentiment + '&';
      }
      url = url.substr(0, url.length-1);
      $window.open(url);
    };
  }

})();
