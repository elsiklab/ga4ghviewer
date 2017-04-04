define([
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/request',
    'JBrowse/Store/SeqFeature',
    'JBrowse/Model/SimpleFeature'
],
function(
    declare,
    array,
    lang,
    request,
    SeqFeature,
    SimpleFeature
) {
    return declare(SeqFeature, {
        getFeatures: function(query, featureCallback, finishCallback, errorCallback) {
            var thisB = this;
            var ref = query.ref.replace(/chr/, '');
            var variantSet = {
                start: query.start,
                end: query.end,
                referenceName: ref,
                callSetIds: this.config.callSetIds || [],
                pageSize: 100
            };
            if(this.config.google) {
                variantSet.variantSetIds = [this.config.variantSetId];
            } else {
                variantSet.variantSetId = this.config.variantSetId;
            }

            function fetch(data) {
                return request(thisB.config.urlTemplate+'/variants/search'+(thisB.config.apiKey||''), {
                    data: JSON.stringify(data),
                    method: 'post',
                    headers: { 'X-Requested-With': null, 'Content-Type': 'application/json' },
                    handleAs: 'json'
                }).then(function(res) {
                    array.forEach(res.variants, function(variant) {
                        variant.genotypes = {};

                        for (var i = 0; i < variant.calls.length; i++) {
                            variant.genotypes[variant.calls[i].callSetName] = {
                                GT: {
                                    values: [
                                        variant.calls[i].genotype.join('/')
                                    ]
                                }
                            };
                        }
                        array.forEach(Object.keys(variant.info), function(elt) {
                            if(!variant.info[elt][0]) {
                                delete variant.info[elt];
                            } else {
                                variant.info[elt] = variant.info[elt][0];
                            }
                        });

                        featureCallback(new SimpleFeature({
                            id: variant.id,
                            data: {
                                start: +variant.start,
                                end: +variant.end,
                                name: variant.id,
                                info: variant.info,
                                genotypes: variant.genotypes,
                                type: 'SNV'
                            }
                        }));
                    });
                    if (res.nextPageToken) {
                        fetch(lang.mixin(data, { pageToken: res.nextPageToken }));
                    } else {
                        finishCallback();
                    }
                }, function(err) {
                    errorCallback('Error contacting GA4GH');
                });
            }
            fetch(variantSet);
        },
        getVCFHeader: function() {
            var thisB = this;
            
            var init = {
                variantSetId: this.config.variantSetId,
                callSetIds: this.config.callSetIds,
                pageSize: 5000
            };
            var callset = [];

            function fetch(data) {
                return request(thisB.config.urlTemplate+'/callsets/search', {
                    headers: { 'X-Requested-With': null, 'Content-Type': 'application/json' },
                    data: JSON.stringify(data),
                    handleAs: 'json',
                    method: 'post'
                }).then(function(res) {
                    var r = array.map(res.callSets, function(elt) { return elt.name; });
                    callset = callset.concat(r);
                    if (res.nextPageToken) {
                        return fetch(lang.mixin(data, { pageToken: res.nextPageToken }));
                    } else {
                        return {samples: callset};
                    }
                }, function(err) {
                    console.error(err);
                    return {error: 'Error contacting GA4GH'};
                });
            }
            return fetch(init);
        }
    });
});
