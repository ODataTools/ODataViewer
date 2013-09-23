angular.module('Plugins').directive('graphView', function () {
    return {
        restrict: 'A',
        template: '<div id="sample"><div id="myDiagram" style="background-color: white; border: solid 1px black; width: 100%; height: 700px"></div></div>',
        replace: true,
        scope: {
            sourceData: '='
        },
        link: function (scope, iElement, iAttrs, controller) {
            scope.$watch('sourceData', function () {
                if (scope.sourceData && Object.keys(scope.sourceData).length > 0) {

                    var data, association;
                    var schema = scope.sourceData["edmx:Edmx"]["edmx:DataServices"]["Schema"];

                    if (schema instanceof Array) {
                        data = schema[0].EntityType;
                        association = schema[0].Association;
                    } else {
                        data = schema.EntityType;
                        association = schema.Association;
                    }

                    var elementId = "myDiagram";
                    start(association, data, elementId);
                };
            });
        }
    }

    function start(association, data, elementId) {
        var nodeDataArray = [];
        var linkDataArray = [];

        function addNodeToDataArray(table) {
            nodeDataArray.push(table);
        }
        function CreateItem(name, iskey, figure, color) {
            this.name = name;
            this.iskey = iskey;
            this.figure = figure;
            this.color = color;
        }
        function LinkItem(from, to, text, toText) {
            this.from = from;
            this.to = to;
            this.text = text;
            this.toText = toText;
        }
        LinkItem.prototype.setFrom = function (from) { this.from = from; }
        LinkItem.prototype.setTo = function (to) { this.to = to; }
        LinkItem.prototype.setText = function (text) { this.text = text; }
        LinkItem.prototype.setToText = function (toText) { this.toText = toText; }

        function addLinkItemToArray(item) {
            linkDataArray.push(item);
        }
        function CreateTable() {
            this.items = [];

        }
        CreateTable.prototype.setKey = function (key) { this.key = key; };
        CreateTable.prototype.addItem = function (item) { this.items.push(item); };
        CreateTable.prototype.getTableObject = function () { return { key: this.key, items: this.items } };

        function checkIsKey(i, property, data) {
            // Key directory
            if (data[i]['Key'] != undefined) {

                if (data[i]['Key'] instanceof Array) {
                    for (var ind in data[i]['Key']) {

                        if (data[i]['Key'][ind]['PropertyRef']['@Name'] === property) {
                            return true;
                        }
                    }
                }
                else {

                    if (data[i]['Key']['PropertyRef']['@Name'] === property) {
                        return true;
                    }
                }
                return false;
            };
        }

        function jsonDataAnalize(data) {
            var $$ = go.GraphObject.make;
            var yellowgrad = $$(go.Brush, go.Brush.Linear, { 0: "rgb(254, 221, 50)", 1: "rgb(254, 182, 50)" });
            for (var i in data) {

                var newTable = new CreateTable();
                newTable.setKey(data[i]['@Name']);

                if (data[i]['@BaseType']) {
                    newTable.setKey(data[i]['@Name'] + ' (BaseType: ' + data[i]['@BaseType'].split('.')[1] + ' )')
                }
                if (data[i]['Property'] != undefined) {

                    if (data[i]['Property'] instanceof Array) {
                        for (var ind in data[i]['Property']) {

                            if (checkIsKey(i, data[i]['Property'][ind]['@Name'], data)) {
                                var newItem = new CreateItem(data[i]['Property'][ind]['@Name'], true, "Decision", yellowgrad);
                                newTable.addItem(newItem);

                            }
                            else {
                                var newItem = new CreateItem(data[i]['Property'][ind]['@Name'], false, "Cube1", "purple");
                                newTable.addItem(newItem);
                            }
                        }
                    }
                    else {
                        if (checkIsKey(i, data[i]['Property']['@Name'], data)) {
                            var newItem = new CreateItem(data[i]['Property']['@Name'], true, "Decision", yellowgrad);
                            newTable.addItem(newItem);
                        } else {
                            var newItem = new CreateItem(data[i]['Property']['@Name'], false, "Cube1", "purple");
                            newTable.addItem(newItem);
                        }
                    }

                }

                addNodeToDataArray(newTable.getTableObject());
            };
        }
        jsonDataAnalize(data);

        function jsonLinkAnalize(association, data) {
            for (var i = 0; i < association.length; i++) {
                var newLinkItem = new LinkItem();

                newLinkItem.setFrom(association[i]['End'][0]['@Type'].split('.')[1]);
                newLinkItem.setText(association[i]['End'][0]['@Multiplicity']);
                newLinkItem.setTo(association[i]['End'][1]['@Type'].split('.')[1]);
                newLinkItem.setToText(association[i]['End'][1]['@Multiplicity']);
                addLinkItemToArray(newLinkItem);

                var tableFrom = association[i]['End'][0]['@Type'].split('.')[1];
                var tableTo = association[i]['End'][1]['@Type'].split('.')[1];
                for (var ind in data) {
                    if (data[ind]['@Name'] === tableFrom) {
                        if (data[ind]['@BaseType']) {
                            newLinkItem.setFrom(data[ind]['@Name'] + ' (BaseType: ' + data[ind]['@BaseType'].split('.')[1] + ' )');
                        }

                    } else {
                        if (data[ind]['@Name'] === tableTo) {
                            if (data[ind]['@BaseType']) {
                                newLinkItem.setTo(data[ind]['@Name'] + ' (BaseType: ' + data[ind]['@BaseType'].split('.')[1] + ' )');
                            }
                        }
                    }
                }
            }
        }
        jsonLinkAnalize(association, data);

        function init() {
            if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
            var $ = go.GraphObject.make;  // for conciseness in defining templates

            myDiagram =
              $(go.Diagram, elementId,  // must name or refer to the DIV HTML element
                {
                    initialContentAlignment: go.Spot.Center,
                    allowDelete: false,
                    allowCopy: false,
                    allowZoom: true,
                  //  autoScale: go.Diagram.UniformToFill,
                    layout: $(go.ForceDirectedLayout)
                });

            // define several shared Brushes
            var bluegrad = $(go.Brush, go.Brush.Linear, { 0: "rgb(150, 150, 250)", 0.5: "rgb(86, 86, 186)", 1: "rgb(86, 86, 186)" });
            var greengrad = $(go.Brush, go.Brush.Linear, { 0: "rgb(158, 209, 159)", 1: "rgb(67, 101, 56)" });
            var redgrad = $(go.Brush, go.Brush.Linear, { 0: "rgb(206, 106, 100)", 1: "rgb(180, 56, 50)" });
            var yellowgrad = $(go.Brush, go.Brush.Linear, { 0: "rgb(254, 221, 50)", 1: "rgb(254, 182, 50)" });
            var lightgrad = $(go.Brush, go.Brush.Linear, { 1: "#E6E6FA", 0: "#FFFAF0" });

            // the template for each attribute in a node's array of item data
            var itemTempl =
              $(go.Panel, "Horizontal",
                $(go.Shape,
                  { desiredSize: new go.Size(10, 10) },
                  new go.Binding("figure", "figure"),
                  new go.Binding("fill", "color")),
                $(go.TextBlock,
                  {
                      stroke: "#333333",
                      font: "bold 14px sans-serif"
                  },
                  new go.Binding("text", "", go.Binding.toString))
              );

            // define the Node template, representing an entity
            myDiagram.nodeTemplate =
              $(go.Node, "Auto",  // the whole node panel
                {
                    selectionAdorned: true,
                    resizable: true,
                    layoutConditions: go.Part.LayoutNone,
                    fromSpot: go.Spot.AllSides,
                    toSpot: go.Spot.AllSides,
                    isShadowed: true,
                    shadowColor: "#C5C1AA"
                },
                new go.Binding("location", "location").makeTwoWay(),
                // define the node's outer shape, which will surround the Table
                $(go.Shape, "Rectangle",
                  { fill: lightgrad, stroke: "#756875", strokeWidth: 3 }),
                $(go.Panel, "Table",
                  { margin: 8, stretch: go.GraphObject.Fill },
                  $(go.RowColumnDefinition, { row: 0, sizing: go.RowColumnDefinition.None }),
                  // the table header
                  $(go.TextBlock,
                    {
                        row: 0, alignment: go.Spot.Center,
                        font: "bold 16px sans-serif"
                    },
                    new go.Binding("text", "key")),
                  // the list of Panels, each showing an attribute
                  $(go.Panel, "Vertical",
                    {
                        row: 1,
                        padding: 3,
                        alignment: go.Spot.TopLeft,
                        defaultAlignment: go.Spot.Left,
                        stretch: go.GraphObject.Horizontal,
                        itemTemplate: itemTempl
                    },
                    new go.Binding("itemArray", "items"))
                )  // end Table Panel
              );  // end Node

            // define the Link template, representing a relationship
            myDiagram.linkTemplate =
              $(go.Link,  // the whole link panel
                {
                    selectionAdorned: true,
                    layerName: "Foreground",
                    reshapable: true,
                    routing: go.Link.Orthogonal,
                    corner: 5,
                    curve: go.Link.JumpOver
                },
                $(go.Shape,  // the link shape
                  {
                      isPanelMain: true,
                      stroke: "#303B45",
                      strokeWidth: 2.5
                  }),
                $(go.TextBlock,  // the "from" label
                  {
                      textAlign: "center",
                      font: "bold 14px sans-serif",
                      stroke: "#1967B3",
                      segmentIndex: 0,
                      segmentOffset: new go.Point(NaN, NaN),
                      segmentOrientation: go.Link.OrientUpright
                  },
                  new go.Binding("text", "text")),
                $(go.TextBlock,  // the "to" label
                  {
                      textAlign: "center",
                      font: "bold 14px sans-serif",
                      stroke: "#1967B3",
                      segmentIndex: -1,
                      segmentOffset: new go.Point(NaN, NaN),
                      segmentOrientation: go.Link.OrientUpright
                  },
                  new go.Binding("text", "toText"))
              );

            // create the model for the E-R diagram


            myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

            myDiagram.model.undoManager.isEnabled = true;
        }

        init();
    }


});
