import $ from 'jquery';

const module = require('ui/modules').get('kibana/transform_vis', []);

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
