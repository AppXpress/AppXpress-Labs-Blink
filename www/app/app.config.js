angular.module('blink.services').constant('$config', {
    source: {
        searchUPC: {
            name: 'Searchupc Database',
            params: {
                'request_type': 3,
                'access_token': '3D92A162-6F6B-4D42-8103-9EE7B6EC1B2A',
                'upc': ''
            },
            append: false,
            dataKey: '3D92A162-6F6B-4D42-8103-9EE7B6EC1B2A',
            basePath: 'http://www.searchupc.com/handlers/upcsearch.ashx'
        },
        upcDatabase: {
            name: 'UPC Database',
            dataKey: '1b037964fbf33a02ce2a1ef3dbffe993',
            params: {
                dataFormat: 'json',
                dataKey: '1b037964fbf33a02ce2a1ef3dbffe993',
                'upc': ''
            },
            append: true,
            basePath: 'http://api.upcdatabase.org'
        },
        ebay: {
            name: 'eBay',
            dataKey: 'GTNexus25-cc2b-40eb-a332-fb21e38277a',
            params: {
                'OPERATION-NAME': 'findItemsByProduct',
                'SERVICE-VERSION': '1.0.0',
                'SECURITY-APPNAME': 'GTNexus25-cc2b-40eb-a332-fb21e38277a',
                'RESPONSE-DATA-FORMAT': 'JSON',
                'REST-PAYLOAD': '',
                'paginationInput.entriesPerPage': 10,
                'productId.@type': 'EAN',
                'productId': ''
            },
            append: false,
            basePath: 'http://svcs.ebay.com/services/search/FindingService/v1'
        }
        
    },
    history : {
        	lifespan :  172800000 // in millis - 2 days
        	//lifespan :  1 // in millis - for testing
        	,evalDate : 0
        },
    support: {
        UPCA: 'UPC',
        UPCE: 'UPC',
        EAN8: 'EAN',
        EAN13: 'EAN',
        EAN128:'EAN'
    }
});