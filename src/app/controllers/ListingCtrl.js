angular.module('auction').controller('ListingController',[
  'AuctionConfig', '$scope', '$http',
  function (AuctionConfig, $scope, $http) {
  /*@ngInject;*/
  
  $scope.url = location.protocol + '//' + location.host + '/tenders';
  $http({
    method: 'GET',
    url: AuctionConfig.remote_db + '/_design/auctions/_view/by_endDate',
    cache: true,
    params: {
      include_docs: true,
      startkey: (new Date()).getTime()
    },
  }).then(function(resp) {
    $scope.auctions = resp.data.rows;
  });
}]);