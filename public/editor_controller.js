import { uiModules } from 'ui/modules';
import { SavedObjectsClientProvider } from 'ui/saved_objects';
import chrome from 'ui/chrome';

const module = uiModules.get('kibana/transform_vis', ['kibana']);

module.controller('TransformVisEditorController', function ($scope, Private, indexPatterns) {
    
    const savedObjectsClient = Private(SavedObjectsClientProvider);
    $scope.options = chrome.getInjected('transformVisOptions');    
    
    const patterns = savedObjectsClient.find({
        type: 'index-pattern',
        fields: ['title'],
        perPage: 10000
    }).then(response => {    
        $scope.indexPatternOptions = response.savedObjects;
    });


});