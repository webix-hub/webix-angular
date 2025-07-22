'use strict';

/* App Module */

const app = angular.module('webixApp', ["webix"]);

app.controller("webixEventsController", function ($scope) {
  const records = [
    { id: 1, title: "The Shawshank Redemption", year: 1994, votes: 678790, rating: 9.2, rank: 1 },
    { id: 2, title: "The Godfather", year: 1972, votes: 511495, rating: 9.2, rank: 2 },
    { id: 3, title: "The Godfather: Part II", year: 1974, votes: 319352, rating: 9.0, rank: 3 },
    { id: 4, title: "The Good, the Bad and the Ugly", year: 1966, votes: 213030, rating: 8.9, rank: 4 },
    { id: 5, title: "My Fair Lady", year: 1964, votes: 533848, rating: 8.9, rank: 5 },
    { id: 6, title: "12 Angry Men", year: 1957, votes: 164558, rating: 8.9, rank: 6 }
  ];

  $scope.config = {
    type: "space",
    width: 850,
    rows: [{
      cols: [
        {
          view: "datatable", id: "grid", width: 600, autoheight: true, select: "row",
          data: records,
          columns: [
            { id: "rating", header: "Rating", sort: "int", css: "rating" },
            { id: "year", header: "Year", sort: "int" },
            { id: "votes", header: "Votes", sort: "int" },
            { id: "title", header: "Title", sort: "string", fillspace: 1 }
          ]
        },
        {
          rows: [
            {
              view: "template", id: "selText",
              template: `Selected ID: #selectedId# </br> Event Type: #eventType# </br> Node Name: #nativeElement#`,
              data: { selectedId: "", eventType: "", nativeElement: "" }
            },
            {
              view: "template", id: "sortText",
              template: `Sorted Column (Title): #sortedCol# </br> Sorting Dir: #sortDir# </br> Sorting Type: #sortType#`,
              data: { sortedCol: "", sortDir: "", sortType: "" }
            }]
        },
      ]
    },
    {
      view: "button", id: "rowBtn", value: "Add row", click: () => {
        $$("grid").add({ title: "New Record", rating: 999, votes: 0, year: 2013 })
      }
    }
    ]
  };

  $scope.updateInfo = function (root) {
    $$("grid").attachEvent("onItemClick", function (id, ev, node) {
      $$("selText").setValues({ selectedId: id.row, eventType: ev.type, nativeElement: node.nodeName });
    });
    $$("grid").attachEvent("onAfterSort", function (by, dir, as) {
      $$("sortText").setValues({ sortedCol: by, sortDir: dir, sortType: as });
    });
  };
});