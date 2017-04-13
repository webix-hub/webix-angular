if (window.angular)

(function(){

  function id_helper($element){
    //we need uniq id as reference
    var id = $element.attr("id");
    if (!id){
      id = webix.uid();
      $element.attr("id", id);
    }
    return id;
  }

  function locate_view_id($element){
    if (typeof $element.attr("webix-ui") != "undefined")
      return $element.attr("id");
    return locate_view_id($element.parent());
  }




//creates webix ui components
angular.module("webix", [])
  .directive('webixUi', [ "$parse", function($parse) {
    return {
      restrict: 'A',
      scope: false,
      link:function ($scope, $element, $attrs, $controller){
        var dataname = $attrs["webixUi"];
        var callback = $attrs["webixReady"];
        var watch = $attrs["webixWatch"];
        var wxRoot = null;
        var id = id_helper($element);

        $element.ready(function(){  
          if (wxRoot) return;

          if (callback)
            callback = $parse(callback);

          //destruct components
          $element.bind('$destroy', function() {
            if (wxRoot && !wxRoot.$destructed && wxRoot.destructor)
              wxRoot.destructor();
          });
          //ensure that ui is destroyed on scope destruction
          $scope.$on('$destroy', function(){
            if (wxRoot && !wxRoot.$destructed && wxRoot.destructor)
              wxRoot.destructor();
          });

          //webix-ui attribute has some value - will try to use it as configuration
          if (dataname){
            //configuration
            var watcher = function(data){
              if (wxRoot) wxRoot.destructor();
              if ($scope[dataname]){
                var config = webix.copy($scope[dataname]);
                config.$scope =$scope;
                $element[0].innerHTML = "";
                wxRoot = webix.ui(config, $element[0]);
                if (callback)
                  callback($scope, { root: wxRoot });
              }
            };
            if (watch !== "false")
              $scope.$watch(dataname, watcher);
            watcher();
          } else {
          //if webix-ui is empty - init inner content as webix markup
            if (!$attrs["view"])
              $element.attr("view", "rows");
            
            var ui = webix.markup;
            var tmp_a = ui.attribute; ui.attribute = "";
            //FIXME - memory leaking, need to detect the moment of dom element removing and destroy UI
            if (typeof $attrs["webixRefresh"] != "undefined")
              wxRoot = ui.init($element[0], $element[0], $scope);
            else
              wxRoot = ui.init($element[0], null, $scope);

            ui.attribute = tmp_a;

            if (callback)
              callback($scope, { root: wxRoot });
          }

          //size of ui
          $scope.$watch(function() {
            return $element[0].offsetWidth + "." + $element[0].offsetHeight;
          }, function() {
            if (wxRoot) wxRoot.adjust();
          });

        });
      }
    };
  }])

  .directive('webixShow', [ "$parse", function($parse) {
    return {
      restrict: 'A',
      scope: false,

      link:function ($scope, $element, $attrs, $controller){
        var attr = $parse($attrs["webixShow"]);
        var id = id_helper($element);

        if (!attr($scope))
            $element.attr("hidden", "true");

        $scope.$watch($attrs["webixShow"], function(){
          var view = webix.$$(id);
          if (view){
            if (attr($scope)){
              webix.$$(id).show();
              $element[0].removeAttribute("hidden");
            } else
              webix.$$(id).hide();
          }
        });

      }
    };
  }])

  .directive('webixEvent', [ "$parse", function($parse) {
    var wrap_helper = function($scope, view, eventobj){
      var ev = eventobj.split("=");
      var action = $parse(ev[1]);
      var name = ev[0].trim();
      view.attachEvent(name, function(){              
        return action($scope, { id:arguments[0], details:arguments });
      });
    };

    return {
      restrict: 'A',
      scope: false,
      
      link:function ($scope, $element, $attrs, $controller){
        var events = $attrs["webixEvent"].split(";");
        var id = id_helper($element);

        setTimeout(function(){
          var first = $element[0].firstChild;
          if (first && first.nodeType == 1)
            id = first.getAttribute("view_id") || id;

          var view = webix.$$(id);
          for (var i = 0; i < events.length; i++) {
            wrap_helper($scope, view, events[i]);
          }
        });

      }
    };
  }])

  .directive('webixElements', [ "$parse", function($parse) {
    return {
      restrict: 'A',
      scope: false,

      link:function ($scope, $element, $attrs, $controller){

        var data = $attrs["webixElements"];
        var id = id_helper($element);
        
        if ($scope.$watchCollection)
          $scope.$watchCollection(data, function(collection){
            setTimeout(function(){
              var view = webix.$$(id);
              if (view){
                view.define("elements", collection);
                view.refresh();
              }
            },1);
          });
      }

    };
  }])

  .directive('webixData', [ "$parse", function($parse) {
    return {
      restrict: 'A',
      scope: false,

      link:function ($scope, $element, $attrs, $controller){

        var data = $attrs["webixData"];
        var id = id_helper($element);
        
        if ($scope.$watchCollection)
          $scope.$watchCollection(data, function(collection){
            if (collection){
              setTimeout(function(){
                loadData($element, id, collection, 0);
              },1);
            }
          });
      }

    };
  }]);

  function loadData($element, id, collection, num){
    if (num > 10) return;
    var first = $element[0].firstChild;
    if (first && first.nodeType == 1)
    id = first.getAttribute("view_id") || id;

    var view = webix.$$(id);
    if (view){
      if (view.options_setter){
        view.define("options", collection);
        view.refresh();
      }else{
        if (view.clearAll)
          view.clearAll();
        view.parse(collection);
      }
    } else {
      webix.delay(loadData, this, [$element, id, collection], 100, num+1);
    }
  }

})();