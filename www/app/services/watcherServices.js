angular.module('blink.services')
    .factory('$watcherServices', watcherServices);


watcherServices.$inject = ['$rootScope', '$state', '$ionicPopup', '$barcodeDbService'];

function watcherServices($rootScope, $state, $ionicPopup, $barcodeDbService) {


    $rootScope.$on('getbarcodehistory', function(event, msg) {
        console.log(event);
        console.log("found all records barcode history");
        var products = [];

        $barcodeDbService.findAllRecords().then(function(response) {
            console.log("found record");
            console.log(response);
            for (var i = 0, len = response.total_rows; i < len; i++) {

                if (response.rows[i] && response.rows[i].doc) {
                    console.log(response.rows[i].doc);
                    if(response.rows[i].doc.products && response.rows[i].doc.products instanceof Array){
                        console.log(response.rows[i].doc.products.length);
                        for (var j = 0; j < response.rows[i].doc.products.length; j++) {
                            var product = {
                                barcode: "",
                                date: "",
                                detail: ""
                            }
                            if (response.rows[i] && response.rows[i].doc) {

                                product.barcode = response.rows[i].id;
                                product.date = response.rows[i].doc.date;
                                product.detail = response.rows[i].doc.products[j];
                                console.log(product);
                                products.push(product);
                            }
                        }
                    }
  
                }
            }
            console.log(products);
            (products.length > 1) ? $rootScope.multipleCard = true : $rootScope.multipleCard = false;
            $rootScope.historyBarcodeItemList = products;

            // updateRecord(data, response);
        }).catch(function(err) {

            console.log(err);


        });

    });


    //Favorites

    $rootScope.$on('getbarcodefavorite', function(event, msg) {
        console.log(event);
        console.log("found all favorite records barcode history ");
        var products = [];

        $barcodeDbService.findAllRecords().then(function(response) {
            // console.log("found record");
            console.log(response);
            for (var i = 0, len = response.total_rows; i < len; i++) {

                if (response.rows[i] && response.rows[i].doc) {
                    console.log(response.rows[i].doc);
                    if(response.rows[i].doc.products && response.rows[i].doc.products instanceof Array){
                        console.log(response.rows[i].doc.products.length);
                        for (var j = 0; j < response.rows[i].doc.products.length; j++) {
                            var product = {
                                barcode: "",
                                date: "",
                                detail: ""
                            }
                            if (response.rows[i] && response.rows[i].doc) {
                                if (response.rows[i].doc.products[j].favorite) {

                                    product.barcode = response.rows[i].id;
                                    product.date = response.rows[i].doc.date;
                                    product.detail = response.rows[i].doc.products[j];
                                    console.log(product);
                                    products.push(product);
                                }


                            }
                        }
                    }

                }
            }
            console.log(products);
            $rootScope.favoriteBarcodeItemList = products;
            // updateRecord(data, response);
        }).catch(function(err) {

            console.log(err);


        });

    });

    return {}
}
