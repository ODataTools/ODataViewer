
app.service("MetaDataManager", function ($http, $q) {

    var _json;

    function get() {
        return _json;
    }

    function set(xml) {
        _json = JSON.parse(xml2json(xml, ''));
    }

    function setFromUrl(url) {

        url += "/$metadata";

        var p = $q.defer();

        return $http.get(url, { headers: { 'Accept': "*/*" } }).then(function (result) {
            var xmlDoc = (new DOMParser()).parseFromString(result.data, "text/xml");
            set(xmlDoc);
            p.resolve();
        });

        return p.promise;
    }

    return {
        getJSON: get,
        setFromXML: set,
        setFromUrl: setFromUrl
    }
});