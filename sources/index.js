if (window.angular)

  (function () {

    function id_helper($element) {
      //we need uniq id as reference
      let id = $element.attr("id");
      if (!id) {
        id = webix.uid();
        $element.attr("id", id);
      }
      return id;
    }

    //creates webix ui components
    angular.module("webix", [])
      .directive('webixUi', ["$parse", function ($parse) {
        return {
          restrict: 'A',
          scope: false,
          link: function ($scope, $element, $attrs, $controller) {
            const repeat = $attrs["ngRepeat"];
            const watch = $attrs["webixWatch"];
            let datapath = $attrs["webixUi"];
            let callback = $attrs["webixReady"];
            let wxRoot = null;

            $element.ready(function () {
              if (wxRoot) return;
              if (callback)
                callback = $parse(callback);

              //destruct components
              $element.bind('$destroy', function () {
                if (wxRoot && !wxRoot.$destructed && wxRoot.destructor)
                  wxRoot.destructor();
              });
              //ensure that ui is destroyed on scope destruction
              $scope.$on('$destroy', function () {
                if (wxRoot && !wxRoot.$destructed && wxRoot.destructor)
                  wxRoot.destructor();
              });

              //webix-ui attribute has some value - use it as configuration
              if (datapath) {

                function checkDatanameExists(datapath) {
                  //dataname can be nested in case of ng-repeat usage
                  const parts = datapath.split(".");
                  let current = $scope;
                  for (const part of parts) {
                    if (!current[part]) return false;
                    current = current[part];
                  }
                  return true;
                }

                const watcher = function (data, oData) {
                  if (wxRoot) wxRoot.destructor();

                  const datanameExists = checkDatanameExists(datapath);
                  if (datanameExists) {
                    //configuration
                    let config;
                    if (repeat) {
                      const [parentName, childName] = datapath.split(".");
                      config = webix.copy($scope[parentName][childName]);
                    } else {
                      config = webix.copy($scope[datapath]);
                    }

                    config.$scope = $scope;
                    $element[0].innerHTML = "";
                    wxRoot = webix.ui(config, $element[0]);

                    if (callback)
                      callback($scope, { root: wxRoot });
                  }
                };
                if (watch !== "false") {
                  $scope.$watch(datapath, watcher);
                }

                watcher();
              }

            });
          }
        };
      }])

      .directive('webixData', ["$parse", function ($parse) {
        return {
          restrict: 'A',
          scope: false,

          link: function ($scope, $element, $attrs, $controller) {
            const data = $attrs["webixData"];
            const id = id_helper($element);

            if ($scope.$watchCollection)
              $scope.$watchCollection(data, function (collection) {
                if (collection) {
                  setTimeout(function () {
                    loadData($element, id, collection, 0);
                  }, 1);
                }
              });
          }

        };
      }]);

    function loadData($element, id, collection, num) {
      if (num > 10) return;
      const first = $element[0].firstChild;
      if (first && first.nodeType == 1)
        id = first.getAttribute("view_id") || id;

      const view = webix.$$(id);
      if (view) {
        if (view.options_setter) {
          view.define("options", collection);
          view.refresh();
        } else {
          if (view.clearAll)
            view.clearAll();
          view.parse(collection);
        }
      } else {
        webix.delay(loadData, this, [$element, id, collection], 100, num + 1);
      }
    };

  })();