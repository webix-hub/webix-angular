'use strict';

/* App Module */

const app = angular.module('webixApp', ["webix"]);

app.controller("webixChartController", function ($scope) {
	$scope.lines = [
		{ id: 1, sales: 20, year: "02" },
		{ id: 2, sales: 55, year: "03" },
		{ id: 3, sales: 40, year: "04" },
		{ id: 4, sales: 78, year: "05" },
		{ id: 5, sales: 61, year: "06" },
		{ id: 6, sales: 35, year: "07" },
		{ id: 7, sales: 80, year: "08" },
		{ id: 8, sales: 50, year: "09" },
		{ id: 9, sales: 65, year: "10" },
		{ id: 10, sales: 59, year: "11" }
	];

	$scope.config = {
		view: "chart",
		id: "mychart",
		type: "bar",
		value: "#sales#",
		borderless: true,
	};

	$scope.changeLine = function (type) {
		$$("mychart").define("type", type);
		$$("mychart").render();
	};
});

