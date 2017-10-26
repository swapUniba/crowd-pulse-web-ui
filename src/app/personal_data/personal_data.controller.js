(function() {
    'use strict';

    angular
        .module('webUi')
        .controller('PersonalDataController', PersonalDataController);

    /** @ngInject */
    function PersonalDataController($mdToast, $scope, personalDataSocket, Account, $mdDialog) {
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
                        setUpTimestamps();
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

        //simple binary search algorithm
        vm.onSliderMoved = function (key, ngModelData, listValueAllowed) {
            var startPosition = 0;
            var endPosition = listValueAllowed.length - 1;
            var found = false;
            while (!found) {
                var midPosition = startPosition + parseInt((endPosition - startPosition) / 2);
                var midValue = listValueAllowed[midPosition];
                if (ngModelData === midValue) {
                    found = true;
                } else if (ngModelData < midValue) {
                    endPosition = midPosition - 1;
                } else {
                    startPosition = midPosition + 1;
                }
                if (!found && endPosition - startPosition <= 0) {
                    ngModelData = listValueAllowed[startPosition];
                    found = true;
                }
            }

            //update UI value
            switch (key) {
                case "readGPS":
                    vm.timeGPS = ngModelData;
                    break;
                case "readNetStats":
                    vm.timeNetStats = ngModelData;
                    break;
                case "readAccounts":
                    vm.timeAccounts = ngModelData;
                    break;
                case "readContact":
                    vm.timeContact = ngModelData;
                    break;
                case "readDisplay":
                    vm.timeDisplay = ngModelData;
                    break;
                case "readAppInfo":
                    vm.timeAppInfo = ngModelData;
                    break;
            }
        };

        vm.sendConfiguration = function() {
            var response = vm.selectedDeviceConfig;
            response.timeReadGPS = vm.timeGPS * (60 * 1000);
            response.timeReadAccounts = vm.timeAccounts * (3600 * 1000);
            response.timeReadNetStats = vm.timeNetStats * (3600 * 1000);
            response.timeReadContact  = vm.timeContact  * (3600 * 1000);
            response.client = "web-ui";
            personalDataSocket.emit("config", response);
        };

        vm.startWith = function(text, start) {
            return text.startsWith(start);
        };

        vm.getDataFromDevice = function () {
            var data = {
                deviceId: vm.selectedDeviceId,
                displayName: $scope.user.displayName,
                client: "web-ui"
            };
            personalDataSocket.emit("send_data", data);
        };

        vm.openDialog = function (event, key) {
            var infoText = "";
            switch (key) {
                case "readGPS":
                    infoText = "GPS data is the user position in terms of latitude and logitude.";
                    break;
                case "readNetStats":
                    infoText = "Network traffic statistics in terms of bytes transmitted and received " +
                        "over mobile net and Wifi." + "\n" +
                        "These statistics may not be available on all platforms.";
                    break;
                case "readAccounts":
                    infoText = "Accounts data are user's accounts informations " +
                        "(application package and user name) stored in the smartphone.";
                    break;
                case "readContact":
                    infoText = "User's contacts informations stored in the smartphone (with phone numbers).";
                    break;
                case "readDisplay":
                    infoText = "On/Off display total time.";
                    break;
                case "readAppInfo":
                    infoText = "Information about the applications installed on the device.";
                    break;
            }
            $mdDialog.show(
                $mdDialog.alert()
                    .title("Information")
                    .clickOutsideToClose(true)
                    .content(infoText)
                    .ariaLabel('Information')
                    .targetEvent(event)
                    .ok('Got it!')
            );
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

        //convert milliseconds timestamps in minute and hour
        var setUpTimestamps = function () {
          vm.timeGPS = parseInt(vm.selectedDeviceConfig.timeReadGPS) / (60 * 1000);
          vm.timeAccounts = parseInt(vm.selectedDeviceConfig.timeReadAccounts) / (3600 * 1000);
          vm.timeNetStats = parseInt(vm.selectedDeviceConfig.timeReadNetStats) / (3600 * 1000);
          vm.timeContact = parseInt(vm.selectedDeviceConfig.timeReadContact) / (3600 * 1000);
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
                setUpTimestamps();

                console.log("New configuration coming from smartphone");
            } else if (response.config.deviceId === vm.selectedDeviceId) {
                showToast(response.description);
            }
        });

        personalDataSocket.on("send_data", function (response) {
            showToast(response.description);
        });

        vm.getProfile();
        vm.loginSuccess = false;
        vm.selectedDeviceId = null;
        vm.selectedDeviceConfig = null;

        //timestamps
        vm.timeGPS = null;
        vm.timeAccounts = null;
        vm.timeAppInfo = null;
        vm.timeNetStats = null;
        vm.timeDisplay = null;
        vm.timeContact = null;

        vm.timeGPSAllowed = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];  //minutes
        vm.timeAccountsAllowed = [1, 2, 3, 4, 6, 8, 12, 24];             //hour
        vm.timeAppInfoAllowed = [];                                      //no value
        vm.timeNetStatsAllowed = [1, 2, 3, 4, 6, 8, 12, 24];             //hour
        vm.timeDisplayAllowed = [];                                      //no value
        vm.timeContactAllowed = [1, 2, 3, 4, 6, 8, 12, 24];              //hour
    }

})();