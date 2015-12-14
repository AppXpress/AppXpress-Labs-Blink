angular.module('blink.service')
    .factory('$barcodeDbService', barcodeDbService);

barcodeDbService.$inject = ['$rootScope', '$PouchDBService', '$config'];

function barcodeDbService($rootScope, $PouchDBService, $config) {
    //    {
    //        _id: "123457789",
    //        products: [{
    //            id: "",
    //            dbType: "upcsearch",
    //            productname: "",
    //            date: ""
    //        }, {
    //            id: "",
    //            dbType: "upcsearch",
    //            productname: "",
    //            date: ""
    //        }, {
    //            id: "",
    //            dbType: "upc",
    //            productname: "",
    //            description: "",
    //            date: ""
    //        }, {
    //            id: "",
    //            dbType: "upc",
    //            productname: "",
    //            description: "",
    //            date: ""
    //        }]
    //    }

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
            $PouchDBService.insert($rootScope._db, data);
        }
        
     // Available selectors are $gt, $gte, $lt, $lte, 
     // $eq, $ne, $exists, $type, and more
     $rootScope._db.createIndex({
       index: {fields: ['time']}
     }).then(function () {
    	 var data = db.find({
         selector: {time: {$gte: new Date().getTime() - $config.history.lifespan}}
       });
    	 //remove old records replace with latest ones
    	 if(data.docs.length > 0){
    	 	 $PouchDBService.insertBatchJson(data.docs);
    	 }
   
     });
        
    }

    // FIND RECORDS
    var findByIdRecord = function(id) {
        var record = $PouchDBService.getById($rootScope._db, id);
        return record;

    }

    // FIND ALL RECORDS
    var findAllRecords = function() {
        return $PouchDBService.getAll($rootScope._db);
    }

    // UPDATE RECORD
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

    // GET CURRENT DATE
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



    return {
        createDatabase: createDatabase,
        insertRecord: insertRecord,
        findByIdRecord: findByIdRecord,
        findAllRecords: findAllRecords
    }

}