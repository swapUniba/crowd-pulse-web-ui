(function() {
    'use strict';

    angular
        .module('webUi')
        .directive('sidenavView', sidenavView);

    /** @ngInject */
    function sidenavView() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/sidenav-view/sidenav-view.html',
            scope: {
                params: '='
            },
            controller: SidenavViewController,
            controllerAs: 'sidenavViewVm',
            bindToController: true
        };

        return directive;

        /** @ngInject */
        function SidenavViewController($state, $scope, $stateParams, Database, Term, Profile, Corpus, Language,
                                       filterDb, filterTerm, filterQuery, filterDateRange, filterProfile, filterIndex,
                                       filterSentiment, filterLanguage, filterDistance) {
            var sidenavViewVm = this;



            $scope.range = function(min, max, step) {
                step = step || 1;
                var input = [];
                for (var i = min; i <= max; i += step) {
                    input.push(i);
                }
                return input;
            };

            // expose constant on controller in order to use them in the view
            sidenavViewVm.filterDb = filterDb;
            sidenavViewVm.filterTerm = filterTerm;
            sidenavViewVm.filterQuery = filterQuery;
            sidenavViewVm.filterDateRange = filterDateRange;
            sidenavViewVm.filterProfile = filterProfile;
            sidenavViewVm.filterIndex = filterIndex;
            sidenavViewVm.filterSentiment = filterSentiment;
            sidenavViewVm.filterLanguage = filterLanguage;
            sidenavViewVm.filterDistance = filterDistance;

            // available data visualizations
            sidenavViewVm.viz = [
                {group: 'Words', id: 'word-cloud', name: 'Word Cloud', filters: [filterDb, filterTerm, filterQuery, filterDateRange, filterSentiment, filterLanguage, filterDistance]},
                {group: 'Words', id: 'word-pie', name: 'Pie Chart', filters: [filterDb, filterTerm, filterQuery, filterDateRange, filterSentiment, filterLanguage, filterDistance]},
                {group: 'Words', id: 'word-bar', name: 'Bar Chart', filters: [filterDb, filterTerm, filterQuery, filterDateRange, filterSentiment, filterLanguage, filterDistance]},
                {group: 'Sentiment', id: 'sentiment-pie', name: 'Pie Chart', filters: [filterDb, filterTerm, filterQuery, filterDateRange, filterSentiment, filterLanguage, filterDistance]},
                {group: 'Sentiment', id: 'sentiment-bar', name: 'Bar Chart', filters: [filterDb, filterTerm, filterQuery, filterDateRange, filterSentiment, filterLanguage, filterDistance]},
                {group: 'Sentiment', id: 'sentiment-timeline', name: 'Timeline', filters: [filterDb, filterTerm, filterQuery, filterDateRange, filterSentiment, filterLanguage, filterDistance]},
                {group: 'Others', id: 'message-timeline', name: 'Message Timeline', filters: [filterDb, filterTerm, filterQuery, filterDateRange, filterSentiment, filterLanguage, filterDistance]},
                {group: 'Others', id: 'profile-graph', name: 'Profile Graph', filters: [filterDb, filterProfile]},
                {group: 'Others', id: 'index-search', name: 'Index Search', filters: [filterIndex]},
                {group: 'Topic LDA', id: 'topic-pie', name: 'Pie Chart', filters: [filterDb, filterTerm, filterQuery, filterDateRange, filterSentiment, filterLanguage, filterDistance]},
                {group: 'Topic LDA', id: 'topic-bar', name: 'Bar Chart', filters: [filterDb, filterTerm, filterQuery, filterDateRange, filterSentiment, filterLanguage, filterDistance]},
                {group: 'Topic kmeans', id: 'cluster-pie', name: 'Pie Chart', filters: [filterDb, filterTerm, filterQuery, filterDateRange, filterSentiment, filterLanguage, filterDistance]},
                {group: 'Topic kmeans', id: 'cluster-bar', name: 'Bar Chart', filters: [filterDb, filterTerm, filterQuery, filterDateRange, filterSentiment, filterLanguage, filterDistance]},
                {group: 'Personal Data', id: 'personaldatasource-pie', name: 'Source Stat Pie Chart', filters: [filterDb]},
                {group: 'Personal Data', id: 'personaldatagps-map', name: 'GPS Map', filters: [filterDb, filterDateRange, filterDistance]},
                {group: 'Personal Data', id: 'personaldataappinfo-bar', name: 'App Bar Chart', filters: [filterDb, filterDateRange]},
                {group: 'Personal Data', id: 'personaldatanetstat-bar', name: 'NetStat Bar Chart', filters: [filterDb, filterDateRange]},
                {group: 'Personal Data', id: 'personaldatacontact-bar', name: 'Contact Bar Chart', filters: [filterDb]},
                {group: 'Personal Data', id: 'personaldataappinfo-timeline', name: 'App Timeline', filters: [filterDb, filterDateRange]},
                {group: 'Personal Data', id: 'personaldatanetstat-timeline', name: 'NetStat Timeline', filters: [filterDb, filterDateRange]},
                {group: 'Map', id: 'map', name: 'Map', filters: [filterDb, filterTerm, filterQuery, filterDateRange, filterSentiment, filterLanguage, filterDistance]}
            ];

            /**
             * Check if the currently selected data visualization can be filtered on the given parameter.
             */
            sidenavViewVm.hasParam = function(filter) {
                var curViz = sidenavViewVm.viz.filter(function(viz) {
                    return viz.id === sidenavViewVm.params.dataViz;
                });
                if (curViz && curViz.length === 1) {
                    return curViz[0].filters.indexOf(filter) >= 0;
                }
                return false;
            };

            // available filters on the data
            sidenavViewVm.availableFilters = [
                {name: 'all', type: ''},
                {name: 'tags', type: 'tag'},
                {name: 'categories', type: 'category'},
                {name: 'tokens', type: 'token'}];

            // available filters on the sentiment
            sidenavViewVm.availableSentiments = [
                {name: 'all', type: ''},
                {name: 'positive', type: 'positive'},
                {name: 'negative', type: 'negative'},
                {name: 'neutral', type: 'neutral'}];


            // available filters on the language
            sidenavViewVm.availableLanguages = [
                {name: 'all', type: ''},
                {name: 'it', type: 'it'},
                {name: 'en', type: 'en'}];

            // available index types
            sidenavViewVm.availableIndexTypes = [
                {name: 'lemmas', type: 'lemmas'},
                {name: 'stems', type: 'stems'},
                {name: 'tokens', type: 'tokens'},
                {name: 'POS tag tokens', type: 'postagtoken'}];

            // available index types
            sidenavViewVm.availableEngines = [
                {name: 'Spark', type: 'spark'},
                {name: 'Semantic Vectors', type: 'semanticvectors'}];

            var paramsToArray = function(param) {
                var array = [];
                if (angular.isArray(param)) {
                    array = param;
                } else if (angular.isDefined(param)) {
                    array = [param];
                }
                return array;
            };

            // init the sidenav parameters with the state parameters
            sidenavViewVm.params.dataViz = $stateParams.chartType;
            sidenavViewVm.params.database = $stateParams.db;
            if ($stateParams.from) {
                sidenavViewVm.params.fromDate = new Date($stateParams.from);
            }
            if ($stateParams.to) {
                sidenavViewVm.params.toDate = new Date($stateParams.to);
            }
            sidenavViewVm.params.filterOn = $stateParams.filter || '';
            sidenavViewVm.params.query = paramsToArray($stateParams.search);
            sidenavViewVm.params.users = paramsToArray($stateParams.users);
            sidenavViewVm.params.corpus = $stateParams.corpus;
            sidenavViewVm.params.indexType = $stateParams.indexType;
            sidenavViewVm.params.index = paramsToArray($stateParams.index);
            sidenavViewVm.params.engine = $stateParams.engine;
            sidenavViewVm.params.sentiment = $stateParams.sentiment;
            sidenavViewVm.params.language = $stateParams.language;
            sidenavViewVm.params.lat = $stateParams.lat;
            sidenavViewVm.params.lng = $stateParams.lng;
            sidenavViewVm.params.ray = $stateParams.ray;

            // when the type of filter or the database changes, remove the query parameters
            $scope.$watchGroup(['sidenavViewVm.params.filterOn', 'sidenavViewVm.params.database'],
                function(newValues, oldValues) {
                    // only reset when the previous values weren't undefined
                    if ((angular.isDefined(oldValues[0]) && oldValues[0] !== newValues[0]) ||
                        (angular.isDefined(oldValues[1]) && oldValues[1] !== newValues[1])) {
                        sidenavViewVm.params.query = [];
                    }
                });

            // when any of the parameters changes, set the new query string
            $scope.$watch('sidenavViewVm.params', function(newParams) {
                var newStateParams = {
                    chartType: newParams.dataViz,
                    db: newParams.database,
                    filter: newParams.filterOn,
                    search: newParams.query,
                    users: newParams.users,
                    corpus: newParams.corpus,
                    index: newParams.index,
                    indexType: newParams.indexType,
                    engine: newParams.engine,
                    sentiment: newParams.sentiment,
                    language: newParams.language,
                    lat: newParams.lat,
                    lng: newParams.lng,
                    ray: newParams.ray
                };
                newStateParams.from = newParams.fromDate ? newParams.fromDate.toISOString() : null;
                newStateParams.to = newParams.toDate ? newParams.toDate.toISOString() : null;
                return $state.go('app.view', newStateParams);
            }, true);

            // fetch databases, when done set the db in the querystring, if any
            Database.getList().then(function(dbs) {
                sidenavViewVm.databases = dbs;
                if (angular.isDefined($stateParams.db)) {
                    sidenavViewVm.params.database = $stateParams.db;
                }
            });

            // fetch indexed corpora, when done set the corpus in the querystring, if any
            Corpus.getList().then(function(corpora) {
                sidenavViewVm.corpora = corpora;
                if (angular.isDefined($stateParams.corpus)) {
                    sidenavViewVm.params.corpus = $stateParams.corpus;
                }
            });

            // search for filter-specific elements
            sidenavViewVm.queryForElement = function(query, type) {
                return Term.getList({
                    db: sidenavViewVm.params.database,
                    type: type,
                    term: query
                });
            };

            /*
        sidenavViewVm.availableLanguages = function() {
            return Language.getList({
              db: sidenavViewVm.params.database
            });
          };
    */
            sidenavViewVm.queryForUser = function(username) {
                return Profile.getList({
                    db: sidenavViewVm.params.database,
                    username: username
                });
            };
        }
    }

})();
