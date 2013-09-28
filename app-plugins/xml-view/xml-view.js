﻿

angular.module('Plugins').directive('xmlView', function () {

    return {
        restrict: 'A',
        scope: {
            model: '=',
        },
        link: function (scope, element, attr, controller) {

            $(element).attr('id', "xmlviewer");

            scope.$watch('model', function () {

                $(element).html('');

                if (scope.model) {
                    var tmp = new XMLTree({
                        xml: scope.model,
                        container: '#xmlviewer',
                        noURLTracking: false,
                        startExpanded: true
                    });
                }
            });
        }
    }
});
