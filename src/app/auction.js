var appRequires = [
  'ui.bootstrap',
  'ngCookies',
  'pascalprecht.translate',
  'timer',
  'angular-growl',
  'angular-ellipses',
  'GTMLogger',
];

var db = {},
  bidder_id = "0",
  db_url = db_url || (location.protocol + '//' + location.host + "/" + window.db_name) || "",
  _LTracker = _LTracker || [],
  dataLayer = dataLayer || [];

angular.module('auction', appRequires)
  .constant('AuctionConfig', {
    remote_db: db_url,
    restart_retries: 10,
    default_lang: 'uk',
    debug: false
  });

function logMSG(MSG) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", '/log', true);
  xmlHttp.send(JSON.stringify(MSG));
}
