angular.module('auction').factory('$aside', ['$modal', function($modal) {
  var asideFactory = {
    open: function(config) {
      var options = angular.extend({}, config);
      // check placement is set correct
      // set aside classes
      options.windowClass = 'ng-aside horizontal left' + (options.windowClass ? ' ' + options.windowClass : '');
      // delete options.placement
      return $modal.open(options);
    }
  };
  return angular.extend({}, $modal, asideFactory);
}]);
