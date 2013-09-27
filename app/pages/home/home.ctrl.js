
app.controller("HomeCtrl", function ($scope, $http, $routeParams, HistoryManager, MetaDataManager, DataManager) {

    $scope.historyLinks = HistoryManager.getLinks();
    $scope.currentLink;
    $scope.metadata;
    $scope.jsonData;
    $scope.isLoadingData = false;
    $scope.dataViewType = 'json';

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

        $scope.isLoadingData = true;

        var query = $scope.intellisenseQuery || '';
        var url = $scope.currentLink + "/" + query;

        DataManager.getData(url).then(function (result) {
            $scope.isLoadingData = false;
            $scope.jsonData = result.data;
        });
    }

    $scope.onIntellisenseSubmit = function (query) {
        $scope.loadData();
    }


    $scope.gridOptions = {
        data: 'jsonData.value',
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
