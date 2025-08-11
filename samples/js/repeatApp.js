'use strict';

/* App Module */

const app = angular.module('webixApp', ["webix"]);

app.controller("webixChartController", function ($scope) {
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

  $scope.charts = [
    {
      data: webix.copy(chart_data),
      config: webix.extend(webix.copy(chart), {
        id: 1, series: [
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
        ]
      })
    },
    {
      data: webix.copy(chart_data),
      config: webix.extend(webix.copy(chart), {
        id: 2, series: [
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
        ]
      })
    },
    {
      data: webix.copy(chart_data),
      config: webix.extend(webix.copy(chart), {
        id: 3, series: [
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
        ]
      })
    }
  ];

  $scope.addChart = function () {
    $scope.charts.push({
      data: webix.copy(chart_data),
      config: webix.extend(webix.copy(chart), {
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
        ]
      })
    });
  };

  $scope.removeChart = function () {
    $scope.charts.pop();
  };

  $scope.addSerie = function () {
    for (let i = 0; i < $scope.charts.length; i++) {
      const id = $scope.charts[i].config.id;
      $$(id).addSeries({
        value: "#sales#",
        color: "#8ff",
        tooltip: {
          template: "#sales#"
        }
      });
      $$(id).render();
    }
  };

});

