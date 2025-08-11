'use strict';

/* App Module */

const webixApp = angular.module("webixApp", ["webix"]);

webixApp.controller("webixCtrl", function ($scope) {
  const chart_data = [
    { "sales": "20", "sales2": "35", "sales3": "55", "year": "02" },
    { "sales": "40", "sales2": "24", "sales3": "40", "year": "03" },
    { "sales": "44", "sales2": "20", "sales3": "27", "year": "04" },
    { "sales": "23", "sales2": "50", "sales3": "43", "year": "05" },
    { "sales": "21", "sales2": "36", "sales3": "31", "year": "06" },
    { "sales": "50", "sales2": "40", "sales3": "56", "year": "07" },
    { "sales": "30", "sales2": "65", "sales3": "75", "year": "08" },
    { "sales": "90", "sales2": "62", "sales3": "55", "year": "09" },
    { "sales": "55", "sales2": "40", "sales3": "60", "year": "10" },
    { "sales": "72", "sales2": "45", "sales3": "54", "year": "11" }
  ];

  const chart = {
    view: "chart",
    type: "stackedArea",
    alpha: 0.7,
    eventRadius: 5,
    xAxis: {
      template: "'#year#",
    },
    yAxis: {},
  };

  const chart1 = webix.extend(webix.copy(chart), {
    data: webix.copy(chart_data),
    series: [
      {
        value: "#sales#",
        color: "#ff8",
        tooltip: {
          template: "#sales#"
        }
      },
      {
        value: "#sales2#",
        color: "#f8f",
        tooltip: {
          template: "#sales2#"
        }
      }
    ],
  });

  const chart2 = webix.extend(webix.copy(chart), {
    data: webix.copy(chart_data),
    series: [
      {
        value: "#sales2#",
        color: "#ff8",
        tooltip: {
          template: "#sales2#"
        }
      },
      {
        value: "#sales3#",
        color: "#f8f",
        tooltip: {
          template: "#sales3#"
        }
      }
    ],
  });

  const chart3 = webix.extend(webix.copy(chart), {
    data: webix.copy(chart_data),
    series: [
      {
        value: "#sales3#",
        color: "#ff8",
        tooltip: {
          template: "#sales3#"
        }
      },
      {
        value: "#sales#",
        color: "#f8f",
        tooltip: {
          template: "#sales#"
        }
      }
    ],
  });

  $scope.config = {
    id: "topview",
    type: "line",
    rows: [
      {
        view: "accordion", type: "line", rows: [
          { template: "The top nav bar goes here", type: "header" },
          { template: "<p>Fixed Height Row Goes Here</p>", height: 54 },
          { header: "Single item Accordion Goes Here", body: { template: "The Charts Go Here", autoheight: true } },
          //The main Workbench Columns Go Here
          //should autosize the height to so that the app fills the entire screen
          {
            type: "line", cols: [
              {
                view: "toolbar", autoheight: false, rows: [
                  { view: "button", type: "icon", icon: "wxi-eye", width: 30, id: "eye-button" },
                  { view: "button", type: "icon", icon: "wxi-pencil" },
                  { view: "button", type: "icon", icon: "wxi-user", width: 30 }
                ]
              },
              { template: "<p>Fixed Width vertical accordion</p>", width: 250 },
              {
                view: "form", elements: [
                  { template: "The inputs go here", type: "header" },
                  { view: "slider", label: "Level", value: "20", min: 10, max: 120, name: "s1", group: "Group 1" },
                  { view: "slider", label: "Level", value: "20", min: 0, max: 120, name: "s2", group: "Group 1" },
                  { view: "slider", label: "Level", value: "20", min: 20, max: 120, name: "s3", group: "Group 2" },
                  { view: "slider", label: "Level", value: "20", min: -120, max: 120, name: "s4", group: "Group 2" },
                  { view: "richselect", options: ["One", "Two", "Three"], value: "Two", name: "r1", group: "Group2", icon: "wxi-search" },
                  {},
                ]
              },
              // Param List || Tabs View Resizer
              { view: "resizer" },
              {
                view: "tabview", gravity: 2, cells: [
                  {
                    header: "Charts",
                    body: {
                      rows: [
                        { template: "Each chart in a accordion body", type: "header" },
                        chart1,
                        chart2,
                        chart3,
                      ]
                    }
                  },
                  {
                    header: "Carousel",
                    body: {
                      template: "2. Some content goes here"
                    }
                  },
                ]
              }
            ]
          },
          { template: "<div style='font-size: 0.8em'>The footer Goes Here</div>", height: 20 },
        ]
      }
    ]
  }

  webix.event(window, "resize", function () { $$("topview").resize(); });

  $scope.doSome = function (root) {
    $$("eye-button").attachEvent("onItemClick", function (id) {
      webix.message('I was clicked: ' + id);
    });
  };

});