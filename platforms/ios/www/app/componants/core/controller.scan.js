/*
 * scan controller  
 */

angular.module('blink.core')
    .controller('scanController', scanController);

scanController.$inject = ['$scope', '$rootScope', '$config', '$cordovaBarcodeScanner', '$state', '$products', '$log', '$popupService', '$barcodeDbService', '$ionicLoading', '$PouchDBService', '$ionicSideMenuDelegate', '$watcherServices', '$cordovaSocialSharing'];

function scanController($scope, $rootScope, $config, $cordovaBarcodeScanner, $state, $products, $log, $popupService, $barcodeDbService, $ionicLoading, $PouchDBService, $ionicSideMenuDelegate, $watcherServices, $cordovaSocialSharing) {

    $rootScope.settings = [];
    for (var key in $config.source) {
        $rootScope.settings.push({
            text: $config.source[key].name,
            key: key,
            checked: true
        });
    }

    $scope.source = 'upcDatabase';
    $scope.products = [];


    // Scan barcode 
    $scope.scanBarcode = function () {
        $cordovaBarcodeScanner.scan().then(function (imageData) {

                if (imageData.cancelled) {
                    return;
                }
                $ionicLoading.show();
                $products.searchProduct($rootScope.settings, imageData.format, imageData.text, function (status, data) {
                    $ionicLoading.hide();
                    if (!status) {
                        navigator.notification.alert(
                            data,
                            null,
                            'warning',
                            'Ok'
                        );
                        return;
                    }
                    if (!data.length) {
                        navigator.notification.alert(
                            'Sorry, the scaned item can\'t be found !',
                            null,
                            'warning',
                            'Ok'
                        );
                        return;
                    }


                    // store data in mobile db
                    $barcodeDbService.insertRecord(imageData.text, data);

                    $state.go('app.detail', {
                        detail: data
                    });

                });
            },
            function (error) {
                $log.error("An error happened -> " + error);
            });
    };
}