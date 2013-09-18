


app.directive("progressbar", function () {
    return {
        restrict: "E",
        template: "<div class='progressbar'><div class='progress'></label><div><label class='percentage'></div>",
        replace: true,
        scope: {
            progress: '@'
        },
        link: function (scope, element, attrs) {
            scope.$watch(function () { return scope.progress; }, function (newValue, oldValue) {
                var per = (newValue * 100);
                $(element).children('.progress').css('width', per + '%');
                $(element).find('.percentage').html(per.toFixed(2) + '%');

                //if (per >= 100) {
                //    $(element).addClass('done');
                //}
            });
        }
    };
});