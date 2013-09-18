
// Intellisense Module

angular.module('Intellisense').directive('intellisense', function () {

    return {
        restrict: 'E',
        templateUrl: '/app-plugins/intellisense/directive/intellisense-template.html',
        scope: {
            model: '=',
            metadata: '='
        },
        replace: true,
        link: function (scope, iElement, iAttrs, controller) {

            var intellisenseProvider;

            scope.$watch(function () { return scope.metadata }, function (newVal, oldVal) {
                if (scope.metadata) {
                    intellisenseProvider = new Intellisense(scope.metadata);
                    scope.selectedSuggestionsIndex = 0;
                }
            });


            scope.selectedSuggestionsIndex = 0;

            $("#intellisense-input").keyup(function (e) {

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


                function append(str, intel) {
                    var parts = str.split('?');

                    if (parts.length == 1) {
                        return addIntel(str, intel, '/');
                    }

                    var lastQuery = parts[1].split('&').pop();
                    var queryParts = lastQuery.split('=');

                    if (queryParts.length == 1) {
                        return parts[0] + '?' + addIntel(parts[1], intel, '&');
                    }

                    lastQueryArr = lastQuery.split('=');

                    return parts[0] + '?' + parts[1].join('&') + '&' + lastQueryArr[0] + '=' + addIntel(lastQueryArr[1], intel, ' ');
                }

                function addIntel(str, intel, sep) {
                    var tmp = (sep === ' ') ? str.split(/\s+/) : str.split(sep);
                    tmp.pop();
                    tmp.push(intel);
                    return tmp.join(sep);
                }



                function showSuggestions(txt) {

                    if (!$("#intellisense-suggestions").is(":visible")) {
                        $("#intellisense-suggestions").slideDown(100);
                    }

                    var txtLen = $("#intellisense-input").val().length;
                    $("#intellisense-suggestions").css('left', (5 /* 5 is the padding*/ + txtLen * 10) + "px");

                    scope.$apply(function () {
                        scope.suggestions = intellisenseProvider.getIntellisense(txt);
                        console.log(scope.suggestions);
                    });
                }

                function setSelectedSuggestion(indx) {
                    scope.$apply(function () {
                        scope.selectedSuggestionsIndex = indx;
                    });
                }

                if (e.ctrlKey && e.keyCode == keys.SPACE) {
                    showSuggestions('');
                }
                else {
                    switch (e.keyCode) {
                        case keys.ESC: {
                            $("#intellisense-suggestions").slideUp(100);
                        }
                            break;
                        case keys.TAB: {
                        }
                            break;
                        case keys.RETURN: {
                            var txt = $("#intellisense-input").val();
                            var suggestion = scope.suggestions[scope.selectedSuggestionsIndex]['@Name'];

                            scope.$apply(function () {
                                scope.model = append(txt, suggestion);

                            });
                        }
                            break;
                        case keys.UP: {

                            if (scope.selectedSuggestionsIndex > 0)
                                setSelectedSuggestion(scope.selectedSuggestionsIndex - 1);
                        }
                            break;
                        case keys.DOWN: {

                            if (scope.selectedSuggestionsIndex < scope.suggestions.length - 1)
                                setSelectedSuggestion(scope.selectedSuggestionsIndex + 1);
                        }
                            break;
                        default: {
                            if (intellisenseProvider) {
                                showSuggestions($("#intellisense-input").val());
                            }
                        }
                    }
                }
            });
        }
    }
});
