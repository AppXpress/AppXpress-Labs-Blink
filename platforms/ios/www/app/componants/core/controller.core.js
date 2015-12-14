/*
 * core controller  
 */

angular.module('blink.core')
    .controller('coreController', coreController);

coreController.$inject = ['$scope', '$rootScope', '$config', '$cordovaBarcodeScanner', '$state', '$products', '$log', '$popupService', '$barcodeDbService', '$ionicLoading', '$PouchDBService', '$ionicSideMenuDelegate', '$watcherServices', '$cordovaSocialSharing'];

function coreController($scope, $rootScope, $config, $cordovaBarcodeScanner, $state, $products, $log, $popupService, $barcodeDbService, $ionicLoading, $PouchDBService, $ionicSideMenuDelegate, $watcherServices, $cordovaSocialSharing) {

    // fetch history and favorite data
    $rootScope.$broadcast('getbarcodehistory');
    $rootScope.$broadcast('getbarcodefavorite');



    //make favourite the barcode item
    $rootScope.favourite = function (data) {
        $barcodeDbService.findByIdRecord(data.barcode).then(function (response) {

            for (var i = 0, len = response.products.length; i < len; i++) {
                if (data.detail.productname == response.products[i].productname && data.detail.dbType == response.products[i].dbType) {

                    response.products[i].favorite = true;
                }
            };
            $barcodeDbService.addRecord(response);

        }).catch(function (err) {

            $log.error("An error happened -> " + err);

        });
    }


    //make favourite the barcode item
    $rootScope.unfavourite = function (data) {
        $barcodeDbService.findByIdRecord(data.barcode).then(function (response) {

            for (var i = 0, len = response.products.length; i < len; i++) {
                if (data.detail.productname == response.products[i].productname && data.detail.dbType == response.products[i].dbType) {

                    response.products[i].favorite = false;
                }
            };

            $barcodeDbService.addRecord(response);

        }).catch(function (err) {

            $log.error("An error happened -> " + err);

        });




    }


    // share product
    $rootScope.shareAnywhere = function (msg, subject, img, link) {
        var subjectText = 'GT Nexus Blink: ' + subject;
        var msg = 'The following product was scanned and shared by GT Nexus Blink(c) beta release software';
        $cordovaSocialSharing.share(msg, subjectText, img, link);
    }

    // get months
    $rootScope.getMonth = function (date) {

        var month = new Array();
        month[0] = "Jan";
        month[1] = "Feb";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "Aug";
        month[8] = "Sep";
        month[9] = "Oct";
        month[10] = "Nov";
        month[11] = "Dec";

        var d = new Date(date);
        var n = month[d.getMonth()];
        return n;
    }

    // get date
    $rootScope.getDate = function (date) {

        var d = new Date(date);
        var n = d.getDate();
        return n;
    }

    // get year
    $rootScope.getYear = function (date) {

        var d = new Date(date);
        var n = d.getFullYear();
        return n;
    }

}