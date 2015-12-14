angular.module('blink', ['ionic', 'ngCordova', 'blink.core', 'blink.services'])

.run(function($ionicPlatform, $barcodeDbService) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
        $barcodeDbService.createDatabase();
    })
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "app/componants/core/sideMenu.html",
                controller: 'scanController'
            })
            .state('app.scanner', {
                url: "/scanner",
                views: {
                    'blinkContainer': {
                        templateUrl: "app/componants/core/barcodeScannerView.html"

                    }
                }


            })
            .state('app.settings', {
                url: "/settings",
                views: {
                    'blinkContainer': {
                        templateUrl: "app/componants/settings/barcodeSettingsView.html",
                        controller: 'settingsController'
                    }
                }


            })
            .state('app.detail', {
                url: "/detail",
                params: {
                    // barcode: null,
                    detail: null
                },
                views: {
                    'blinkContainer': {
                        templateUrl: "app/componants/products/barcodeProductsView.html",
                        controller: 'detailController'
                    }
                }
            })
            .state('app.history', {
                url: "/history",
                views: {
                    'blinkContainer': {
                        templateUrl: "app/componants/history/barcodeHistoryView.html",
                        controller: 'historyController'
                    }
                }


            })
            .state('app.favorite', {
                url: "/favorite",
                views: {
                    'blinkContainer': {
                        templateUrl: "app/componants/favorite/barcodeFavoriteListView.html",
                        controller: 'favoriteController'
                    }
                }


            })
            .state('app.disclaimer', {
                url: "/disclaimer",
                views: {
                    'blinkContainer': {
                        templateUrl: "app/componants/settings/disclaimer.html"
                    }
                }


            });
        $urlRouterProvider.otherwise('/app/scanner');

    });
