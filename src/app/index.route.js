(function() {
  'use strict';

  angular
    .module('webUi')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '',
        abstract: true,
        templateUrl: 'app/__abstract.html',
        resolve: {
          'config': 'config'
        }
      })

      .state('app.view', {
        url: '/view?chartType&db&from&to&filter&search&users&corpus&index&indexType&engine&topic&sentiment&language&lat&lng&ray',
        reloadOnSearch: false,
        templateUrl: 'app/view/index.html',
        controller: 'ViewIndexController',
        controllerAs: 'vm'
      })

      .state('app.admin', {
        url: '/admin',
        abstract: true,
        templateUrl: 'app/admin/index.html'
      })

      .state('app.export', {
        url: '/export',
        templateUrl: 'app/export/export.html',
        controller: 'ExportController',
        controllerAs: 'vm'
      })

      .state('app.privacy', {
        url: '/privacy',
        templateUrl: 'app/privacy/privacy.html',
        controller: 'PrivacyController',
        controllerAs: 'vm'
      })

      .state('app.admin.main', {
        url: '',
        templateUrl: 'app/admin/main/main.html'
      })
      .state('app.admin.project', {
        url: '/project',
        abstract: true,
        templateUrl: 'app/__abstract.html'
      })
      .state('app.admin.project.main', {
        url: '',
        templateUrl: 'app/admin/project/main/project-main.html'
      })
      .state('app.admin.project.new', {
        url: '/new',
        templateUrl: 'app/admin/project/new/project-new.html',
        controller: 'AdminProjectNewController',
        controllerAs: 'vm'
      })
      .state('app.admin.project.edit', {
        url: '/:projectId',
        templateUrl: 'app/admin/project/edit/project-edit.html',
        controller: 'AdminProjectEditController',
        controllerAs: 'vm'
      })

      .state('app.profile', {
        url: '/profile',
        templateUrl: 'app/profile/index.html',
        controller: 'ProfileController',
        controllerAs: 'vm'
      })

      .state('app.login', {
        url: '/login',
        templateUrl: 'app/login/index.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      })

      .state('app.personal_data', {
          url: '/personal_data',
          templateUrl: 'app/personal_data/personal_data.html',
          controller: 'PersonalDataController',
          controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('/view');
  }

})();
