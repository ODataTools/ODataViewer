app.service("HistoryManager", function () {
	// Array Remove - By John Resig (MIT Licensed)
	Array.prototype.remove = function(from, to) {
		if(from == -1)
			return;
		var rest = this.slice((to || from) + 1 || this.length);
  		this.length = from < 0 ? this.length + from : from;
  		return this.push.apply(this, rest);
	};

	function pushUnique(arr, item) {
		var i = arr.indexOf(item);
		if (i != -1) {
			arr.remove(i);
		}
		arr.unshift(item);
		return arr;
	}

    	function addLink(url) {
		var links = getLinks();
		links = pushUnique(links,url);
		localStorage["ODataLinks"] = JSON.stringify(links);
    	}

	function removeLink(url){
		var links = getLinks();
		var i = links.indexOf(url);
		links.remove(i);
		localStorage["ODataLinks"] = JSON.stringify(links);
	}

    	function getLinks() {
        	return JSON.parse(localStorage["ODataLinks"] || '[]');
    	}

    	return {
        	getLinks: getLinks,
		addLink: addLink,
		removeLink: removeLink
    	}
});
