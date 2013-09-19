

angular.module('Plugins').directive('jsonViewer', function () {

    return {
        restrict: 'A',
        template: '<div id="jsonviewer"></div>',
        scope: {
            model: '=',
        },
        replace: true,
        link: function (scope, iElement, iAttrs, controller) {
            scope.$watch('model', function () {
                if (scope.model)
                    $("#jsonviewer").JSONView(scope.model);
            });
        }
    }
});
