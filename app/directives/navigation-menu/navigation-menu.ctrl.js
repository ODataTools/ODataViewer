
app.directive('navigationMenu', function ($location) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            var menu = $(elm);

            var links = menu.children();
            var linksMap = {};
            links.each(function (index, link) {
                //substring(2) to remove the '#/' from the path.
                linksMap[$(link).find('a').attr('href').substring(2)] = $(link);
            });

            scope.$watch(function () { return $location.path() }, function (newPath, oldPath) {
                links.removeClass('active');
                //substring(1) to remove the '/' from the path.

                var e = linksMap[newPath.substring(1)];
                if (e)
                    e.addClass("active");
            });
        }
    }
});

