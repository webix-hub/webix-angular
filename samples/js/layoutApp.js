'use strict';

/* App Module */

const app = angular.module('webixApp', ["webix"]);

app.controller("webixLayoutController", function ($scope) {
  //elements of UI
  const header = { view: "template", id: "header", height: 35, template: `Header #headertext#`, data: { headertext: "" } };
  const main = {
    view: "layout", type: "wide", margin: 10, cols: [
      {
        rows: [
          { view: "text", id: "text", placeholder: "Type something here", width: 200 },
          {},
        ]
      },
      { view: "resizer" },
      {
        view: "tabview", cells: [
          { header: "Tab1", body: { template: "1. Some content here" } },
          { header: "Tab2", body: { template: "2. Other content here" } },
        ]
      }
    ]
  };
  const footer = { view: "template", template: "Footer", height: 35 };

  //configuration
  $scope.config = {
    id: "topview",
    type: "space",
    rows: [
      header,
      main,
      footer
    ]
  };

  webix.event(window, "resize", function () { $$("topview").adjust(); });

  //event handlers for UI goes here
  $scope.updateHeaderText = function (root) {
    $$("text").attachEvent("onTimedKeyPress", function () {
      $$("header").setValues({ headertext: $$("text").getValue() });
    });
  };
});