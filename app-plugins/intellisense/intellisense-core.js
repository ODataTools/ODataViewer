function Intellisense(metadata) {
    this.metadata = metadata;

    var schema = this.metadata['edmx:Edmx']['edmx:DataServices'].Schema;

    if (schema instanceof Array) {
        this.sets = schema[1].EntityContainer.EntitySet
        this.types = schema[0].EntityType;
    } else {
        this.sets = schema.EntityContainer.EntitySet
        this.types = schema.EntityType;
    }

    this.initSetsType();

    this.lastProperties = [];
    this.queryOps = [{ '@Name': '$filter' }, { '@Name': '$expand' }, { '@Name': '$select' }, { '@Name': '$orderby' },
					 { '@Name': '$top' }, { '@Name': '$skip' }, { '@Name': '$skiptoken' }, { '@Name': '$inlinecount' }, { '@Name': '$format' }];
    this.queryLogicalOps = [{ '@Name': 'eq' }, { '@Name': 'ne' }, { '@Name': 'gt' }, { '@Name': 'ge' }, { '@Name': 'lt' },
							{ '@Name': 'le' }, { '@Name': 'and' }, { '@Name': 'or' }, { '@Name': 'not' }];
    this.queryArithmaticOps = [{ '@Name': 'add' }, { '@Name': 'sub' }, { '@Name': 'mul' }, { '@Name': 'div' }, { '@Name': 'mod' }];
    this.formatOps = [{ '@Name': 'json' }, { '@Name': 'xml' }, { '@Name': 'atom' }];
    this.inlinecountOps = [{ '@Name': 'allpages' }, { '@Name': 'none' }];
    this.orderbyOps = [{ '@Name': 'asc' }, { '@Name': 'desc' }];
}

/**
 * Get the Index of the array that it's @Name property equals to a given string name
 * 
 * @private
 * @param {Array} arr the array to search.
 * @param {string} name the string to search for.
 * @returns {number} the index of the array if found , -1 else. 
 */
Intellisense.prototype.getIndexByName = function (arr, name) {
    var i = 0;
    for (i; i < arr.length; i++) {
        if (arr[i]['@Name'] === name) {
            return i;
        }
    }
    return -1;
};


/**
*
*/
Intellisense.prototype.initSetsType = function () {
    for (var i = 0; i < this.sets.length; i++) {
        this.sets[i]['type'] = 'Entity';
    }
};


/**
 * put the given properties with a given type in the given array arr
 * 
 * @private
 * @param {Array} the array to append the results to.
 * @param {number} typeIndex the index of the type to return it's properties.
 * @param {string} ptype the property type.
 */
Intellisense.prototype.getPropertiesByPType = function (arr, typeIndex, pType) {
    var properties = [];
    var arrObj = {};

    properties = this.types[typeIndex][pType];

    if (Array.isArray(properties)) {
        for (var p in properties) {
            arrObj = properties[p];
            arrObj.type = pType;
            arr.push(arrObj);
        }
    } else if (properties) {
        arrObj = properties;
        arrObj.type = pType;
        arr.push(arrObj);
    }
};

/**
 * Get the properties of given entity type.
 * 
 * @private
 * @param {number} typeIndex the index of the type to return it's properties
 * @returns the properties of the given type.
 */
Intellisense.prototype.getTypeProperties = function (typeIndex) {
    var retVal = [];
    this.getPropertiesByPType(retVal, typeIndex, 'Property');
    this.getPropertiesByPType(retVal, typeIndex, 'NavigationProperty');
    return retVal;
};

/**
 * Get the EntityType included in EntitySet
 * 
 * @private
 * @param {number} setIndex the EntitySet index
 * @returns {number} the index of the EntityType -1 else
 */
Intellisense.prototype.getTypeIndex = function (setIndex) {
    var type = this.sets[setIndex]['@EntityType'].split('.').pop();
    return this.getIndexByName(this.types, type);
};

/**
 * Get the Intellisense for the given str from array of possible word complitions.
 * 
 * @private
 * @param {string} str the partial string to complete.
 * @param {Array} arr possible Intellisense to chose from.
 * @returns {Array} array of the strings that complete str. 
 */
Intellisense.prototype.getIntellisenseFromArr = function (str, arr) {
    var retVal = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i]['@Name'] && arr[i]['@Name'].toLowerCase().indexOf(str.toLowerCase()) == 0 && arr[i]['@Name'] !== str) {
            retVal.push(arr[i]);
        }
    }
    return retVal;
};

/**
 * Get the properties possible for the url path
 * 
 * @private
 * @param {Array} parts an array of the url componenets.
 * @param {properties} the properties that the url start with.
 * @returns {Array} properties possible for the url path
 */
Intellisense.prototype.getExpectedType = function (parts, properties) {
    var retVal = properties;
    var type = -1;
    var setIndex = -1;
    var set = '';
    var selecting = (parts[0].split('(').length > 1) ? true : false;
    if (!selecting) {
        return [];
    }
    propertyIndex = -1;


    for (var i = 1; i < parts.length - 1; i++) {
        propertyIndex = this.getIndexByName(retVal, parts[i].split('(')[0]);
        if (propertyIndex < 0) {
            return [];
        }
        //selecting = (parts[i - 1].split('(').length > 1) ? true : false;
        //if (selecting && retVal[propertyIndex].type == 'NavigationProperty') {
        selecting = (parts[i].split('(').length > 1) ? true : false;
        if (selecting) {
            //set = retVal[propertyIndex]['@ToRole'];
            //setIndex = this.getIndexByName(this.sets, set);
            //type = this.getTypeIndex(setIndex);
            type = this.getIndexByName(this.types, parts[i].split('(')[0]);
            retVal = this.getTypeProperties(type);
        } else {
            return [];
        }
    }
    return retVal;
};

/**
 * Get the intellisense for the resource path part of the url
 * 
 * @private
 * @param {string} resource the current resource path
 * @returns {Array} the intellisense array for str.
 */
Intellisense.prototype.getResourceIntellisense = function (resource) {
    var parts = resource.split('/');

    if (parts.length == 1) {
        //quick solution to move to its own method when done
        for (var i = 0; i < this.sets.length; i++) {
            if (parts[0] == this.sets[i]['@Name']) {
                var type = this.getTypeIndex(i);
                var properties = this.getTypeProperties(type);
                this.lastProperties = this.getTypeProperties(type);
                return [{ '@Name': '/' }, { '@Name': '(' }, { '@Name': '?' }];
            }
        }

        return this.getIntellisenseFromArr(parts[0], this.sets);
    }

    var setIndex = this.getIndexByName(this.sets, parts[0].split('(')[0]);
    if (setIndex == -1) {
        return [];
    }

    var type = this.getTypeIndex(setIndex);
    var properties = this.getTypeProperties(type);
    this.lastProperties = this.getExpectedType(parts, properties);

    //quick solution to move to its own method when done
    for (var i = 0; i < this.lastProperties.length; i++) {
        if (parts[parts.length - 1] == this.lastProperties[i]['@Name']) {
            return [{ '@Name': '/' }, { '@Name': '(' }, { '@Name': '?' }];
        }
    }

    return this.getIntellisenseFromArr(parts[parts.length - 1], this.lastProperties);
};

/**
 * Get the intellisense for the select query option
 * 
 * @private
 * @param {string} query the query passed to the select option
 * @returns {Array} the possible Inetellisense.
 */
Intellisense.prototype.getSelectIntellisense = function (query) {
    var last = query.split(',').pop();
    var parts = last.split('/');
    var expected = -1;

    if (parts.length == 1) {
        return this.getIntellisenseFromArr(parts[0], this.lastProperties);
    }

    expected = this.getExpectedType(parts, this.lastProperties);
    return this.getIntellisenseFromArr(parts[parts.length - 1], expected);
};

/**
 * Get the navigation properties from an array of properties
 * 
 * @private
 * @param {Array} arr an array of properties
 * @returns {Array} the navigation properties found in arr.
 */
Intellisense.prototype.getNavs = function (arr) {
    var navs = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].type == 'NavigationProperty') {
            navs.push(arr[i]);
        }
    }
    return navs;
};

/**
 * Get the intellisense for the expand query option
 * 
 * @private
 * @param {string} query the query passed to the expand option
 * @returns {Array} the possible Inetellisense.
 */
Intellisense.prototype.getExpandIntellisense = function (query) {
    var last = query.split(',').pop();
    var parts = last.split('/');
    var expected = -1;

    if (parts.length == 1) {
        return this.getIntellisenseFromArr(parts[0], this.getNavs(this.lastProperties));
    }

    expected = this.getExpectedType(parts, this.lastProperties);
    return this.getIntellisenseFromArr(parts[parts.length - 1], this.getNavs(expected));
};

/**
 * Get the intellisense for the filter query option
 * 
 * @private
 * @param {string} query the query passed to the filter option
 * @returns {Array} the possible Inetellisense.
 */
Intellisense.prototype.getFilterIntellisense = function (query) {
    var last = query.split(/\s+/).pop();
    return this.getIntellisenseFromArr(last, this.lastProperties.concat(this.queryArithmaticOps, this.queryLogicalOps));
}

/**
 * Get the intellisense for the orderby query option
 * 
 * @private
 * @param {string} query the query passed to the orderby option
 * @returns {Array} the possible Inetellisense.
 */
Intellisense.prototype.getOrderbyIntellisense = function (query) {
    var last = query.split(',').pop();
    var parts = last.trimLeft().split(/\s+/);
    if (parts.length == 1) {
        return this.getIntellisenseFromArr(parts[0], this.lastProperties);
    }
    if (parts.length == 2) {
        return this.getIntellisenseFromArr(parts[1], this.orderbyOps);
    }
    return [];
};

/**
 * Get the intellisense by the query options.
 * 
 * @private
 * @param {string} queryOp the query option passed from the url
 * @param {string} query the query passed to the query option from the url
 * @returns {Array} the possible Inetellisense.
 */
Intellisense.prototype.getQueryOpIntellisense = function (queryOp, query) {
    switch (queryOp) {
        case "$filter":
            return this.getFilterIntellisense(query);
        case "$expand":
            return this.getExpandIntellisense(query);
        case "$select":
            return this.getSelectIntellisense(query);
        case "$orderby":
            return this.getOrderbyIntellisense(query);
        case "$top":
        case "$skip":
        case "$skiptoken":
            return [];
        case "$inlinecount":
            return this.getIntellisenseFromArr(query, this.inlinecountOps);
        case "$format":
            return this.getIntellisenseFromArr(query, this.formatOps);
        default:
            return [];
    }
};

/**
 * Get The Intellisense for the query part of the url.
 * 
 * @private
 * @param {string} query the query part of the url.
 * @returns the intellisense for the given string.
 */
Intellisense.prototype.getQueryIntellisense = function (query) {
    var lastQuery = query.split('&').pop();
    var parts = lastQuery.split('=');
    if (parts.length == 1) {
        return this.getIntellisenseFromArr(parts[0], this.queryOps);
    }

    return this.getQueryOpIntellisense(parts[0], parts[1]);
};

/**
 * Get the intellisense for given string.
 * 
 * @param {string} str
 * @returns {Array} the intellisense array for str.
 */
Intellisense.prototype.getIntellisense = function (str) {
    var parts = str.split('?');
    if (parts.length == 1) {
        return this.getResourceIntellisense(parts[0]);
    }
    if (parts.length == 2) {
        return this.getQueryIntellisense(parts[1]);
    }
    return [];
};

Intellisense.appendSuggestion = function (str, intel) {
    if (intel == '/' || intel == '?'|| intel == '(') {
        return str + intel;
    }

    var parts = str.split('?');

    //resource path part
    if (parts.length == 1) {
        return addIntel(str, intel, '/');
    }

    //query path part
    var pastQueries = parts[1].split('&');
    var lastQuery = pastQueries.pop();
    var queryParts = lastQuery.split('=');

    if (queryParts.length == 1) {
        return parts[0] + '?' + addIntel(parts[1], intel, '&');
    }

    var lastQueryArr = lastQuery.split('=');

    //query option completion
    if (lastQueryArr.length == 1) {
        if (parts[1].length > 0) {
            return addIntel(str,intel,'&');
        }
        return addIntel(str, intel, '?');
    }

    //query completion
    //select and expand
    var past = (pastQueries.length > 0) ? pastQueries.join('&') + '&' : '';
    if (lastQueryArr[0] == '$select' || lastQueryArr[0] == '$expand') {
        return parts[0] + '?' + past + lastQueryArr[0] + '=' + addIntel(lastQueryArr[1], intel, ',');
    }

    //the remaining queries
    return parts[0] + '?' + past + lastQueryArr[0] + '=' + addIntel(lastQueryArr[1], intel, ' ');
}

function addIntel(str, intel, sep) {
    var tmp = (sep === ' ') ? str.split(/\s+/) : str.split(sep);
    tmp.pop();
    tmp.push(intel);
    return tmp.join(sep);
}
