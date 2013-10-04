
app.controller("HomeCtrl", function ($scope, $http, $routeParams, HistoryManager, MetaDataManager, DataManager) {

    $scope.$safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof (fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };


    //*****************************************************
    $scope.currentUrl;
    $scope.metadata;
    $scope.jsonData;
    $scope.xmlData;
    $scope.dataViewType = 'json';
    //  $scope.isShowIntellisenseSuggestions = true;
    $scope.historyLinks = HistoryManager.getLinks();

    $scope.gridOptions = {
        data: $scope.jsonData,
        multiSelect: false
    };


    $scope.sampleLinks = [
        "http://services.odata.org/V3/OData/OData.svc",
        "http://services.odata.org/V3/Northwind/Northwind.svc"
    ];

    $scope.team = [
        {
            name: "Hasan Abo-Shally (Team Leader)",
            photoUrl: "resources/photos/color/hasan.jpg",
            linkedin: "http://www.linkedin.com/profile/view?id=183930974",
            description: "Hasan led the team developing the project.<br />He worked on the application's structure, the user interface, integrating the addons into the tool, and some other stuff."
        },
        //{
        //    name: "Ghassan Fadila",
        //    photoUrl: "resources/photos/color/ghassan.jpg",
        //    //linkedin: "http://www.linkedin.com/pub/hakam-kittany/26/930/128",
        //    description: "Ghassan worked on the intellisense plugin that provided suggestions for the auto complete feature based on the given url, he also helped other team members with their work."
        //},
        {
            name: "Hakam Kittany",
            photoUrl: "resources/photos/color/hakam.jpg",
            linkedin: "http://www.linkedin.com/pub/hakam-kittany/26/930/128",
            description: "Hakam worked on the tree and entity-graph plugins for displaying the meta-data, and wrapped them into AngularJS directives."
        },
        {
            name: "Haytham Biadse",
            photoUrl: "resources/photos/color/haytham.jpg",
            linkedin: "http://il.linkedin.com/pub/haytham-biadse/12/154/230/",
            description: "Haytham worked on the <a href='http://gallery.odatatools.org'>Odata Gallery</a> server side, the server is built with NodeJS and uses MongoDB to store data."
        }
        //,
        //{
        //    name: "Mohammad Abu Shah",
        //    photoUrl: "resources/photos/color/shah.jpg",
        //    //linkedin: "http://www.linkedin.com/pub/hakam-kittany/26/930/128",
        //    description: "Mohammad worked on the testing of the intellisense plugin."
        //}
    ];

    $scope.mentors = [
        {
            //<a href='http://dataservicestool.codeplex.com/'></a>
            name: "Eyal Vardi (Mentor-E4D)",
            photoUrl: "resources/photos/color/eyal.jpg",
            linkedin: "http://www.linkedin.com/profile/view?id=18109570",
            // description: "Eyal has a windows based application for viewing OData, and he came up with the idea of making a web-based application for helping developers using OData.<br />Eyal mentored the project and helped the team with several technical issues."
            description: "Eyal <strong>came up with the idea</strong>, he mentored the project and helped the team with several technical issues."

        },
        {
            name: "Shalom Weiss (Mentor-Tsofen)",
            photoUrl: "resources/photos/color/shalom.jpg",
            linkedin: "il.linkedin.com/pub/shalom-weiss/1/754/b76/",
            description: "Shalom was the admenstrative mentor, he made sure everything goes well, and also helped with testing the tool."
        }
    ]


    $scope.isSelectedLink = function (link) {
        return (link === $scope.currentUrl);
    }

    $scope.showMetaData = function () {
        if (snapper.state().state == "left")
            snapper.close();
        else
            snapper.open('left');
    }

    $scope.changeDataUrl = function (url) {
        $scope.currentUrl = url;

        // Remove the trailing slash (if exists) from the url. 
        if (url.substr(-1) == '/')
            url = url.substr(0, url.length - 1);

        // Save the link to history
        HistoryManager.addLink(url);

        MetaDataManager.setFromUrl(url).then(function () {
            $scope.metadata = MetaDataManager.getJSON();
            $scope.jsonData = [];
            snapper.close();
            $('#intellisense-input').focus();


        });

        tour.goto(1);
    }

    $scope.removeHistoryLink = function (url) {
        HistoryManager.removeLink(url);
    }

    $scope.loadData = function () {

        var query = $scope.intellisenseQuery || '';
        var url = $scope.currentUrl + "/" + query;

        var isXml = $scope.dataViewType == "xml";

        DataManager.getData(url, isXml).then(function (result) {
            $scope.$safeApply(function () {
                if (isXml)
                    $scope.xmlData = result.data;
                else
                    $scope.jsonData = result.data;
            });
        });
    }

    $scope.onIntellisenseSubmit = function (query) {
        //  isShowIntellisenseSuggestions = false;

        //  $('#intellisense-suggestions').css('display',"none");  -- not working
        $scope.loadData();
    }

    $scope.setNewOdataUrl = function (url) {
        $scope.newOdataUrl = url;
    }




    $scope.$watch('dataViewType', function (newVal, oldVal) {
        if ($scope.currentUrl)
            $scope.loadData();
    });
    
    //****************************************************************************************************
    // TODO: put code in service/directive
    
     $scope.GoTo = function (row, clickedColl) {
        $scope.intellisenseQuery += "(" + row.entity.ID + ")/" + clickedColl;
        $scope.loadData();
    }
    function buildColumns(associationArray) {
        var result = [];
        if (!$scope.jsonData)
            return;
        var obj;
        if ($scope.jsonData.value)
            obj = $scope.jsonData.value[0];
        else
            obj = $scope.jsonData;

        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                result.push({ field: k.toString(), displayName: k.toString() });
            }
        }
        for (var i = 0; i < associationArray.length; i++) {
            var t = associationArray[i].toString();
            var ob = '<button ng-click="GoTo(row, \'' + t.toString() + '\')">Go</button>';
            result.push({ field: associationArray[i].toString(), displayName: associationArray[i].toString(), cellTemplate: ob });
        }



        return result;
    }

    function getAssociations() {
        if (!getCurrentCollection())
            return;
        var schema = $scope.metadata["edmx:Edmx"]["edmx:DataServices"]["Schema"];
        var coll = getSingularNameFromPlural(getCurrentCollection());
        if (!coll)
            coll = getCurrentCollection();
        var resultArray = [];
        if (schema instanceof Array) {
            schema = schema[0];
        }
        var association = schema.Association;
        for (var i = 0; i < association.length; i++) {
            if (association[i]['End'][0]['@Type'].split('.')[1] === coll) {
                resultArray.push(association[i]['End'][1]['@Type'].split('.')[1]);
            }
            else {
                if (association[i]['End'][1]['@Type'].split('.')[1] === coll) {
                    resultArray.push(association[i]['End'][0]['@Type'].split('.')[1]);
                }
            }
        }
        return resultArray;
    }

    function getCurrentCollection() {
        var arr = $scope.intellisenseQuery.split("/");
        return arr[arr.length - 1].split("(")[0];
    }

    function getSingularNameFromPlural(pluralName) {
        var schema = $scope.metadata["edmx:Edmx"]["edmx:DataServices"]["Schema"];

        if (schema instanceof Array) {
            for (var i = 0; i < schema.length; i++) {
                if (schema[i].EntityContainer && schema[i].EntityContainer.EntitySet) {
                    schema = schema[i];
                    break;
                }
            }
        }

        for (var i = 0; i < schema.EntityContainer.EntitySet.length; i++) {
            if (schema.EntityContainer.EntitySet[i]["@Name"] === pluralName) {
                return schema.EntityContainer.EntitySet[i]["@EntityType"].split('.')[1];
            }
        }
    }


    function getPluralNameFromSingular(singularName) {
        var schema = $scope.metadata["edmx:Edmx"]["edmx:DataServices"]["Schema"];
        if (schema instanceof Array) {
            schema = schema[0];
        }
        for (var i = 0; i < schema.EntityContainer.EntitySet.length; i++) {
            if (schema.EntityContainer.EntitySet[i]["@EntityType"].indexOf(singularName) != -1) {
                return schema.EntityContainer.EntitySet[i]["@Name"];
            }
        }
    }

    //****************************************************************************************************

    snapper = new Snap({
        element: document.getElementById('content')
    });


    // open the setings pane after the page loads.
    //setTimeout(function () { $scope.showSettings(); }, 1000);

    var tour = new Tour({
        template: "<div class='popover tour'> \
                       <div class='arrow'></div> \
                        <h3 class='popover-title'></h3>\
                        <div class='popover-content'></div> \
                        <button class='btn-end' data-role='end'>×</button>\
                   </div>"

    });

    tour.addSteps([
        {
            element: "#odata-source-show-modal-btn", // string (jQuery selector) - html element next to which the step popover should be shown
            title: "Welcome!", // string - title of the popover
            content: "Click here to enter the Odata Source Url.<br><br> You may also start with one of our <strong>Sample</strong> urls.", // string - content of the popover
            onNext: function () { $scope.showSettings(); }
        }
        ,
        {
            element: "#intellisense-input", // string (jQuery selector) - html element next to which the step popover should be shown
            title: "The query input", // string - title of the popover
            content: "Start writing queries for the URL you provided. <br/><br/> \
                      You can press the <i class='icon-arrow-down'></i> key to show the intellisense suggestions.<br/><br/> \
                      When your done with the query,<br/>hit <strong>SHIFT</strong> + <strong>RETURN</strong> to view the data.",
            placement: "bottom"
        }
    ]);


    if ($routeParams.url)
        $scope.changeDataUrl($routeParams.url);

    $scope.showHelp = function () {
        tour.goto(0);
        tour.start(true);
    }

    setTimeout(function () {
        tour.goto(0);
        tour.start();
    }, 500);
});
