angular.module('blink.core')
    .controller('historyController', historyController);
historyController.$inject = ['$rootScope', '$scope', '$state', '$barcodeDbService'];

/*
 * core controller  
 */

function historyController($rootScope, $scope, $state, $barcodeDbService) {

    // favorite the product
    $scope.toggleFavorite = function(index) {
        if ($rootScope.historyBarcodeItemList[index].detail && $rootScope.historyBarcodeItemList[index].detail.favorite) {
            $rootScope.historyBarcodeItemList[index].detail.favorite = false;
            $rootScope.unfavourite($rootScope.historyBarcodeItemList[index]);

        } else {
            $rootScope.historyBarcodeItemList[index].detail.favorite = true;
            $rootScope.favourite($rootScope.historyBarcodeItemList[index]);
        }

    }

}
