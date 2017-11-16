// import { AggResponseTabifyProvider } from 'ui/agg_response/tabify/tabify';
import { uiModules } from 'ui/modules';
import { FilterBarQueryFilterProvider } from 'ui/filter_bar/query_filter'
import { dashboardContextProvider } from 'plugins/kibana/dashboard/dashboard_context'
import { SavedObjectsClientProvider } from 'ui/saved_objects';

import chrome from 'ui/chrome';

const Mustache = require('mustache');
const module = uiModules.get('kibana/transform_vis', ['kibana']);

require('plugins/transform_vis/directives/refresh_hack');

module.controller('TransformVisController', function ($scope, $sce, Private, timefilter, es, config, indexPatterns) {

  const queryFilter = Private(FilterBarQueryFilterProvider);
  const dashboardContext = Private(dashboardContextProvider);

  $scope.options = chrome.getInjected('transformVisOptions');

  $scope.applyHTML = function () {
    if ($scope.options.allow_unsafe) {
      return $sce.trustAsHtml($scope.vis.display);
    } else {
      return $scope.vis.display;
    }
  };

  $scope.refreshConfig = function () {

    indexPatterns.get($scope.vis.params.outputs.indexpattern).then(function (indexPattern) {
      $scope.vis.indexPattern = indexPattern;
    }).then($scope.search);

  };

  $scope.setDisplay = function (text) {
    $scope.vis.display = text;
  };

  $scope.search = function () {

    const context = dashboardContext();

    // This is part of what should be a wider config validation
    if ($scope.vis.indexPattern === undefined || $scope.vis.indexPattern.id === undefined) {
      $scope.setDisplay('<div style="text-align: center;"><i>No Index Pattern</i></div>');
      return;
    } 
    
    const index = $scope.vis.indexPattern.title;
    
    if ($scope.vis.indexPattern && $scope.vis.indexPattern.timeFieldName) {
      const timefilterdsl = {range: {}};
      timefilterdsl.range[$scope.vis.indexPattern.timeFieldName] = {gte: timefilter.time.from, lte: timefilter.time.to};
      context.bool.must.push(timefilterdsl);
    }

    const body = JSON.parse($scope.vis.params.outputs.querydsl.replace('"_DASHBOARD_CONTEXT_"', JSON.stringify(context)));

    es.search({
      index: index,
      body: body
    }, function (error, response) {
      if (error) {
        $scope.setDisplay("Error (See Console)");
        console.log("Elasticsearch Query Error", error);
      } else {
        const bindme = {};
        bindme.context = context;
        bindme.response = response;
        bindme.error = error;
        if ($scope.options.allow_unsafe) {
          try {
            bindme.meta = eval($scope.vis.params.outputs.meta);
          } catch (jserr) {
            bindme.jserr = jserr;
            $scope.setDisplay("Error (See Console)");
            console.log("Javascript Compilation Error", jserr);
            return; // Abort!
          }
        }
        const formula = $scope.vis.params.outputs.formula;
        $scope.setDisplay(Mustache.render(formula, bindme));
      }
    });

  };


  $scope.$watchCollection('vis.params.outputs', $scope.refreshConfig);

  // When the expression updates
  $scope.$watchMulti(['vis.params.expression', 'vis.params.interval'], $scope.search);

  // When the time filter changes
  $scope.$listen(timefilter, 'fetch', $scope.search);

  // When a filter is added to the filter bar?
  $scope.$listen(queryFilter, 'fetch', $scope.search);

  // When auto refresh happens
  $scope.$on('courier:searchRefresh', $scope.search);

  // From the hack directive
  $scope.$on('fetch', $scope.search);

  $scope.$on('renderComplete', event => {
    event.stopPropagation();
    $element.trigger('renderComplete');
  });

});

module.controller('TransformVisEditorController', function ($scope, Private, indexPatterns) {

  $scope.options = chrome.getInjected('transformVisOptions');

  const savedObjectsClient = Private(SavedObjectsClientProvider);
  
  const patterns = savedObjectsClient.find({
    type: 'index-pattern',
    fields: ['title'],
    perPage: 10000
  }).then(response => {    
    $scope.indexPatternOptions = response.savedObjects;
  });


  $scope.$watch('vis.params.outputs.indexpattern', function () {
    indexPatterns.get($scope.vis.params.outputs.indexpattern).then(function (indexPattern) {
      $scope.savedVis.searchSource.set('index', indexPattern);
      $scope.vis.indexPattern = indexPattern;
    });
  });

});
