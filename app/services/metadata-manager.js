
app.service("MetaDataManager", function ($http) {

    var _json;

    function get() {
        return _json;
    }

    function set(xml) {
        _json = JSON.parse(xml2json(xml,''));
    }


    return {
        getJSON: get,
        setFromXML: set
    }
});