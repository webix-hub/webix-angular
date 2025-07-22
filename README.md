Angular JS adapter for Webix UI
==========================

[![npm version](https://badge.fury.io/js/webix-angular.svg)](https://badge.fury.io/js/webix-angular)

Before Webix 4.3 this module was part of webix.js

See the detailed documentation on [integration of Webix with Angular JS](http://docs.webix.com/desktop__angular.html).

If you are looking for the demo for **Angular 2 and above**, check the [related repository](https://github.com/webix-hub/angular2-demo).

Webix-Angular App Structure
---------------------------

To use **Angular JS framework** for <a href="http://webix.com/widgets/" title="javascript widget">Webix component</a> you should:

- include **Angular** and **Webix** scripts into the document. Note that order does matter here - Angular JS script must come first;
- set **ngApp directive** to the document root to bootstrap an application. For convenience means, it's recommended to use **"webixApp"** as **module name**.
- **create a new module** passing module name from the previous step and *"webix"* required parameter to connect it to Webix library.

~~~html
<!DOCTYPE html> <!--setting directive-->
<html lang="en" ng-app="webixApp">
<head>
  <meta charset="utf-8">
  <title>Webix-Angular App</title>
  <script src="js/angular.min.js"></script>
  <script type="text/javascript" src="../../codebase/webix.js"></script>
  <link rel="stylesheet" type="text/css" href="../../codebase/webix.css">

  <script type="text/javascript">
  	const app = angular.module('webixApp', [ "webix" ]); //creating module
  	..//app's js code (controllers)
  </script>
</head>
<body>
	<!-- app's html -->
</body>
</html>
~~~

However, since app logic is typically complex, it's a good practice to store controllers separately:

~~~html
<script type="text/javascript" src="controllers.js">
~~~

Initializing Webix Components
-----------------------

Bound to Angular JS, Webix offers a special **webix-ui** directive that bootstraps an application. The directive is used with the app's config object as an argument while the entire application code is placed in the **Angular controller**.

The only markup line you need is:

~~~html
<body ng-controller="webixAppController">
	<div webix-ui="config" webix-ready="doSome(root)" style="width:450px; height:300px;"></div>
</body>
~~~

- This method is close to Webix initialization pattern. **Config** object is JSON object you would pass into **webix.ui()** constructor if you were working with Webix alone;
- Event handlers are attached with the help of **webix-ready** directive that executes a controller function taking **config root** as parameter.

The controller code is:

~~~js
const app = angular.module('webixApp', [ "webix" ]);

app.controller("webixTestController", function($scope){
    const header = { type:"header", template:"App header" };
	const left = { view:"list", id:"a1", select:true, data:["One", "Two", "Three"] };
	const right = { template:"Right area", id:"a2" };

    //config object
 	$scope.config = {
   	 	isolate:true, rows:[ //two rows
     		header,
     		{ cols:[
     			left,  //list
        		{ view:"resizer" }, //resizer line
        		right //template
     		]}
    	]
	};
};
~~~

**Related sample:** [Webix-Angular:Initializing from Config](https://webix-hub.github.io/webix-angular/samples/05_config.html)

**Attaching Events with webix-ready Directive**

**Webix-ready** directive executes a controller function with a **config root** as an argument and makes it possible to attach event handlers for all components in current configuration.

~~~html
<body ng-controller="webixAppController">
	<div webix-ui="config" webix-ready="doSome(root)"></div>
</body>
~~~

**Root** is a **top parent view** of your application config. Here root is a *two-row layout*.

Root has an **isolate** property, which means that the IDs of its child views (header, list, template) can be not unique within the page (there can be same IDs in another config object). But, when attaching event handlers,
you should refer to components via their root.

The controller code is:

~~~js
app.controller("webixAppController", function($scope){
    $scope.doSome = function(root){
    const list = root.$$("a1"); //referring to list via root object
    const template = root.$$("a2"); //referring to template via root object

    list.attachEvent("onAfterSelect", function(id){
      template.setHTML(this.getItem(id).value);
    });

    list.select(list.getFirstId());
  };
};
~~~

Inside the function invoked by **webix-ready** directive, Webix-Angular integrated app complies to standard Webix [event handling pattern](http://docs.webix.com/desktop__event_handling.html).
