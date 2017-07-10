import $ from 'jquery';

import { uiModules } from 'ui/modules';

const module = uiModules.get('kibana/transform_vis', []);

module.directive('refreshHack', function () {
  return {
    restrict: 'A',
    link: function ($scope) {
      function broadcast() {
        $scope.$broadcast('fetch');
      }


      $scope.$on('$destroy', function () {
        $('[name="queryInput"]').unbind('submit', broadcast);
        $('[ng-click="fetch()"]').unbind('click', broadcast);
      });


      $('[name="queryInput"]').submit(broadcast);
      $('[ng-click="fetch()"]').click(broadcast);
    }
  };
});
