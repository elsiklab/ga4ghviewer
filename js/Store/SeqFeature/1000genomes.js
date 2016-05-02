define( [
            'dojo/_base/declare',
            'dojo/_base/array',
            'dojo/request',
            'JBrowse/Store/SeqFeature',
            'JBrowse/Model/SimpleFeature'
        ],
        function(
            declare,
            array,
            request,
            SeqFeature,
            SimpleFeature
        ) {

return declare(SeqFeature, {

    constructor: function(args) {
        console.log(args);
        console.log(this.config);
    },

    getFeatures: function(query, featureCallback, finishCallback, errorCallback) {
        console.log(query);
        var variantSet = {
            variantSetId: "WyIxa2dlbm9tZXMiLCJ2cyIsInJlbGVhc2UiXQ",
            start: query.start,
            end: query.end,
            referenceName: "1",
            callSetIds: [],//this.config.callset,
            pageSize: 50
        };

        return request("http://1kgenomes.ga4gh.org/variants/search", {
            data : JSON.stringify(variantSet),
            method : 'post',
            headers: { 'X-Requested-With': null, 'Content-Type': 'application/json' },
            handleAs: "json"
        }).then(function(res) {
            array.forEach(res.variants, function(variant) {
                featureCallback(new SimpleFeature({
                    id: variant.id,
                    data: {
                        start: variant.start,
                        end: variant.end,
                        name: variant.id,
                        info: variant.info
                    }
                }));
            });
            finishCallback();
        }, function(err) {
            console.error(err);
            errorCallback("Error contacting GA4GH");
        });

    }

});


});
