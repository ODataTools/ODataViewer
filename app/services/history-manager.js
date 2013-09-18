
app.service("HistoryManager", function () {

    Array.prototype.pushUnique = function (item) {
        if (this.indexOf(item) == -1) {
            this.push(item);
            return true;
        }

        return false;
    }

    function addLink(url) {
        var links = getLinks();
        links.pushUnique(url);
        localStorage["ODataLinks"] = JSON.stringify(links);
    }

    function getLinks() {
        return JSON.parse(localStorage["ODataLinks"] || '[]');
    }

    return {
        getLinks: getLinks,
        addLink: addLink
    }
});
