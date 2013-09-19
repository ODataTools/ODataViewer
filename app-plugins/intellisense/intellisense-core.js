function Intellisense(metadata) {
    this.metadata = metadata;
    this.sets = this.metadata['edmx:Edmx']['edmx:DataServices'].Schema.EntityContainer.EntitySet
    this.types = this.metadata['edmx:Edmx']['edmx:DataServices'].Schema.EntityType;
    this.initSetsType();


    this.lastProperties = [];
    this.queryOps = [{ '@Name': '$filter' }, { '@Name': '$expand' }, { '@Name': '$select' }, { '@Name': '$orderby' },
					 { '@Name': '$top' }, { '@Name': '$skip' }, { '@Name': '$inlinecount' }, { '@Name': '$format' }];
    this.queryLogicalOps = [{ '@Name': 'eq' }, { '@Name': 'ne' }, { '@Name': 'gt' }, { '@Name': 'ge' }, { '@Name': 'lt' },
							{ '@Name': 'le' }, { '@Name': 'and' }, { '@Name': 'or' }, { '@Name': 'not' }];
    this.queryArithmaticOps = [{ '@Name': 'add' }, { '@Name': 'sub' }, { '@Name': 'mul' }, { '@Name': 'div' }, { '@Name': 'mod' }];
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
 * 
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
 * 
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
        if (arr[i]['@Name'] && arr[i]['@Name'].toLowerCase().indexOf(str.toLowerCase()) == 0) {
            retVal.push(arr[i]);
        }
    }
    return retVal;
};

/**
 * 
 */
Intellisense.prototype.getExpectedType = function (parts) {

    if (this.getIndexByName(this.sets, parts[0].split('(')[0]) == -1) {
        return [];
    }

    var setIndex = this.getIndexByName(this.sets, parts[0].split('(')[0]);
    var type = this.getTypeIndex(setIndex);
    var properties = this.getTypeProperties(type);
    var propertyIndex = -1;
    var selecting = false;

    for (var i = 1; i < parts.length - 1; i++) {
        propertyIndex = this.getIndexByName(properties, parts[i].split('(')[0]);
        if (propertyIndex < 0) {
            return [];
        }
        selecting = (parts[i - 1].split('(').length > 1) ? true : false;
        if (selecting && properties[propertyIndex].Type == 'NavigationProperty') {
            set = properties[propertyIndex]['@ToRole'];
            setIndex = this.getIndexByName(this.sets, set);
            type = this.getTypeIndex(setIndex);
            properties = this.getTypeProperties(type);
        } else {
            return [];
        }

    }

    return properties;
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
        return this.getIntellisenseFromArr(parts[0], this.sets);
    }

    this.lastProperties = this.getExpectedType(parts);
    return this.getIntellisenseFromArr(parts[parts.length - 1], this.lastProperties);
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

    //TODO move to it's own method
    var last = parts[1].split(/\s+/).pop();
    return this.getIntellisenseFromArr(last, this.queryLogicalOps.concat(this.queryArithmaticOps, this.lastProperties));
};

/**
 * Get the intellisense for given string.
 * 
 * @param {string} str
 * @returns {Array} the intellisense array for str.
 */
Intellisense.prototype.getIntellisense = function (str) {

    if (str === undefined)
        return [];


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
    var parts = str.split('?');

    if (parts.length == 1) {
        return addIntel(str, intel, '/');
    }

    var lastQuery = parts[1].split('&').pop();
    var queryParts = lastQuery.split('=');

    if (queryParts.length == 1) {
        return parts[0] + '?' + addIntel(parts[1], intel, '&');
    }

    lastQueryArr = lastQuery.split('=');

    return parts[0] + '?' + parts[1].join('&') + '&' + lastQueryArr[0] + '=' + addIntel(lastQueryArr[1], intel, ' ');
}

function addIntel(str, intel, sep) {
    var tmp = (sep === ' ') ? str.split(/\s+/) : str.split(sep);
    tmp.pop();
    tmp.push(intel);
    return tmp.join(sep);
}