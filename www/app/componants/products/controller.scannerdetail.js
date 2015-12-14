angular.module('blink.core')
    .controller('detailController', detailController);
detailController.$inject = ['$scope', '$state', '$config'];

/*
 * core controller  
 */

function detailController($scope, $state, $config) {
    

    // scan barcode detail
    $scope.$on('$ionicView.afterEnter', function(viewInfo) {
        console.log(viewInfo);
        if ($state.params && $state.params.detail) {
            $scope.products = $state.params.detail;
            $scope.scan_item = $scope.products[0];
        }
    });

    $scope.source = $config.source;
    $scope.showBarcodeItemDetail = function(item) {
        $scope.scan_item = item;
    }

    // favorite the product
    $scope.toggleFavorite = function(index) {
        if ($scope.historyBarcodeItemList[index].detail && $scope.historyBarcodeItemList[index].detail.favorite) {
            $rootScope.historyBarcodeItemList[index].detail.favorite = false;
            $rootScope.unfavourite($rootScope.historyBarcodeItemList[index]);

        } else {
            $rootScope.historyBarcodeItemList[index].detail.favorite = true;
            $rootScope.favourite($rootScope.historyBarcodeItemList[index]);
        }

    }
}