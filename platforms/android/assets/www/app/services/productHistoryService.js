angular.module('blink.services')
    .factory('$barcodeDbService', barcodeDbService);

barcodeDbService.$inject = ['$rootScope', '$PouchDBService', '$log', '$config', '$q'];

function barcodeDbService($rootScope, $PouchDBService, $log, $config, $q) {

    /*
	 * function : CREATE DTABASE usage: $PouchDBService.createDatabase()
	 */
    var createDatabase = function() {
        $rootScope._db = $PouchDBService.createDB('blink');
        $log.log("DATABASE CREATED");
    }

    /*
	 * function : INSERT RECORDS OR UPDATE usage: $PouchDBService.insertRecord()
	 */
    var insertRecord = function(barcode, data) {

        var products = {
            _id: barcode,
            date: getCurrentTime(),
            products: data
        }
        housekeep().then(function(){
            findByIdRecord(barcode).then(function(response) {
                console.log("found record");
                console.log(response);

                updateRecord(data, response);
               
            }).catch(function(err) {

                console.log(products);

                if (err.status && err.status == '404') {
                    addRecord(products);
                    
                }
            });
        });

    }

    /*
	 * function : ADD RECORDS usage: $PouchDBService.addRecord()
	 */
    var addRecord = function(products) {
        $PouchDBService.insert($rootScope._db, products).then(function(response) {

            if (response.ok) {
                $rootScope.$broadcast('getbarcodehistory');
                $rootScope.$broadcast('getbarcodefavorite');
            }

        }).catch(function(err) {
            console.log(err);
        });

    }
    
    /*
	 * Keep data in memory for the duration of history.lifespan. Remove
	 * the rest from pouchdb memory.
	 * TODO: DO Housekeeping once a day.
	 * 
	 */
    var housekeep = function(){
    	
    	var deferred = $q.defer();
    	var db = $rootScope._db;
        // Available selectors are $gt, $gte, $lt, $lte,
        // $eq, $ne, $exists, $type, and more
    	var now = new Date().getTime();
    	if($config.history.evalDate == 0 || ($config.history.evalDate < (now - $config.history.lifespan))){
    		
            db.createIndex({
                index: {fields: ['date']}
              }).then(function () {
             	 	db.find({
                  selector: {date: {$lt: now - $config.history.lifespan}}
                }).then(function(removables){
                	$config.history.evalDate = now; 
              	  	var promises = [];
              	  	
              	 	 if(removables.docs.length > 0){
                   	removables.docs.forEach(function(item, index){
                   		item._deleted = true;
                   		removables.docs[index] = item;
                   		
                   	 	promises.push(db.put(removables.docs[index]));
                   	});
                   	
                   	$q.all(promises).then(function(result){
                   		//TODO: Need to check result of each promise
                   		/* Quick pass upon fn execution */
                   		deferred.resolve();        		
                   	});
              	 	 }else{
              	 		deferred.resolve();
              	 	 }
       
                   	
                   	/*
      				 * // bulk delete old records. if(removables.docs.length > 0){
      				 * $PouchDBService.insertBatchJson(db,
      				 * removables.docs).then(function(result){ console.log(result);
      				 * deferred.resolve(); }).catch(function (err) { $log.log("ERROR
      				 * OCCURED : " + err); deferred.reject(err); }); }else{
      				 * deferred.resolve(); }
      				 */
                   	
                }).catch(function(error){
              	  $log.log("ERROR OCCURED : " + error);
                });
              });
    	}else{
    		//history is not n days old(n - spcified in config), just resolve.
    		deferred.resolve();
    	}

        
        return deferred.promise;
    }


    /*
	 * function : FIND RECORDS usage: $PouchDBService.findByIdRecord()
	 */
    var findByIdRecord = function(id) {
        $log.log("FIND RECORD : " + id);

        return $PouchDBService.getById($rootScope._db, id)
    }

    /*
	 * function : FIND ALL RECORDS usage: $PouchDBService.findAllRecords()
	 */
    var findAllRecords = function() {
        return $PouchDBService.getAll($rootScope._db);
    }

    /*
	 * function : UPDATE RECORD usage: $PouchDBService.updateRecord()
	 */
    var updateRecord = function(data, record) {
        console.log("update record");
        console.log(record_rev);
        var products = [];

        angular.forEach(data, function(item, key) {
            var found = false;

            for (var i = 0, len = record.products.length; i < len; i++) {
                if (item.productname == record.products[i].productname && item.dbType == record.products[i].dbType) {
                    found = true;
                    record.products[i] = item;
                }
            };

            if (!found) {
                record.products.unshift(item);
            }
        });

        record.date = getCurrentDate();
        console.log(record);
        addRecord(record);

        $log.log("RECORD HAS BEEN UPDATED : " + data);


    }

    /*
	 * function : GET CURRENT DATE usage: getCurrentDate()
	 */
    var getCurrentDate = function() {

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; // January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        var today = yyyy + '-' + mm + '-' + dd;
        return today;
    }
    
    var getCurrentTime = function(){
    	
    	return new Date().getTime();
    }



    return {
        createDatabase: createDatabase,
        insertRecord: insertRecord,
        findByIdRecord: findByIdRecord,
        findAllRecords: findAllRecords,
        addRecord: addRecord
    }

}
