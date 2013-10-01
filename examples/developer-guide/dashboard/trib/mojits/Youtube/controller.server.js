/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/
YUI.add('Youtube', function (Y, NAME) {

/**
 * The Youtube module.
 *
 * @module Youtube
 */
    var youtubeMap = function (ac, data) {
        if(data.error || data == null) {
            return data;
        }
        Y.log("youtube: youtubeMap called");
        Y.log("youtube: data");
        Y.log(data);
        var res = [];

        Y.Array.each(data, function (itm, idx, arr) {
            Y.log(itm);
            var title = itm.title,
                id = itm.id.split("http://gdata.youtube.com/feeds/base/videos/")[1];
            //Y.log("youtubevid id:" + id);
            res[idx] = {
                title: title,
                id: id
            };
        });
        return res;
    };
    /**
     * Constructor for the Controller class.
     *
     * @class Controller
     * @constructor
     */
    Y.namespace('mojito.controllers')[NAME] = {

        /**
         * Method corresponding to the 'index' action.
         *
         * @param ac {Object} The ActionContext that provides access
         *        to the Mojito API.
         */
        index: function (ac) {
            ac.models.get('YoutubeModelYQL').getData({}, function (data) {
                Y.log("Youtube controller.server.js -index - model.getData:");
                Y.log(data);
                var res = [], title = "YUI YouTube Videos";

                Y.log("youtubmojit results:");
                Y.log(res);
                if (data.error) {
                    // Found errors: render `error` template.
                    ac.done({
                        title: title,
                        results: data 
                    }, "error");
                } else {
                    // Create data structure from Web service response.
                    res = youtubeMap(ac, data);
                    // Populate and render template.
                    ac.done({
                        title: title,
                        results: res
                    });
                }
            });
        }
    };
}, '0.0.1', {requires: ['mojito', 'mojito-assets-addon', 'mojito-models-addon', 'YoutubeModelYQL']});
