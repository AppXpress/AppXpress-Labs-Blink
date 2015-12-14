angular.module('blink.services')
    .factory('$barcodeDbService', barcodeDbService);

barcodeDbService.$inject = ['$rootScope', '$PouchDBService'];

function barcodeDbService($rootScope, $PouchDBService) {
    {
        _id: "123457789",
        products: [{
            id: "",
            dbType: "upcsearch",
            productname: "",
            date: ""
        }, {
            id: "",
            dbType: "upcsearch",
            productname: "",
            date: ""
        }, {
            id: "",
            dbType: "upc",
            productname: "",
            description: "",
            date: ""
        }, {
            id: "",
            dbType: "upc",
            productname: "",
            description: "",
            date: ""
        }]
    }

    // CREATE DTABASE
    var createDatabase = function() {
        $rootScope._db = $PouchDBService.createDB('blink');
    }

    // INSERT RECORDS OR UPDATE
    var insertRecord = function(barcode, db, data) {

        var record = findRecord(barcode);

        if (record) {
            updateRecord(db, data, record);
        } else {
            // TODO: insert data
        }
    }

    // FIND RECORDS
    var findRecord = function(id) {
        var record = $PouchDBService.getById($rootScope._db, id);
        return record;

    }

    var updateRecord = function(db, data, record) {
        var products = [];
        angular.forEach(data.products, function(item, key) {
            switch (item.dbType) {

                case "searchDB":
                    var existingRecord = $filter('filter')(record.products, {
                        productname: item.productname
                    })[0];
                    if (existingRecord) {
                        var index = record.products.indexOf(existingRecord);
                        record.products[index] = item;
                    } else {
                        record.products.unshift(item);
                    }

                    break;

                case "upcDatabase":
                    var existingRecord = $filter('filter')(record.products, {
                        productname: item.productname
                    })[0];
                    if (existingRecord) {
                        var index = record.products.indexOf(existingRecord);
                        record.products[index] = item;
                    } else {
                        record.products.unshift(item);
                    }
                    break;

                case "ebay":
                    var existingRecord = $filter('filter')(record.products, {
                        id: item.id
                    })[0];
                    if (existingRecord) {
                        var index = record.products.indexOf(existingRecord);
                        record.products[index] = item;
                    } else {
                        record.products.unshift(item);
                    }
                    break;
            }
        });

        
        record.products = products;
        record.date = getCurrentDate();
        $PouchDBService.insert($rootScope._db, record);

    }
    var getCurrentDate = function() {

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        var today = dd + '-' + mm + '-' + yyyy;
        return today;
    }

   

    // MANIPULATE DATA
    var maipulateData = function(db, data) {
        switch (db) {
            case "searchDB":
                return manipulateSearchDbData(data);
                break;
            case "upcDatabase":
                return manipulateUpcDbData(data);
                break;
            case "ebay":
                return maipulateEbayData(data);
                break;
        }
    }

    var maipulateEbayData = function(data) {
        var products = [];

        if (data.findItemsByProductResponse && data.findItemsByProductResponse.searchResult && data.findItemsByProductResponse.searchResult.item) {
            angular.forEach(data.findItemsByProductResponse.searchResult.item, function(item) {

                var product = {
                    id: item.itemId,
                    dbType: "ebay",
                    productname: item.title,
                    description: item.viewItemURL,
                    location: item.location,
                    sellingInfo: {
                        state: item.sellingStatus.sellingState,
                        currentPrice: {
                            currency: item.sellingStatus.currentPrice.@currencyId,
                            price: item.sellingStatus.currentPrice.__value__
                        }
                    },
                    shippingInfo: {
                        shippingServiceCost: {
                            currency: item.shippingInfo.shippingServiceCost.@currencyId,
                            price: item.shippingInfo.shippingServiceCost.__value__
                        },
                        shippingType: item.shippingInfo.shippingType,
                        shipToLocations: item.shippingInfo.shipToLocations,
                        expeditedShipping: item.shippingInfo.expeditedShipping,
                        oneDayShippingAvailable: item.shippingInfo.oneDayShippingAvailable,
                        handlingTime: item.shippingInfo.handlingTime
                    },
                    returnsAccepted: item.returnsAccepted,
                    listingInfo: {
                        bestOfferEnabled: item.listingInfo.bestOfferEnabled,
                        buyItNowAvailable: item.listingInfo.buyItNowAvailable,
                        startTime: item.listingInfo.startTime,
                        endTime: item.listingInfo.endTime

                    }
                }

                products.push(product);
            });

            return products;
        } else {
            return;
        }
    }

    var manipulateSearchDbData = function(data) {
        var products = [];
        if (data.$$state.value && data.$$state.value.data) {
            angular.forEach(data.$$state.value.data, function(item) {
                var product = {
                    dbType: "upcsearch",
                    productname: item.productname,
                    description: item.producturl,
                    img: item.imageurl,
                    sellingInfo: {
                        state: 'true',
                        currentPrice: {
                            currency: item.currency,
                            price: item.price
                        }
                    }
                }
                products.push(product);
            });
            return products;
        } else {
            return;
        }

    }

    var manipulateUpcDbData = function(data) {
        var products = [];
        if (data.$$state.value && data.$$state.value.data) {
            angular.forEach(data.$$state.value.data, function(item) {
                var product = {
                    id: '',
                    dbType: "upc",
                    productname: item.itemname,
                    description: item.description,
                    sellingInfo: {
                        currentPrice: {
                            currency: 'USD',
                            price: item.avg_price
                        }
                    }
                }
                products.push(product);
            });
            return products;
        } else {
            return;
        }

    }

    return {
        insertRecord: insertRecord
    }

}