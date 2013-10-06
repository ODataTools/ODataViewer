

angular.module('Plugins').directive('treeView', function () {
    return {
        restrict: 'E',
        templateUrl: 'app-plugins/tree-view/treeview.html',
        scope: {
            sourceData: '='
        },
        link: function (scope, iElement, iAttrs, controller) {

            function tree(data) {

                var ul_Entities = $('<ul>');

                for (var i in data) {

                    var li_Entity = $('<li >')
                        .append($('<a href="#" >').html(data[i]['@Name'])),
                        ul_Entity = $('<ul>');
                    ul_Entities.append(li_Entity.append(ul_Entity));

                    // Key directory
                    if (data[i]['Key'] != undefined) {
                        var ul_keys = $('<ul>'),
                            li_keys = $('<li>').append($('<a>').html('Keys'));
                        ul_Entity.append(li_keys);
                        ul = $('<ul>');
                        if (data[i]['Key'] instanceof Array) {
                            for (var ind = 0; ind < data[i]['Key'].length; ind++) {

                                ul.append($('<li>')
                                    .append($('<a class="key">').html(data[i]['Key'][ind]['PropertyRef']['@Name'])));
                            }
                        }
                        else {

                            ul.append($('<li>')
                                    .append($('<a class="key">').html(data[i]['Key']['PropertyRef']['@Name'])));
                        }
                        li_keys.append(ul);
                    };

                    // properties directory
                    if (data[i]['Property'] != undefined) {
                        var ul_properties = $('<ul>'),
                            li_properties = $('<li>').append($('<a>').html('Properties'));
                        ul_Entity.append(li_properties);
                        ul = $('<ul>');
                        if (data[i]['Property'] instanceof Array) {
                            for (var ind = 0; ind < data[i]['Property'].length; ind++) {

                                ul.append($('<li>')
                                    .append($('<a class="property">').html(data[i]['Property'][ind]['@Name'])));
                            }
                        }
                        else {

                            ul.append($('<li>')
                                    .append($('<a class="property">').html(data[i]['Property']['@Name'])));
                        }
                        li_properties.append(ul);
                    }

                    // NavigationProperty directory
                    if (data[i]['NavigationProperty'] != undefined) {
                        var ul_navProp = $('<ul>'),
                            li_navProp = $('<li>').append($('<a>').html('Navigation Properties'));
                        ul_Entity.append(li_navProp);
                        ul = $('<ul>');
                        if (data[i]['NavigationProperty'] instanceof Array) {
                            for (var ind = 0; ind < data[i]['NavigationProperty'].length; ind++) {

                                ul.append($('<li>')
                                    .append($('<a class="link">').html(data[i]['NavigationProperty'][ind]['@Name'])));
                            }
                        }
                        else {

                            ul.append($('<li>')
                                    .append($('<a class="link">').html(data[i]['NavigationProperty']['@Name'])));
                        }
                        li_navProp.append(ul);
                    }
                };

                return ul_Entities;

            }

            scope.$watch('sourceData', function () {

                if (scope.sourceData) {

                    var schema = scope.sourceData['edmx:Edmx']['edmx:DataServices']['Schema'];

                    var sets;
                    var types;
                    var nameSpace;

                    if (schema instanceof Array) {
                        types = schema[0].EntityType;
                        sets = schema[1].EntityContainer.EntitySet;
                        nameSpace = schema[0]['@Namespace'];
                    } else {
                        sets = schema.EntityContainer.EntitySet;
                        types = schema.EntityType;
                        nameSpace = schema['@Namespace'];
                    }

                    //HASAN
                    $('#adoptme').html('');

                    $('#adoptme')
                    .append($('<ul>')
                    .append($('<li>')
                    .append($('<span class="folder">').text(nameSpace))
                    .append($('<ul>').append($('<li>').append($('<span class="folder">').text('Entity Set'))
                    .append(tree(types))))));

                    $(function () {
                        $("#adoptme").jstree({
                            "themes": {
                                "open_parents": true,
                                "load_open": true,
                                "theme": "classic",
                                "dots": true,
                                "icons": true
                            },
                            "plugins": ["themes", "html_data"]
                        });
                    });
                }

            });

        }
    }
});
