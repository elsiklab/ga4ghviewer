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
    },

    getFeatures: function(query, featureCallback, finishCallback, errorCallback) {
        var ref = query.ref.replace(/chr/,"");
        var variantSet = {
            variantSetId: "WyIxa2dlbm9tZXMiLCJ2cyIsInJlbGVhc2UiXQ",
            start: query.start,
            end: query.end,
            referenceName: ref,
            callSetIds: this.config.callset||[],
            pageSize: 50
        };

        return request("http://1kgenomes.ga4gh.org/variants/search", {
            data : JSON.stringify(variantSet),
            method : 'post',
            headers: { 'X-Requested-With': null, 'Content-Type': 'application/json' },
            handleAs: "json"
        }).then(function(res) {
            console.log(res);
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
