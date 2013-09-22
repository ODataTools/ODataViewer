app.service("DataManager", function ($http) {


    function convertToTableJson(rss) {

        // init
        items = rss;

        var array1 = [];

        for (i = 0; i < items.d.length; i++) {
            array1[i] = $.map(items.d[i], function (k, v) {
                return [k];
            });

        }

        var array2 = [];

        for (i = 0; i < items.d.length; i++) {
            array2[i] = $.map(items.d[i], function (m, n) {
                return [n];
            });

        }

        var arrayjson = [i];
        for (j = 0; j < i; j++) {
            arrayjson[j] = {};
        }

        for (j = 0; j < i; j++) {
            for (l = 0; l < array1[j].length; l++) {
                if (typeof array1[j][l] != "object") {
                    arrayjson[j][array2[j][l]] = array1[j][l];
                }
            }
        }

        return arrayjson;
    }

    function getData(url) {

        if (url.indexOf("?") == -1)
            url += "?$format=json";
        else
            url += "&$format=json";

        return $http.get(url, { headers: { 'Accept': "*/*" } });
    }

    return {
        getData: getData
    }
});
