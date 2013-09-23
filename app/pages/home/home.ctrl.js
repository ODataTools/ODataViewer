
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

    //****************************************************************************************************

    snapper = new Snap({
        element: document.getElementById('content')
    });


    // open the setings pane after the page loads.
    //setTimeout(function () { $scope.showSettings(); }, 1000);

    if ($routeParams.url)
        $scope.changeDataUrl($routeParams.url);
});
