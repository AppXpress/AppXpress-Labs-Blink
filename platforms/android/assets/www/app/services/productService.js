/**
 *  product service
 *  @author: Saliya Ruwan
 *  get data from specific upc DB and format data 
 */
angular.module('blink.services')
    .factory('$products', ['$httpService', '$config', function ($httpService, $config) {

        /**
         * search product
         * usage : $products.searchProduct(<sourceObject>, 'UPC-A', '0047400115507', function (status, data) {})
         */
        function searchProduct(source, type, code, callback) {
            var typeString = type.replace(/_/g, '').toUpperCase();

            if (!$config.support[typeString]) {
                callback(false, 'Sorry, barcode type "' + type + '"  is not supported');
                return;
            }

            //check source
            if (!source && !source.length) {
                callback(false, "No source selected");
                return;
            }

            var dataSource = [];

            for (var key in source) {
                if (source[key].checked) {
                    dataSource.push({
                        source: source[key].key,
                        uri: getUri(source[key].key, typeString, code)
                    });
                }
            }

            if (!dataSource.length) {
                callback(false, "select source");
                return [];
            }

            var mainProductList = [];

            function getSourceData(index, dataArray, callback) {
                var result = $httpService.get(dataArray[index].source, dataArray[index].uri);
                result.success(function (data, status) {
  
                    if (status == 200 && data) {
                        var dataFormatted = formatData(dataArray[index].source, data, callback);
                        mainProductList = mainProductList.concat(dataFormatted);
                    }
                    if (dataArray[index + 1]) {
                        getSourceData(index + 1, dataSource, callback);
                        return;
                    }
                    callback(true, mainProductList);
                }).error(function (data, status) {
                    callback(false, "Please check internet connectivity");
                });

            }


            getSourceData(0, dataSource, callback);
        }


        function getUri(source, type, code) {
            var codeType = $config.support[type];
            var sourceData = $config.source[source];

            if (source === 'ebay') {
                sourceData.params['productId.@type'] = codeType;
            }

            var uri = '';

            for (var key in sourceData.params) {
                var isFirstKey = false;
                if (!uri && !sourceData.append) {
                    uri += '?';
                    isFirstKey = true;
                } else if (!uri && sourceData.append) {
                    uri += '/';
                    isFirstKey = true;
                }

                var seperator = (sourceData.append) ? '/' : '&';
                var param = (sourceData.append) ? sourceData.params[key] : key + '=' + sourceData.params[key];

                uri += (isFirstKey) ? '' : seperator;
                uri += param;
            }

            uri += code;
            return uri;
        }

        function formatData(source, data, callback) {
            if (source === 'ebay') {
                var result = data.findItemsByProductResponse[0].searchResult;
                var productList = [];

                if (!result) {
                    return [];
                }
                
                var items = result[0].item;
                for (var key in items) {
                        var item = items[key];
                        var template = {
                            id: item.itemId[0],
                            dbType: "ebay",
                            productname: item.title[0],
                            description: item.viewItemURL[0],
                            imageurl: (item.galleryURL[0]) ? item.galleryURL[0] : 'img/no-image-available.png',
                            favorite: false,
                            location: item.location[0],
                            sellingInfo: {
                                state: item.sellingStatus[0].sellingState[0],
                                currentPrice: {
                                    currency: (item.sellingStatus[0] && item.sellingStatus[0].currentPrice[0]) ? item.sellingStatus[0].currentPrice[0]['@currencyId'] : '0.00',
                                    price: (item.sellingStatus[0] && item.sellingStatus[0].currentPrice[0]) ? item.sellingStatus[0].currentPrice[0]['__value__'] : '0.00'
                                } 
                            },
                            shippingInfo: {
                                shippingServiceCost: (item.shippingInfo[0].shippingServiceCost) ? item.shippingInfo[0].shippingServiceCost : '0.00',
                                shippingType: (item.shippingInfo[0].shippingType[0]) ? item.shippingInfo[0].shippingType[0] :'',
                                shipToLocations: item.shippingInfo[0].shipToLocations.join(),
                                expeditedShipping: (item.shippingInfo[0].expeditedShipping[0]) ? item.shippingInfo[0].expeditedShipping[0] : '',
                                oneDayShippingAvailable: (item.shippingInfo[0].oneDayShippingAvailable[0]) ? item.shippingInfo[0].oneDayShippingAvailable[0] : '',
                                handlingTime: (item.shippingInfo[0].handlingTime[0]) ? item.shippingInfo[0].handlingTime[0] : ''
                            },
                            returnsAccepted: (item.returnsAccepted[0]) ? item.returnsAccepted[0] : '',
                            listingInfo: {
                                bestOfferEnabled: (item.listingInfo[0].bestOfferEnabled[0])? item.listingInfo[0].bestOfferEnabled[0]:'',
                                buyItNowAvailable: (item.listingInfo[0].buyItNowAvailable[0]) ? item.listingInfo[0].buyItNowAvailable[0] : '',
                                startTime: (item.listingInfo[0].startTime[0]) ? item.listingInfo[0].startTime[0] :'',
                                endTime: (item.listingInfo[0].endTime[0]) ? item.listingInfo[0].endTime[0] : ''

                            }
                        };


                        productList.push(template);

                }

                return productList;
            }
            if (source === 'searchUPC') {

                var result = data;
                var productList = [];
                
                for (var key in result) {
                    if (result[key] && result[key].productname && result[key].productname != " " && result[key].productname != 'N/A') {
                        var template = {
                            id: '',
                            dbType: "searchUPC",
                            productname: result[key].productname,
                            description: result[key].producturl,
                            imageurl: (result[key] && result[key].imageurl && result[key].imageurl != 'N/A') ? result[key].imageurl : 'img/no-image-available.png',
                            favorite: false,
                            sellingInfo: {
                                state: 'true',
                                currentPrice: {
                                    currency: result[key].currency,
                                    price: (result[key] && result[key].price && result[key].price != 'N/A') ? result[key].price : '0.00'
                                }
                            }
                        };
                        productList.push(template);
                    }
                }

                return productList;

            }
            if (source === 'upcDatabase') {
                if(!data.valid){
                    return [];
                }
                var productList = [];
                if (data.itemname) {
                    productList.push({
                        id: '',
                        dbType: "upcDatabase",
                        imageurl: 'img/no-image-available.png',
                        productname: data.itemname,
                        description: data.description,
                        favorite: false,
                        sellingInfo: {
                            currentPrice: {
                                currency: 'USD',
                                price: (data && data.avg_price) ? data.avg_price : '0.00'
                            }
                        }
                    });

                }
                return productList;
            }
        }

        return {
            searchProduct: searchProduct
        };
    }]);