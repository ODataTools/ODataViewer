
// Intellisense Module

angular.module('Plugins').directive('intellisense', function () {

    return {
        restrict: 'E',
        templateUrl: 'app-plugins/intellisense/intellisense-template.html',
        scope: {
            model: '=',
            metadata: '=',
            onSubmit: '&'
        },
        replace: true,
        link: function (scope, iElement, iAttrs, controller) {


            scope.$safeApply = function (fn) {
                var phase = this.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && (typeof (fn) === 'function')) {
                        fn();
                    }
                } else {
                    this.$apply(fn);
                }
            };


            //*****************************************************


            var intellisenseProvider;

            scope.$watch('metadata', function (newVal, oldVal) {
                if (scope.metadata) {
                    intellisenseProvider = new Intellisense(scope.metadata);
                    scope.suggestions = [];
                    scope.selectedSuggestionsIndex = 0;
                    scope.isShowSuggestions = false;
                    scope.model = "";
                }
            });


            var keys = {
                ESC: 27,
                TAB: 9,
                RETURN: 13,
                LEFT: 37,
                UP: 38,
                RIGHT: 39,
                DOWN: 40,
                SPACE: 32,
                SHIFT: 16
            };


            $("#intellisense-input").keydown(function ($event) {

                if (intellisenseProvider) {

                    if (($event.shiftKey && $event.keyCode == keys.RETURN)) {
                        hideSuggestions();

                        scope.$safeApply(function () {
                            scope.onSubmit({ query: scope.model });
                        });

                        return false;
                    }

                    switch ($event.keyCode) {
                        case keys.RETURN: {

                            if (scope.suggestions[scope.selectedSuggestionsIndex]) {
                                var suggestionName = scope.suggestions[scope.selectedSuggestionsIndex]['@Name'];

                                scope.$safeApply(function () {
                                    scope.model = Intellisense.appendSuggestion(scope.model, suggestionName);
                                    showSuggestions(scope.model);
                                });

                            }

                            return false;
                        }
                            break;

                        case keys.UP: {
                            if (scope.selectedSuggestionsIndex > 0)
                                scope.$safeApply(function () {
                                    scope.selectedSuggestionsIndex--;

                                    if (scope.selectedSuggestionsIndex % 4 == 0)
                                        $('#intellisense-suggestions').scrollTo((scope.selectedSuggestionsIndex - 5) * 35, { duration: 250 });
                                });

                            return false;
                        }
                            break;

                        case keys.DOWN: {

                            if (scope.isShowSuggestions) {

                                if (scope.selectedSuggestionsIndex < scope.suggestions.length - 1)
                                    scope.$safeApply(function () {
                                        scope.selectedSuggestionsIndex++;

                                        if (scope.selectedSuggestionsIndex % 4 == 0)
                                            $('#intellisense-suggestions').scrollTo((scope.selectedSuggestionsIndex) * 35, { duration: 250 });
                                    });
                            }
                            else {
                                showSuggestions("");
                            }

                            return false;
                        }
                            break;

                    }

                }
            });

            $("#intellisense-input").keyup(function ($event) {

                if ($event.keyCode == keys.SHIFT || $event.keyCode == keys.RETURN) {
                    return false;
                }

                if (intellisenseProvider) {
                    switch ($event.keyCode) {

                        case keys.UP: { return false; } break;
                        case keys.RIGHT: { return false; } break;
                        case keys.DOWN: { return false; } break;
                        case keys.LEFT: { return false; } break;

                        case keys.ESC: {
                            hideSuggestions();
                            return false;
                        }
                            break;
                        default: {
                            showSuggestions(scope.model);
                        }
                    }
                }
            });


            function showSuggestions(txt) {
                var txtLen = $("#intellisense-input").val().length;
                $("#intellisense-suggestions").css('left', (5 /* 5 is the padding*/ + txtLen * 10) + "px");

                var suggestions = intellisenseProvider.getIntellisense(txt);

                scope.$safeApply(function () {
                    scope.suggestions = suggestions;
                    scope.selectedSuggestionsIndex = 0;
                    scope.isShowSuggestions = true;
                });
            }

            function hideSuggestions() {
                scope.$safeApply(function () {
                    scope.isShowSuggestions = false;
                });
            }

            scope.onSuggestionClick = function (index, suggestion) {
                scope.selectedSuggestionsIndex = index;
                scope.model = Intellisense.appendSuggestion(scope.model, suggestion['@Name']);
                $("#intellisense-input").focus();
            }
        }
    }
});
