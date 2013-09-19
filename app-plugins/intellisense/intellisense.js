
// Intellisense Module

angular.module('Plugins').directive('intellisense', function () {

    return {
        restrict: 'E',
        templateUrl: '/app-plugins/intellisense/intellisense-template.html',
        scope: {
            model: '=',
            metadata: '='
        },
        replace: true,
        link: function (scope, iElement, iAttrs, controller) {

            scope.suggestions = [];
            scope.selectedSuggestionsIndex = 0;
            scope.isShowSuggestions = false;

            var intellisenseProvider;

            scope.$watch(function () { return scope.metadata }, function (newVal, oldVal) {
                if (scope.metadata) {
                    intellisenseProvider = new Intellisense(scope.metadata);
                    scope.selectedSuggestionsIndex = 0;
                }
            });


            scope.onKeyDown = function ($event) {
                if (intellisenseProvider) {

                    switch ($event.keyCode) {
                        case keys.ESC: {
                            scope.isShowSuggestions = false;
                            return false;
                        }
                            break;
                        case keys.RETURN: {
                            var suggestion = scope.suggestions[scope.selectedSuggestionsIndex]['@Name'];
                            scope.model = Intellisense.appendSuggestion(scope.model, suggestion);

                            scope.isShowSuggestions = false;
                            return false;
                        }
                            break;
                        case keys.SPACE: { return false; }

                            break;
                        case keys.UP: {

                            if (scope.selectedSuggestionsIndex > 0)
                                setSelectedSuggestion(scope.selectedSuggestionsIndex - 1);

                            return false;
                        }
                            break;
                        case keys.DOWN: {

                            if (scope.selectedSuggestionsIndex < scope.suggestions.length - 1)
                                setSelectedSuggestion(scope.selectedSuggestionsIndex + 1);

                            return false;
                        }
                            break;
                        default: {
                            showSuggestions(scope.model);
                        }
                    }
                }
            }



            var keys = {
                ESC: 27,
                TAB: 9,
                RETURN: 13,
                LEFT: 37,
                UP: 38,
                RIGHT: 39,
                DOWN: 40,
                SPACE: 32
            };




            function showSuggestions(txt) {

                var txtLen = $("#intellisense-input").val().length;
                $("#intellisense-suggestions").css('left', (5 /* 5 is the padding*/ + txtLen * 10) + "px");

                scope.isShowSuggestions = true;
                scope.suggestions = intellisenseProvider.getIntellisense(txt);
            }

            function setSelectedSuggestion(indx) {
                scope.selectedSuggestionsIndex = indx;
            }


        }
    }
});
