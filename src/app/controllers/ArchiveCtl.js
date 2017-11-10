angular.module('auction').controller('ArchiveController', [
  'AuctionConfig', '$scope', '$http', '$location',
  function(AuctionConfig, $scope, $http, $location) {
  /*@ngInject;*/
  $scope.startid = false;

  var params = $location.search();
  console.log(params);

  $scope.offset = params.offset || (new Date()).getTime() * 1000;
  var startkey_docid = params.startid || '';

  $http({
    method: 'GET',
    url: AuctionConfig.remote_db + '/_design/auctions/_view/by_endDate',
    cache: true,
    params: {
      include_docs: true,
      startkey: $scope.offset,
      startkey_docid: startkey_docid,
      limit: 101,
      descending: true,
    },
  }).then(function(resp) {
    $scope.auctions = resp.data.rows;
      $scope.offset = false;

      if (($scope.auctions || []).length > 100) {
        $scope.offset = $scope.auctions[100].key;
        $scope.startid = $scope.auctions[100].id;
      }
  });

  offset = false;

  if (($scope.auctions || []).lenght > 100) {
    $scope.offset = $scope.auctions[100].key;
    $scope.startid = $scope.auctions[100].id;
  }
}])