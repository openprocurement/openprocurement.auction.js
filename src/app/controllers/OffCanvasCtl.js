angular.module('auction').controller('OffCanvasController', [
  '$scope', '$modalInstance',
  function($scope, $modalInstance) {
    $scope.allert = function() {
      console.log($scope);
    };
    $scope.ok = function() {
      $modalInstance.close($scope.selected.item);
    };
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  }
]);
