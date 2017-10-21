(function() {
    'use strict';

    angular
        .module('webUi')
        .controller('PersonalDataController', PersonalDataController);

    /** @ngInject */
    function PersonalDataController($mdToast, $scope, Account) {
        var vm = this;

        vm.getProfile = function() {
            Account.getProfile()
                .then(function(response) {
                    $scope.user = response.data.user;
                })
                .catch(function(response) {
                    showToast(response.data.message);
                });
        };

        vm.onDeviceIdSelected = function () {
            if ($scope.user.deviceConfigs && $scope.user.deviceConfigs.length > 0) {
                for (var i = 0; i < $scope.user.deviceConfigs.length; i++) {
                    if ($scope.user.deviceConfigs[i].deviceId === vm.selectedDeviceId) {
                        vm.selectedDeviceConfig = $scope.user.deviceConfigs[i];
                        console.log(vm.selectedDeviceConfig);
                        break;
                    }
                }
            }
        };

        vm.onSwitchPressed = function () {
            for (var i = 0; i < $scope.user.deviceConfigs.length; i++) {
                if ($scope.user.deviceConfigs[i].deviceId === vm.selectedDeviceId) {
                    $scope.user.deviceConfigs[i] = vm.selectedDeviceConfig;
                    console.log(vm.selectedDeviceConfig);
                    break;
                }
            }
        };

        vm.startWith = function(text, start) {
            return text.startsWith(start);
        };

        var showToast = function(message) {
            var toast = $mdToast.simple()
                .content(message)
                .position('bottom right');
            return $mdToast.show(toast);
        };

        vm.getProfile();
        vm.selectedDeviceId = null;
        vm.selectedDeviceConfig = null;
    }

})();