app.directive("scriptRunner", function () {
    return {
        restrict: "A",
        template: "",
        replace: true,
        link: function (scope, element, attrs) {
            (new Function(element.html()))();
        }
    };
});