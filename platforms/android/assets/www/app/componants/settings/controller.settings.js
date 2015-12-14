angular.module('blink.core')
    .controller('settingsController', settingsController);
settingsController.$inject = ['$scope', '$rootScope', '$state', '$config'];

/*
 * settings controller  
 */

function settingsController($scope, $rootScope, $state, $config) {    
    $scope.onChangeSettings = function(item){
        var selectedList = $rootScope.settings.filter(function(el){
            return el.checked
        });
        if(!selectedList.length){
            item.checked = true;
        }
    }

}