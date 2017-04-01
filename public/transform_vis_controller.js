import _ from 'lodash';
import AggResponseTabifyTabifyProvider from 'ui/agg_response/tabify/tabify';
import uiModules from 'ui/modules';
import chrome from 'ui/chrome';
const Mustache = require('mustache')
const module = uiModules.get('kibana/transform_vis', ['kibana']);

require('plugins/transform_vis/directives/refresh_hack');

module.controller('TransformVisController', function ($scope, $sce, Private, timefilter, es, config, indexPatterns) {

    const queryFilter = Private(require('ui/filter_bar/query_filter'));
    const dashboardContext = Private(require('plugins/timelion/services/dashboard_context'));
     
    $scope.options = chrome.getInjected('transformVisOptions');
     
    $scope.refreshConfig = function() {

	indexPatterns.get($scope.vis.params.outputs.indexpattern).then( function (indexPattern) {
		$scope.vis.indexPattern = indexPattern;
	}).then($scope.search);

    }

    $scope.search = function() {

	var context = dashboardContext();
	var index = $scope.vis.params.outputs.indexpattern;

	// This is part of what should be a wider config validation
	if (!(typeof index === 'string' || index instanceof String)) {
		$scope.vis.display = "<center><i>No Index Pattern</i></center>";
		return;
        }    

	if ($scope.vis.indexPattern.timeFieldName) {
	 const timefilterdsl = { range:{} };
	 timefilterdsl.range[$scope.vis.indexPattern.timeFieldName] = { gte: timefilter.time.from, lte: timefilter.time.to };
	 context.bool.must.push(timefilterdsl);
	}
	
        var body = $scope.vis.params.outputs.querydsl.replace("\"_DASHBOARD_CONTEXT_\"",JSON.stringify(context));

	es.search({
		index: index,
		body: JSON.parse(body)
	}, function (error, response) {
		if (error) {
		 $scope.vis.display = "Error (See Console)";
		 console.log("Elasticsearch Query Error", error);
		} else {
	          if ($scope.options.allow_unsafe) {
			response.meta = eval($scope.vis.params.outputs.meta);
	   	  } 
		  var formula = $scope.vis.params.outputs.formula;
                  $scope.vis.display = Mustache.render(formula, response);
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

module.controller('TransformVisEditorController', function ($scope, indexPatterns) {

    $scope.options = chrome.getInjected('transformVisOptions');

    indexPatterns.getIds().then( function(list) {
	    $scope.indexPatternOptions = list;
    });;

   $scope.$watch('vis.params.outputs.indexpattern', function() {
	    indexPatterns.get($scope.vis.params.outputs.indexpattern).then( function (indexPattern) {
		$scope.savedVis.searchSource.set('index', indexPattern); 
		$scope.vis.indexPattern = indexPattern;
	    });;
    });

});
