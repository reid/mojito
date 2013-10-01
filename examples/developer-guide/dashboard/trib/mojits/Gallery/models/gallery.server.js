/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/
YUI.add('GalleryModelYQL', function (Y, NAME) {

    Y.mojito.models[NAME] = {
        init: function (config) {
            this.config = config;
        },

        getData: function (params, tablePath, callback) {
            Y.log("gallery getData called");

            if (this._isCached()) {
                callback(Y.galleryData);
            } else {
                var query = "use '{table}' as gallerylogs; select * from gallerylogs",
                    queryParams = {
                        table: tablePath
                    },
                    cookedQuery = Y.Lang.sub(query, queryParams);

                    //Y.log("cookedQuery: " + cookedQuery);
                Y.YQL(cookedQuery, Y.bind(this.onDataReturn, this, callback));
            }
        },

        onDataReturn: function (cb, result) {
            Y.log("onDataReturn called");
            var itemLimit = 10, results = []; 
            if (result.error === undefined) {

                Y.log("gallery onDataReturn result:");
                Y.log(result);

                if (result && result.query && result.query.results && result.query.results.json) {
                    results = result.query.results.json;
                    results.json = results.json.slice(0, itemLimit);
                    Y.galleryData = results;
                    Y.galleryCacheTime = new Date().getTime();
                } else {
                    results = new Error({ error: { description: "The returned response was malformed." }}); 
                }

            } else {
                results = result; 
            }
            cb(results);
        },
        _isCached: function() {
            var updateTime = this.config.feedCacheTime * 60 * 1000;
            return Y.calendarData && (new Date().getTime() - Y.calendarCacheTime) < updateTime;
        }
    };


}, '0.0.1', {requires: ['yql', 'substitute']});
