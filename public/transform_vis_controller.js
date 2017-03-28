import _ from 'lodash';
import AggResponseTabifyTabifyProvider from 'ui/agg_response/tabify/tabify';
import uiModules from 'ui/modules';
const module = uiModules.get('kibana/transform_vis', ['kibana']);
const Mustache = require('mustache')
import chrome from 'ui/chrome';


module.controller('TransformVisController', function ($scope, $sce, Private, timefilter, es, config) {

    const queryFilter = Private(require('ui/filter_bar/query_filter'));
    const dashboardContext = Private(require('plugins/timelion/services/dashboard_context'));
     
    $scope.options = chrome.getInjected('transformVisOptions');

    $scope.search = function() {

	var context = dashboardContext();
	
	if ($scope.vis.indexPattern.timeFieldName) {
	 const timefilterdsl = { range:{} };
	 timefilterdsl.range[$scope.vis.indexPattern.timeFieldName] = { gte: timefilter.time.from, lte: timefilter.time.to };
	 context.bool.must.push(timefilterdsl);
	}
	
        var body = $scope.vis.params.outputs.querydsl.replace("\"_DASHBOARD_CONTEXT_\"",JSON.stringify(context));
	var index = $scope.vis.params.outputs.indexpattern;

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

    // This is bad, there should be a single event that triggers a refresh of data.

    // When the expression updates
    $scope.$watchMulti(['vis.params.expression', 'vis.params.interval'], $scope.search);

    // When the time filter changes
    $scope.$listen(timefilter, 'fetch', $scope.search);

    // When a filter is added to the filter bar?
    $scope.$listen(queryFilter, 'fetch', $scope.search);

    // When auto refresh happens
    $scope.$on('courier:searchRefresh', $scope.search);

    $scope.$on('fetch', $scope.search);

    $scope.$on('renderComplete', event => {
      event.stopPropagation();
      $element.trigger('renderComplete');
    });

    $scope.$watchCollection('vis.params.outputs', $scope.search);

});

module.controller('TransformVisEditorController', function ($scope) {

    $scope.options = chrome.getInjected('transformVisOptions');

});
