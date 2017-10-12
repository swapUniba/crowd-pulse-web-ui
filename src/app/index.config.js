(function() {
  'use strict';

  angular
    .module('webUi')
    .config(logConfig)
    .config(restConfig)
    .config(httpConfig)
    .config(satellizerConfig)
;

  /** @ngInject */
  function logConfig($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);
  }

  function satellizerConfig($authProvider) {

	$authProvider.httpInterceptor = function() { return true; },
	$authProvider.withCredentials = false;
	$authProvider.tokenRoot = null;
	$authProvider.baseUrl = '/';
	$authProvider.loginUrl = '/auth/login';
	$authProvider.signupUrl = '/auth/signup';
	$authProvider.unlinkUrl = '/auth/unlink/';
	$authProvider.tokenName = 'token';
	$authProvider.tokenPrefix = 'satellizer';
	$authProvider.tokenHeader = 'Authorization';
	$authProvider.tokenType = 'Bearer';
	$authProvider.storageType = 'localStorage';


	// Facebook
	$authProvider.facebook({
      clientId: '637963103055683',
	  name: 'facebook',
	  url: '/auth/facebook',
	  authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
	  redirectUri: window.location.origin + '/',
	  requiredUrlParams: ['display', 'scope'],
	  scope: ['email','user_friends','user_posts','user_likes'],
	  scopeDelimiter: ',',
	  display: 'popup',
	  oauthType: '2.0',
	  popupOptions: { width: 580, height: 400 }
	});

	// Twitter
	$authProvider.twitter({
	  url: '/auth/twitter',
	  authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
	  redirectUri: window.location.origin + '/',
	  oauthType: '1.0',
	  popupOptions: { width: 495, height: 300 }
	});

	$authProvider.linkedin({
          clientId: '77kw2whm8zdmzr',
	  url: '/auth/linkedin',
	  authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
	  redirectUri: window.location.origin + '/',
	  requiredUrlParams: ['state'],
	  scope: ['r_emailaddress'],
	  scopeDelimiter: ' ',
	  state: 'STATE',
	  oauthType: '2.0',
	  popupOptions: { width: 527, height: 582 }
	});
  }


  /** @ngInject */
  function restConfig(configProvider, RestangularProvider) {
    // Set the config.json path
    configProvider.useConfigPath('../config.json');
    configProvider.addConfigResolvedListener(function(data) {
      RestangularProvider.setBaseUrl(data.api);
    });

    // Set options third-party lib
    // Mongo IDs are "_id", not "id"
    RestangularProvider.setRestangularFields({
      id: "_id"
    });
  }

  /** @ngInject */
  function httpConfig($httpProvider) {
    /** @ngInject */
    var interceptor = function($q, $rootScope, $log, $timeout, toolbarLoadedEvent, toolbarLoadingEvent) {
      var requests = 0;
      var completed = 0;
      var timeoutPromise;

      var handleCompletion = function() {
        completed++;
      };

      var evaluateAsync = function() {
        // if we are already waiting for something, discard it as this is newer
        if (timeoutPromise) {
          $timeout.cancel(timeoutPromise);
        }
        timeoutPromise = $timeout(function() {
          if (completed >= requests) {
            completed = 0;
            requests = 0;
            return $rootScope.$broadcast(toolbarLoadedEvent);
          }
          return $rootScope.$broadcast(toolbarLoadingEvent);
        }, 300);
      };

      return {
        'request': function(config) {
          if (requests === 0) {
            $rootScope.$broadcast(toolbarLoadingEvent);
          }
          requests++;
          return config;
        },

        'response': function(response) {
          handleCompletion();
          evaluateAsync();
          return response;
        },

        'responseError': function(rejection) {
          handleCompletion();
          evaluateAsync();
          return $q.reject(rejection);
        }
      };
    };

    $httpProvider.interceptors.push(interceptor);
  }

})();
