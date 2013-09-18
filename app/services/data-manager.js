﻿app.service("DataManager", function ($http) {


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

        var demoJson = {
            "odata.metadata": "http://services.odata.org/V3/OData/OData.svc/$metadata#Products",
            "value": [
                    {
                        "ID": 0,
                        "Name": "Bread",
                        "Description": "Whole grain bread",
                        "ReleaseDate": "1992-01-01T00:00:00",
                        "DiscontinuedDate": null,
                        "Rating": 4,
                        "Price": "2.5"
                    },
                    {
                        "ID": 1,
                        "Name": "Milk",
                        "Description": "Low fat milk",
                        "ReleaseDate": "1995-10-01T00:00:00",
                        "DiscontinuedDate": null,
                        "Rating": 3,
                        "Price": "3.5"
                    },
                    {
                        "ID": 2,
                        "Name": "Vint soda",
                        "Description": "Americana Variety - Mix of 6 flavors",
                        "ReleaseDate": "2000-10-01T00:00:00",
                        "DiscontinuedDate": null,
                        "Rating": 3,
                        "Price": "20.9"
                    },
                    {
                        "ID": 3,
                        "Name": "Havina Cola",
                        "Description": "The Original Key Lime Cola",
                        "ReleaseDate": "2005-10-01T00:00:00",
                        "DiscontinuedDate": "2006-10-01T00:00:00",
                        "Rating": 3,
                        "Price": "19.9"
                    },
                    {
                        "ID": 4,
                        "Name": "Fruit Punch",
                        "Description": "Mango flavor, 8.3 Ounce Cans (Pack of 24)",
                        "ReleaseDate": "2003-01-05T00:00:00",
                        "DiscontinuedDate": null,
                        "Rating": 3,
                        "Price": "22.99"
                    },
                    {
                        "ID": 5,
                        "Name": "Cranberry Juice",
                        "Description": "16-Ounce Plastic Bottles (Pack of 12)",
                        "ReleaseDate": "2006-08-04T00:00:00",
                        "DiscontinuedDate": null,
                        "Rating": 3,
                        "Price": "22.8"
                    },
                    {
                        "ID": 6,
                        "Name": "Pink Lemonade",
                        "Description": "36 Ounce Cans (Pack of 3)",
                        "ReleaseDate": "2006-11-05T00:00:00",
                        "DiscontinuedDate": null,
                        "Rating": 3,
                        "Price": "18.8"
                    },
                    {
                        "ID": 7,
                        "Name": "DVD Player",
                        "Description": "1080P Upconversion DVD Player",
                        "ReleaseDate": "2006-11-15T00:00:00",
                        "DiscontinuedDate": null,
                        "Rating": 3,
                        "Price": "35.88"
                    },
                    {
                        "ID": 8,
                        "Name": "LCD HDTV",
                        "Description": "42 inch 1080p LCD with Built-in Blu-ray Disc Player",
                        "ReleaseDate": "2008-05-08T00:00:00",
                        "DiscontinuedDate": null,
                        "Rating": 3,
                        "Price": "1088.8"
                    },
                    {
                        "odata.type": "ODataDemo.FeaturedProduct",
                        "ID": 9,
                        "Name": "Lemonade",
                        "Description": "Classic, refreshing lemonade (Single bottle)",
                        "ReleaseDate": "1970-01-01T00:00:00",
                        "DiscontinuedDate": null,
                        "Rating": 7,
                        "Price": "1.01"
                    },
                    {
                        "odata.type": "ODataDemo.FeaturedProduct",
                        "ID": 10,
                        "Name": "Coffee",
                        "Description": "Bulk size can of instant coffee",
                        "ReleaseDate": "1982-12-31T00:00:00",
                        "DiscontinuedDate": null,
                        "Rating": 1,
                        "Price": "6.99"
                    }
            ]
        }

        return demoJson;
    }

    return {
        getData: getData
    }
});