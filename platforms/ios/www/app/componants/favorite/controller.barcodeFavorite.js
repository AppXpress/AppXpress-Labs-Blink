angular.module('blink.core')
    .controller('favoriteController', favoriteController);

favoriteController.$inject = ['$rootScope', '$scope', '$state', '$barcodeDbService'];

function favoriteController($rootScope, $scope, $state, $barcodeDbService) {

    // favorite the product
    $scope.toggleFavorite = function(index) {

        if ($rootScope.favoriteBarcodeItemList[index].detail && $rootScope.favoriteBarcodeItemList[index].detail.favorite) {
           
            $rootScope.favoriteBarcodeItemList[index].detail.favorite = false;
            $rootScope.unfavourite($rootScope.favoriteBarcodeItemList[index]);

        } else {
            
            $rootScope.favoriteBarcodeItemList[index].detail.favorite = true;
            $rootScope.favourite($rootScope.favoriteBarcodeItemList[index]);
        }

    }

}
