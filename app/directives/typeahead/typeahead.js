
app.directive("typeahead", function () {
    return {
        restrict: "A",
        templateUrl: "app/directives/typeahead/typeahead.tpl.html",
        replace:true,
        scope: {
            suggestions: '='
        },
        link: function (scope, element, attrs) {

          
        }
    };
});

    
