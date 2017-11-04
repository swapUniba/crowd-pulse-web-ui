(function() {
    'use strict';

    angular
        .module('webUi')
        .factory('Stat', Stat);

    /** @ngInject */
    function Stat(Restangular) {
        var statsEndpoint = Restangular.all('stats');
        return {
            Terms: Restangular.service('terms', statsEndpoint),
            Sentiment: Restangular.service('sentiment', statsEndpoint),
            Topic: Restangular.service('topic', statsEndpoint),
            Cluster: Restangular.service('cluster', statsEndpoint),
            SentimentTimeline: Restangular.service('sentiment/timeline', statsEndpoint),
            MessageTimeline: Restangular.service('message/timeline', statsEndpoint),
            Graph: Restangular.service('profile/graph', statsEndpoint),
            TopicMessages: Restangular.service('topic/messages', statsEndpoint),
            ClusterMessages: Restangular.service('cluster/messages', statsEndpoint),
            SentimentMessages: Restangular.service('sentiment/messages', statsEndpoint),
            PersonalDataSource: Restangular.service('personal_data/source', statsEndpoint),
            PersonalDataGPSMap: Restangular.service('personal_data/gps', statsEndpoint),
            PersonalDataAppInfoBar: Restangular.service('personal_data/appinfo/bar', statsEndpoint),
            PersonalDataAppInfoTimeline: Restangular.service('personal_data/appinfo/timeline', statsEndpoint),
            PersonalDataNetStatBar: Restangular.service('personal_data/netstat/bar', statsEndpoint),
            PersonalDataNetStatTimeline: Restangular.service('personal_data/netstat/timeline', statsEndpoint),
            PersonalDataContactBar: Restangular.service('personal_data/contact/bar', statsEndpoint),
            PersonalDataDisplayBar: Restangular.service('personal_data/display/bar', statsEndpoint),
            Map: Restangular.service('map', statsEndpoint)
        };
    }

})();
