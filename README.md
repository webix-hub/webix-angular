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
<!doctype html> <!--setting directive-->
<html lang="en" ng-app="webixApp"> 
<head>
  <meta charset="utf-8">
  <title>Webix-Angular App</title>
  <script src="js/angular.min.js"></script>
  <script type="text/javascript" src="../../codebase/webix.js"></script>
  <link rel="stylesheet" type="text/css" href="../../codebase/webix.css">
  
  <script type="text/javascript">
  	var app = angular.module('webixApp', [ "webix" ]); //creating module
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

Bound to Angular JS, Webix offers a special **webix-ui** directive that bootstraps an application. Here two methods are possible:

- [initializing from HTML markup](#html) - the directive is used without an argument, the application is initialized via HTML:

~~~html
<div webix-ui type="space"> <!-- app html --> </div>
~~~

- [initializing from a JS configuration object](#config) - the directive is used with the app's config object as an argument, no additional markup is used. Config object is stored in the app's controller:

~~~html
<div webix-ui="config" webix-ready="doSome(root)" style="width:450px; height:300px;">
~~~

Two patterns are equal in functionality yet differ in the way this functionality is implemented. 

Initializing from HTML markup
--------------------

This method resembles Webix [HTML Initialization technique](http://docs.webix.com/desktop__html_markup_init.html) but has its own peculiarities:

- Webix application lies in a div block with **webix-ui** directive:
	- **view** attribute of such block specifies Webix component you want to init;
	- if you don't specify the view attribute - a layout row will be created;
- all div blocks within "webix-ui block" are Webix views (components):
	- **view** attribute of a div specifies Webix component you want to init;
	- a div block without the view attribute inits Webix template;
	- other attributes of div blocks are component **properties**;
- As with standard Angular JS, you can easily insert Angular directives into tags including inputs and buttons (like in standard HTML).

**Layout with Tabbar and Multiview**

~~~html
<body>
  <div webix-ui type="space"> <!--layout rows with type "space" are created-->
	<div height="35">Header { {app} }</div> <!--Webix template is initialized -->
	<div view="cols" type="wide" margin="10"> <!--Webix layout cols are initialized-->
		<div width="200"> 
			<input type="text" placeholder="Type here" ng-model="app">
		</div>
		<div view="resizer"></div>
		<div view="tabview">
			<div header="Tab1">
				1. Some content here
			</div>
			<div header="Tab2">
				2. Other content here
			</div>
		</div>
	</div>
	<div height="35">Footer</div>
  </div>
</body>
~~~

**Related sample:** [Webix-Angular:Layouts](https://webix-hub.github.io/webix-angular/samples/01_layout.html)

The input and header template are bound together by **ng-model** directive. 

Read more about initialization from HTML markup in the [Webix documentation](http://docs.webix.com/desktop__angular.html#initializingfromfromhtmlmarkup).

Initializing from Config Object 
--------------------

Initialization via config object helps **get rid of markup** and hence, markup-specific directives, and move the entire application code to **Angular controller**.

The only markup line you need is: 

~~~html
<body ng-controller="webixTestController">
	<div webix-ui="config" webix-ready="doSome(root)"></div>
</body>
~~~

- This method is closer to Webix initialization pattern. **Config** object is JSON object you would pass into **webix.ui()** constructor if you were working with Webix alone;
- Event handlers are attached with the help of **webix-ready** directive that executes a controller function taking **config root** as parameter.   

The controller code is:

~~~js
var app = angular.module('webixApp', [ "webix" ]);

app.controller("webixTestController", function($scope){
    var header = { type:"header", template:"App header" };
	var left = { view:"list", id:"a1", select:true, data:["One", "Two", "Three"] };
	var right = { template:"Right area", id:"a2" };
	
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

**Related sample:** [Webix-Angular:Initializing from Config](https://webix-hub.github.io/webix-angular/samples/06_controller.html)

**Attaching Events with webix-ready Directive**

**Webix-ready** directive executes a controller function with a **config root** as an argument and makes it possible to attach event handlers for all components in current configuration. If you init from HTML markup, 
use [webix-event](http://docs.webix.com/desktop__angular_events.html) directive for these needs.

~~~html
<body ng-controller="webixTestController">
	<div webix-ui="config" webix-ready="doSome(root)"></div>
</body>
~~~

**Root** is a **top parent view** of your application config. Here root is a *two-row layout*. 

Root has an **isolate** property, which means that the IDs of its child views (header, list, template) can be not unique within the page (there can be same IDs in another config object). But, when attaching event handlers, 
you should refer to components via their root. 

The controller code is:

~~~js
app.controller("webixTestController", function($scope){
    $scope.doSome = function(root){
    var list = root.$$("a1"); //referring to list via root object
    var template = root.$$("a2"); //referring to template via root object
    
    list.attachEvent("onAfterSelect", function(id){
      template.setHTML(this.getItem(id).value); 
    });

    list.select(list.getFirstId());
  };
};
~~~

Inside the function invoked by **webix-ready** directive, Webix-Angular integrated app complies to standard Webix [event handling pattern](http://docs.webix.com/desktop__event_handling.html).
