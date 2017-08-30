angular.module('auction').controller('ListingController',[
    'AuctionConfig', '$scope', '$http',
    function (AuctionConfig, $scope, $http) {
	/*@ngInject;*/
	
	$scope.db_url = (location.protocol + '//' + location.host + "/" +  window.db_name ) || "";
	$http({
	    method: 'GET',
	    url: $scope.db_url + '/_design/auctions/_view/by_endDate',
	    cache: true,
	    params: {
		include_docs: true,
		startkey: (new Date()).getTime()
	    },
	}).then(function(resp) {
	    console.log($scope.auctions);
	    $scope.auctions = resp.data.rows;
	});
}]);
