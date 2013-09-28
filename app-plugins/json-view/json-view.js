

angular.module('Plugins').directive('jsonView', function () {

    return {
        restrict: 'A',
        scope: {
            model: '=',
        },
        link: function (scope, element, attr, controller) {

            $(element).attr('id', "jsonviewer");

            scope.$watch('model', function () {

                $(element).html('');

                if (scope.model)
                    $("#jsonviewer").JSONView(scope.model);
            });
        }
    }
});
