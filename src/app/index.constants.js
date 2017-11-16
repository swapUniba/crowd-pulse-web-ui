/* global io:false, moment:false, FileReader:false, sigma:false */
(function() {
  'use strict';

  angular
    .module('webUi')
    .constant('io', io)
    .constant('moment', moment)
    .constant('FileReader', FileReader)
    .constant('Sigma', sigma);

  angular.module('webUi')
    .constant('filterDb', 'DB')
    .constant('filterTerm', 'T')
    .constant('filterQuery', 'Q')
    .constant('filterDateRange', 'D')
    .constant('filterProfile', 'P')
    .constant('filterIndex', 'I')
    .constant('filterSentiment', 'S')
    .constant('filterLanguage', 'L')
    .constant('filterDistance', 'DI')
    .constant('filterDateRangeWithHour', 'H')
    .constant('filterLimitResults', 'LI')
    .constant('groupByCategory', 'GC');


})();
