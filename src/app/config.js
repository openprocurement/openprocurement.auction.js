angular.module('auction').config([
  '$qProvider', '$logProvider', '$httpProvider', 'AuctionConfig', 'growlProvider', 'GTMLoggerProvider',
  function ($qProvider, $logProvider, $httpProvider, AuctionConfig, growlProvider, GTMLoggerProvider) {
    $qProvider.errorOnUnhandledRejections(false);
    $httpProvider.defaults.withCredentials = true;
    GTMLoggerProvider.level('INFO').includeTimestamp(true);
    $logProvider.debugEnabled(AuctionConfig.debug); // default is true
    growlProvider.globalTimeToLive({
      success: 4000,
      error: 10000,
      warning: 10000,
      info: 4000
    });
    growlProvider.globalPosition('top-center');
    growlProvider.onlyUniqueMessages(false);
  }
]);
