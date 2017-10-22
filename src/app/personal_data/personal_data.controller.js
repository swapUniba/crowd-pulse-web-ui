(function() {
    'use strict';

    angular
        .module('webUi')
        .controller('PersonalDataController', PersonalDataController);

    /** @ngInject */
    function PersonalDataController($mdToast, $scope, personalDataSocket, Account) {
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
                        socketLogin();
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

        vm.sendConfiguration = function() {
            var response = vm.selectedDeviceConfig;
            response.client = "web-ui";
            personalDataSocket.emit("config", response);
        };

        vm.startWith = function(text, start) {
            return text.startsWith(start);
        };

        var socketLogin = function() {
            var loginData = {
                email: $scope.user.email,
                password: $scope.user.password,
                deviceId: vm.selectedDeviceId,
                client: "web-ui"
            };
            personalDataSocket.emit("login", loginData);
        };

        var showToast = function(message) {
            var toast = $mdToast.simple()
                .content(message)
                .position('bottom right');
            return $mdToast.show(toast);
        };

        personalDataSocket.on("login", function (response) {
            vm.loginSuccess = response.code === 1;
            showToast(response.description);
        });

        personalDataSocket.on("config", function (response) {
            if (response.code === 1 && response.config.deviceId === vm.selectedDeviceId) {
                vm.selectedDeviceConfig = response.config;

                //update the object
                vm.onSwitchPressed();
                console.log("New configuration coming from smartphone");
            } else if (response.config.deviceId === vm.selectedDeviceId) {
                showToast(response.description);
            }
        });

        vm.getProfile();
        vm.loginSuccess = false;
        vm.selectedDeviceId = null;
        vm.selectedDeviceConfig = null;
    }

})();