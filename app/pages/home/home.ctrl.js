
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

    $scope.historyLinks = HistoryManager.getLinks();
    $scope.sampleLinks = [
        "http://services.odata.org/V3/OData/OData.svc",
        "http://services.odata.org/V3/Northwind/Northwind.svc"
    ];

    $scope.currentLink;
    $scope.metadata;
    $scope.jsonData;
    $scope.xmlData;
    $scope.dataViewType = 'json';

    $scope.team = [
        {
            //<a href='http://dataservicestool.codeplex.com/'></a>
            name: "Eyal Vardi (Mentor)",
            photoUrl: "resources/photos/color/eyal.jpg",
            linkedin: "http://www.linkedin.com/profile/view?id=18109570",
            description: "Eyal has a windows based application for viewing OData, and he came up with the idea of making a web-based application for helping developers using OData.<br />Eyal mentored the project and helped the team with several technical issues."
        },
        {
            name: "Hasan Abo-Shally",
            photoUrl: "resources/photos/color/hasan.jpg",
            linkedin: "http://www.linkedin.com/profile/view?id=183930974",
            description: "Hasan led the team developing the project.<br />He worked on the application's structure, the user interface, and the integration of the addons into the tool."
        },
        {
            name: "Ghassan Fadila",
            photoUrl: "resources/photos/color/ghassan.jpg",
            //linkedin: "http://www.linkedin.com/pub/hakam-kittany/26/930/128",
            description: "Ghassan worked on the intellisense plugin that provided suggestions for the auto complete feature based on the given url, he also helped other team members with their work."
        },
        {
            name: "Hakam Kittany",
            photoUrl: "resources/photos/color/hakam.jpg",
            linkedin: "http://www.linkedin.com/pub/hakam-kittany/26/930/128",
            description: "Hakam worked on the tree and entity-graph plugins for displaying the meta-data, and wrapped them into AngularJS directives."
        }
        ,
        {
            name: "Mohammad Abu Shah",
            photoUrl: "resources/photos/color/shah.jpg",
            //linkedin: "http://www.linkedin.com/pub/hakam-kittany/26/930/128",
            description: "Mohammad worked on the testing of the intellisense plugin."
        }
    ];


    $scope.isSelectedLink = function (link) {
        return (link === $scope.currentLink);
    }

    $scope.showSettings = function () {
        if (snapper.state().state == "left")
            snapper.close();
        else
            snapper.open('left');
    }

    $scope.showMetaData = function () {
        if (snapper.state().state == "right")
            snapper.close();
        else
            snapper.open('right');
    }

    $scope.changeDataUrl = function (url) {
        $scope.currentLink = url;

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

    }

    $scope.removeHistoryLink = function (url) {
        HistoryManager.removeLink(url);
    }

    $scope.loadData = function () {

        var query = $scope.intellisenseQuery || '';
        var url = $scope.currentLink + "/" + query;

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
        $scope.loadData();
    }


    $scope.gridOptions = {
        data: $scope.jsonData,
        multiSelect: false
    };



    if ($routeParams.url)
        $scope.changeDataUrl($routeParams.url);

    //****************************************************************************************************

    snapper = new Snap({
        element: document.getElementById('content')
    });


    // open the setings pane after the page loads.
    //setTimeout(function () { $scope.showSettings(); }, 1000);

    var tour = new Tour({
    });

    tour.addSteps([
        {
            element: "#settings-btn", // string (jQuery selector) - html element next to which the step popover should be shown
            title: "The Settings Button", // string - title of the popover
            content: "Click here to open the settings panel.", // string - content of the popover
            onNext: function () { $scope.showSettings(); }
        },
        {
            element: "#new-url-input", // string (jQuery selector) - html element next to which the step popover should be shown
            title: "New OData Provider URL", // string - title of the popover
            content: "Enter the url here..", // string - content of the popover
        }
        ,
        {
            element: "#new-url-btn", // string (jQuery selector) - html element next to which the step popover should be shown
            content: "And then click the GO button", // string - content of the popover
            onNext: function () {
                $('#new-url-btn').trigger('click');
            }
        }
        ,
        {
            element: "#intellisense-input", // string (jQuery selector) - html element next to which the step popover should be shown
            title: "The query input", // string - title of the popover
            content: "Start writing queries for the URL you provided. <br/>You can press the <i class='icon-arrow-down'></i> key to show the intellisense suggestions.", // string - content of the popover
            placement: "bottom"
        }
    ]);


    $scope.showHelp = function () {
        tour.goto(0);
        tour.start(true);
    }


    tour.start();
});
