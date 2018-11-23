angular.module('auction').controller('ArchiveController', [
  'AuctionConfig', '$scope', '$http', '$location',
  function(AuctionConfig, $scope, $http, $location) {
  /*@ngInject;*/
  $scope.startid = false;
  function getJsonFromUrl() {
      var query = location.search.substr(1);
      var result = {};
      query.split("&").forEach(function(part) {
        var item = part.split("=");
        result[item[0]] = decodeURIComponent(item[1]);
      });
      return result;
  }
  var params = getJsonFromUrl()
  $scope.offset = params.offset || (new Date()).getTime();
  $scope.startid = params.startid || '';
  $scope.db_url = db_url || (location.protocol + '//' + location.host + "/" + window.db_name) || "";

  $http({
    method: 'GET',
    url: $scope.db_url + '/_design/auctions/_view/by_endDate',
    cache: true,
    params: {
      include_docs: true,
      startkey: $scope.offset,
      startkey_docid: $scope.startid,
      limit: 101,
      descending: true,
    },
  }).then(function(resp) {
    $scope.auctions = resp.data.rows;
    $scope.parseArchive = function(type) {
      var auctionType = type || 'default';
      if(auctionType === 'texas'){
        return 'texas-auctions';
      }
      else if (auctionType === 'dutch'){
        return 'insider-auctions';
      }
      else if (auctionType === 'simple' || auctionType === 'multilot' || auctionType === 'meat' || auctionType === 'default'){
        return 'auctions';
      }
    };
      $scope.offset = false;
      if (($scope.auctions || []).length > 100) {
        $scope.offset = $scope.auctions[100].key;
        $scope.startid = $scope.auctions[100].id;
      }
  });
}])
