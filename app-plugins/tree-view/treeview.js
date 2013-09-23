

angular.module('Plugins').directive('treeView', function () {
    return {
        restrict: 'E',
        template: '<ul id="tree" class="filetree"></ul>',
        scope: {
            sourceData: '='
        },
        link: function (scope, iElement, iAttrs, controller) {

            function tree(data) {

                var ul_Entities = $('<ul>');

                for (var i in data) {


                    var li_Entity = $('<li class="folder">')
                        .append($('<span class="folder">').text(data[i]['@Name'])),
                        ul_Entity = $('<ul>');
                    ul_Entities.append(li_Entity.append(ul_Entity));

                    // Key directory
                    if (data[i]['Key'] != undefined) {
                        var ul_keys = $('<ul>'),
                            li_keys = $('<li>').append($('<span class="folder">').text('Keys'));
                        ul_Entity.append(li_keys);
                        ul = $('<ul>');
                        if (data[i]['Key'] instanceof Array) {
                            for (var ind in data[i]['Key']) {

                                ul.append($('<li>')
                                    .append($('<span class="keys">').text(data[i]['Key'][ind]['PropertyRef']['@Name'])));
                            }
                        }
                        else {

                            ul.append($('<li>')
                                    .append($('<span class="keys">').text(data[i]['Key']['PropertyRef']['@Name'])));
                        }
                        li_keys.append(ul);
                    };

                    // properties directory
                    if (data[i]['Property'] != undefined) {
                        var ul_properties = $('<ul>'),
                            li_properties = $('<li>').append($('<span class="folder">').text('Properties'));
                        ul_Entity.append(li_properties);
                        ul = $('<ul>');
                        if (data[i]['Property'] instanceof Array) {
                            for (var ind in data[i]['Property']) {

                                ul.append($('<li>')
                                    .append($('<span class="property">').text(data[i]['Property'][ind]['@Name'])));
                            }
                        }
                        else {

                            ul.append($('<li>')
                                    .append($('<span class="property">').text(data[i]['Property']['@Name'])));
                        }
                        li_properties.append(ul);
                    }

                    // NavigationProperty directory
                    if (data[i]['NavigationProperty'] != undefined) {
                        var ul_navProp = $('<ul>'),
                            li_navProp = $('<li>').append($('<span class="folder">').text('Navigation Properties'));
                        ul_Entity.append(li_navProp);
                        ul = $('<ul>');
                        if (data[i]['NavigationProperty'] instanceof Array) {
                            for (var ind in data[i]['NavigationProperty']) {

                                ul.append($('<li>')
                                    .append($('<span class="link">').text(data[i]['NavigationProperty'][ind]['@Name'])));
                            }
                        }
                        else {

                            ul.append($('<li>')
                                    .append($('<span class="link">').text(data[i]['NavigationProperty']['@Name'])));
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

                    if (schema instanceof Array) {
                        types = schema[0].EntityType;
                        sets = schema[1].EntityContainer.EntitySet
                    } else {
                        sets = schema.EntityContainer.EntitySet
                        types = schema.EntityType;
                    }

                    $('#tree').append($('<li>')
                    .append($('<span class="folder">').text(schema['@Namespace']))
                    .append($('<ul>').append($('<li>').append($('<span class="folder">').text('Entity Set'))
                    .append(tree(types)))));

                    $("#tree").treeview();
                }

            });

        }
    }
});