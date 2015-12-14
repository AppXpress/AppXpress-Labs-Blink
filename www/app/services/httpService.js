/**
 *  HTTP Service
 *  @author: Saliya Ruwan
 *  Service to handle http request (GET, POST)
 */
angular.module('blink.services')
    .factory('$httpService', ['$http', '$config', function ($http, $config) {

        return {
            get: get
        };

        function get(source, url) {
            var url = $config.source[source].basePath + url;
            return $http.get(url, {
                headers: {
                    //'Authorization': authToken,
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                     //'Cache-Control' : 'no-cache' 
                }
            });
        }

}]);