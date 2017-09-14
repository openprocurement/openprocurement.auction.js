requires = [
  'angular-growl',
  'GTMLogger'
];


angular.module('auction', requires).constant(
  'AuctionConfig', {
    db_url: (location.protocol + '//' + location.host + '/auctions/') || ""
  });
