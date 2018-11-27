angular.module('auction').controller('ListingController', [
  'AuctionConfig', 'AuctionUtils', '$scope', '$http',
  function(AuctionConfig, AuctionUtils, $scope, $http) {
    /*@ngInject;*/

    $scope.auctions = [];
    $scope.offset = AuctionUtils.parseQueryString(location.search.substr(1)).offset;
    var offset = $scope.offset || 0;
    var rows_per_page = 10;
    var page = (offset / rows_per_page) + 1;
    var skip = page * rows_per_page;
    $scope.db_url = db_url || (location.protocol + '//' + location.host + "/" + window.db_name) || "";
    $http({
      method: 'GET',
      url: $scope.db_url + '/_design/auctions/_view/by_endDate',
      cache: true,
      params: {
        skip: skip,
        limit: rows_per_page,
        include_docs: true,
        startkey: (new Date()).getTime()
      },
    }).then(function(resp) {
      $scope.parseListing = function(type) {
        var auctionTypeOnListing = type || 'default';
        if(auctionTypeOnListing === 'texas'){
          return 'texas-auctions';
        }
        else if (auctionTypeOnListing === 'dutch'){
          return 'insider-auctions';
        }
        else if (auctionTypeOnListing === 'simple' || auctionTypeOnListing === 'multilot' || auctionTypeOnListing === 'meat' || auctionTypeOnListing === 'default'){
          return 'auctions';
        }
      };
      $scope.auctions = resp.data.rows;
      $scope.total_rows = resp.data.total_rows;
      $scope.offset = resp.data.offset;
    });
    $scope.hasPrev = function() { return page > 1; };
    $scope.hasNext = function() {
      var last_page = Math.floor($scope.total_rows / rows_per_page) + ($scope.total_rows % rows_per_page);
      return page != last_page && $scope.auctions.length > 0;
    };
  }
]);

