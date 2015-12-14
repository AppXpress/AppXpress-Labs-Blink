angular.module('blink.services')
    .factory('$popupService', popupService);


popupService.$inject = ['$rootScope', '$state', '$ionicPopup'];

function popupService($rootScope, $state, $ionicPopup) {

    /*
     * show alerts
     * usage: $popupService.showAlert();
     */
    // An alert dialog
    var showAlert = function(msg, callback) {
        var alertPopup = $ionicPopup.alert({
            //title: 'Don\'t eat that!',
            //mdi-alert-warning mdi-action-done mdi-alert-error
            template: '<i class="material-icons mdi-alert-warning alert alert-font"></i>&nbsp;&nbsp;' + msg
        });
        if (callback) {
            alertPopup.then(callback);
            return;
        }

    };

    /*
     * show error msg
     * usage: $popupService.showErrorMessage();
     */

    var showErrorMessage = function(msg, callback) {
        var alertPopup = $ionicPopup.alert({
            template: '<i class="material-icons mdi-alert-error error alert-font"></i>&nbsp;&nbsp;' + msg

        });
        if (callback) {
            alertPopup.then(callback);
            return;
        }

    };

    /*
     * show success msg
     * usage: $popupService.showSuccessMessage();
     */

    var showSuccessMessage = function(msg, callback) {
        var alertPopup = $ionicPopup.alert({
            template: '<i class="material-icons mdi-action-done success alert-font"></i>&nbsp;&nbsp;' + msg

        });
        if (callback) {
            alertPopup.then(callback);
            return;
        }

    };
    /*
     * show confirmation dialog
     * usage: $popupService.showConfirm();
     */
    // A confirm dialog
    var showConfirm = function(msg, successcallback, cancelcallback) {
        var confirmPopup = $ionicPopup.confirm({
            template: msg,
            buttons: [{
                text: 'Cancel',
                type: 'button-positive',
                onTap: cancelcallback
            }, {
                text: '<b>Yes</b>',
                type: 'button-positive',
                onTap: successcallback
            }, ]
        });
        //confirmPopup.then(callback);

    }

    return {
        showAlert: showAlert,
        showSuccessMessage: showSuccessMessage,
        showErrorMessage: showErrorMessage,
        showConfirm: showConfirm
    }

}
