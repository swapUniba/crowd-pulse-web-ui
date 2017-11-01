(function() {
    'use strict';

    angular
        .module('webUi')
        .controller('ViewIndexController', ViewIndexController);

    /* global Highcharts:false */
    /** @ngInject */
    function ViewIndexController($mdSidenav, $cookies, $state, $mdDialog, $scope, $timeout, $window, $q, $http, Stat, config, leafletData) {
        var vm = this;

        vm.params = {};

        $scope.center = {
            lat: 41.60722821271717,
            lng: 13.348388671875,
            zoom: 6
        };

        $scope.layers = {
            baselayers: {
                osm: {
                    name: 'OpenStreetMap',
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    type: 'xyz'
                }
            },
            overlays: {}
        };
        $scope.controls = {};

        $scope.paths = {};

        // CHART BUILDERS

        var buildBaseHighcharts = function(type) {
            return {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: type
                },
                title: {
                    text: null
                },
                exporting: {
                    buttons: {
                        contextButton: {
                            enabled: false
                        }
                    }
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                }
            };
        };

        var buildPieChart = function(title, values) {
            var chart = buildBaseHighcharts('pie');
            chart.tooltip = {
                pointFormat: '{series.name}: <b>{point.y} ({point.percentage:.1f}%)</b>'
            };
            chart.plotOptions = {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f}%)',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            };
            chart.series = [{
                name: title,
                colorByPoint: true,
                data: values
            }];
            return chart;
        };

        var buildPieChartTopic = function(title, values) {
            var chart = buildBaseHighcharts('pie');
            chart.tooltip = {
                pointFormat: '{series.name}: <b>{point.y} ({point.percentage:.1f}%)</b>'
            };
            chart.plotOptions = {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f}%)',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            };
            chart.series = [{
                name: title,
                colorByPoint: true,
                data: values,
                point:{
                    events:{
                        click: function () {
                            vm.params.topic=this.name;
                            vm.params.dataViz = 'topic-messages';
                            $state.go('app.view',vm.params);
                            $mdSidenav('main-sidenav').close();
                        }
                    }
                }
            }];
            return chart;
        };

        var buildPieChartCluster = function(title, values) {
            var chart = buildBaseHighcharts('pie');
            chart.tooltip = {
                pointFormat: '{series.name}: <b>{point.y} ({point.percentage:.1f}%)</b>'
            };
            chart.plotOptions = {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f}%)',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            };
            chart.series = [{
                name: title,
                colorByPoint: true,
                data: values,
                point:{
                    events:{
                        click: function () {
                            vm.params.topic=this.name;
                            vm.params.dataViz = 'cluster-messages';
                            $state.go('app.view',vm.params);
                            $mdSidenav('main-sidenav').close();
                        }
                    }
                }
            }];
            return chart;
        };

        var buildPieChartPersonalData = function(title, values) {
            var chart = buildBaseHighcharts('pie');
            chart.tooltip = {
                pointFormat: '{series.name}: <b>{point.y} ({point.percentage:.1f}%)</b>'
            };
            chart.plotOptions = {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f}%)',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            };
            chart.series = [{
                name: title,
                colorByPoint: true,
                data: values
            }];
            return chart;
        };

        var buildPieChartSentiment = function(title, values) {
            var chart = buildBaseHighcharts('pie');
            chart.tooltip = {
                pointFormat: '{series.name}: <b>{point.y} ({point.percentage:.1f}%)</b>'
            };
            chart.plotOptions = {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f}%)',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            };
            chart.series = [{
                name: title,
                colorByPoint: true,
                data: values,
                point:{
                    events:{
                        click: function () {
                            vm.params.topic=this.name;
                            vm.params.dataViz = 'sentiment-messages';
                            $state.go('app.view',vm.params);
                            $mdSidenav('main-sidenav').close();
                        }
                    }
                }
            }];
            return chart;
        };


        var buildBarChart = function(xTitle, xValues, yTitle, yValues) {
            var chart = buildBaseHighcharts('bar');
            chart.tooltip = {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            };
            chart.xAxis = {
                categories: xValues,
                title: {
                    text: xTitle
                }
            };
            chart.yAxis = {
                title: {
                    text: yTitle
                },
                labels: {
                    overflow: 'justify'
                }
            };
            chart.series = [{
                name: yTitle,
                colorByPoint: true,
                data: yValues
            }];
            return chart;
        };

        var buildBarChartTopic = function(xTitle, xValues, yTitle, yValues) {
            var chart = buildBaseHighcharts('bar');
            chart.tooltip = {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            };
            chart.xAxis = {
                categories: xValues,
                title: {
                    text: xTitle
                }
            };
            chart.yAxis = {
                title: {
                    text: yTitle
                },
                labels: {
                    overflow: 'justify'
                }
            };
            chart.series = [{
                name: yTitle,
                colorByPoint: true,
                data: yValues,
                point:{
                    events:{
                        click: function () {
                            vm.params.topic=this.category;
                            vm.params.dataViz = 'topic-messages';
                            $state.go('app.view',vm.params);
                            $mdSidenav('main-sidenav').close();
                        }
                    }
                }
            }];
            return chart;
        };

        var buildBarChartCluster = function(xTitle, xValues, yTitle, yValues) {
            var chart = buildBaseHighcharts('bar');
            chart.tooltip = {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            };
            chart.xAxis = {
                categories: xValues,
                title: {
                    text: xTitle
                }
            };
            chart.yAxis = {
                title: {
                    text: yTitle
                },
                labels: {
                    overflow: 'justify'
                }
            };
            chart.series = [{
                name: yTitle,
                colorByPoint: true,
                data: yValues,
                point:{
                    events:{
                        click: function () {
                            vm.params.topic=this.category;
                            vm.params.dataViz = 'cluster-messages';
                            $state.go('app.view',vm.params);
                            $mdSidenav('main-sidenav').close();
                        }
                    }
                }
            }];
            return chart;
        };

        var buildBarChartSentiment = function(xTitle, xValues, yTitle, yValues) {
            var chart = buildBaseHighcharts('bar');
            chart.tooltip = {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            };
            chart.xAxis = {
                categories: xValues,
                title: {
                    text: xTitle
                }
            };
            chart.yAxis = {
                title: {
                    text: yTitle
                },
                labels: {
                    overflow: 'justify'
                }
            };
            chart.series = [{
                name: yTitle,
                colorByPoint: true,
                data: yValues,
                point:{
                    events:{
                        click: function () {
                            vm.params.topic=this.category;
                            vm.params.dataViz = 'sentiment-messages';
                            $state.go('app.view',vm.params);
                            $mdSidenav('main-sidenav').close();
                        }
                    }
                }
            }];
            return chart;
        };

        var buildPersonalDataAppInfoBar = function(xTitle, xValues, yTitle, yValues) {
            var chart = buildBaseHighcharts('bar');
            chart.tooltip = {
                pointFormat: '{series.packageName}: <b>{point.y}</b>'
            };
            chart.xAxis = {
                categories: xValues,
                title: {
                    text: xTitle
                }
            };
            chart.yAxis = {
                title: {
                    text: yTitle
                },
                labels: {
                    overflow: 'justify'
                }
            };
            chart.series = [{
                name: yTitle,
                colorByPoint: true,
                data: yValues
            }];
            return chart;
        };

        var buildTimelineChart = function(title, series) {
            var chart = buildBaseHighcharts('spline');
            chart.xAxis = {
                type: 'datetime',
                dateTimeLabelFormats: {
                    month: '%e. %b',
                    year: '%b'
                },
                title: {
                    text: 'Date'
                }
            };
            chart.yAxis = {
                title: {
                    text: title
                }
            };
            chart.tooltip = {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '{point.x:%e. %b}: {point.y:.2f}'
            };
            chart.plotOptions = {
                spline: {
                    marker: {
                        enabled: true
                    }
                }
            };
            chart.series = series;
            return chart;
        };

        $http.get("../app/json/region.json").success(function(data, status) {
            angular.extend($scope.layers.overlays, {
                countries: {
                    name:'Italian region',
                    type: 'geoJSONShape',
                    data: data,
                    visible: true,
                    layerOptions: {
                        style: {
                            color: '#00D',
                            fillColor: 'red',
                            weight: 2.0,
                            opacity: 0.6,
                            fillOpacity: 0.2
                        }
                    }
                },
                search: {
                    name: 'Search',
                    type: 'group',
                    visible: true,
                }
            });
            leafletData.getLayers().then(function(baselayers) {
                console.log(baselayers.overlays.search);
                $scope.controls = {
                    search: {
                        layer: baselayers.overlays.search,
                        zoom: 20
                    }
                };
            });
        });

        var buildPersonalDataGPSMap = function (points) {
            var gpsPoints = [];
            var markers = [];

            for(var i = 0; i < points.length; i++) {
                markers.push({
                    lat: points[i].latitude,
                    lng: points[i].longitude,
                    layer: 'search',
                    focus: true,
                    draggable: false
                });
                gpsPoints.push({
                    lat: points[i].latitude,
                    lng: points[i].longitude
                });
            }

            angular.extend($scope.paths, {
                defaultPath: {
                    opacity: 0.35,
                    weight: 5,
                    type: "polyline",
                    latlngs: gpsPoints
                }
            });

            var chart = {
                markers: {
                    messages: markers
                },
                events: {markers:{}}
            };
            return chart;
        };

        var buildMapChart = function(points) {

            var markers = [];
            var heatMap = [];

            for(var i = 0; i < points.length; i++){
                var mark = {
                    lat: points[i].latitude,
                    lng: points[i].longitude,
                    focus: true,
                    title: points[i].text,
                    message: points[i].text,
                    layer: 'search',
                    draggable: false
                };

                var mark2 = {
                    lat: points[i].latitude,
                    lng: points[i].longitude,
                    focus: true,
                    message: points[i].text,
                    layer: 'cluster',
                    draggable: false
                };

                var heatPoint = [
                    points[i].latitude,
                    points[i].longitude,
                    "1500"
                ];

                markers.push(mark);
                markers.push(mark2);
                heatMap.push(heatPoint);

            }

            angular.extend($scope.layers.overlays, {
                heat: {
                    name: 'Heat Map',
                    type: 'heat',
                    data: heatMap,
                    layerOptions: {
                        radius: 40,
                        blur: 15
                    },
                    visible: true,
                    doRefresh: true
                },
                cluster: {
                    name: 'Cluster',
                    type: 'markercluster',
                    visible: true
                }

            });

            $scope.center = {
                lat: 41.60722821271717,
                lng: 13.348388671875,
                zoom: 6
            };

            var chart = {
                markers: {
                    messages: markers
                },
                events: {markers:{}}
            };
            return chart;
        };

        // REST FETCHERS

        var buildStatParams = function() {
            return {
                db: vm.params.database,
                type: vm.params.filterOn,
                terms: vm.params.query,
                from: vm.params.fromDate,
                to: vm.params.toDate,
                users: vm.params.users,
                topic: vm.params.topic,
                sentiment: vm.params.sentiment,
                language: vm.params.language,
                lat: vm.params.lat,
                lng: vm.params.lng,
                ray: vm.params.ray
            };
        };

        var getStatWords = function() {
            return Stat.Terms.getList(buildStatParams());
        };

        var getStatSentiment = function() {
            return Stat.Sentiment.getList(buildStatParams());
        };

        var getStatTopic = function() {
            return Stat.Topic.getList(buildStatParams());
        };

        var getStatCluster = function() {
            return Stat.Cluster.getList(buildStatParams());
        };

        var getStatTopicMessages = function() {
            return Stat.TopicMessages.getList(buildStatParams());
        };

        var getStatClusterMessages = function() {
            return Stat.ClusterMessages.getList(buildStatParams());
        };

        var getStatSentimentMessages = function() {
            return Stat.SentimentMessages.getList(buildStatParams());
        };

        var getStatMap = function() {
            return Stat.Map.getList(buildStatParams());
        };

        var getTimelineSentiment = function() {
            return Stat.SentimentTimeline.getList(buildStatParams());
        };

        var getTimelineMessage = function() {
            return Stat.MessageTimeline.getList(buildStatParams());
        };

        var getProfileGraph = function() {
            return Stat.Graph.one().get(buildStatParams());
        };

        var getPersonalDataSource = function() {
            return Stat.PersonalDataSource.getList({db: vm.params.database});
        };

        var getPersonalDataGPSMap = function() {
            var filter = {
                db: vm.params.database,
                from: vm.params.fromDate,
                to: vm.params.toDate,
                lat: vm.params.lat,
                lng: vm.params.lng,
                ray: vm.params.ray
            };
            return Stat.PersonalDataGPSMap.getList(filter);
        };

        var getStatPersonalDataAppInfoBar = function () {
            var filter = {
                db: vm.params.database,
                from: vm.params.fromDate,
                to: vm.params.toDate
            };
            return Stat.PersonalDataAppInfoBar.getList(filter);
        };

        var getStatPersonalDataAppInfoTimeline = function () {
            var filter = {
                db: vm.params.database,
                from: vm.params.fromDate,
                to: vm.params.toDate
            };
            return Stat.PersonalDataAppInfoTimeline.getList(filter);
        };

        var getStatPersonalDataNetStatTimeline = function () {
            var filter = {
                db: vm.params.database,
                from: vm.params.fromDate,
                to: vm.params.toDate
            };
            return Stat.PersonalDataNetStatTimeline.getList(filter);
        };

        // REST TO CHART MAPPERS

        var matStatToPie = function(stats) {
            return stats.map(function(stat) {
                return {
                    name: stat.name,
                    y: stat.value
                };
            });
        };

        var mapStatToBar = function(stats) {
            var cats = stats.map(function(stat) {
                return stat.name;
            });
            var series = stats.map(function(stat) {
                return stat.value;
            });
            return [cats, series];
        };

        var mapAppInfoToBar = function(stats) {
            var cats = stats.map(function(stat) {
                return stat.packageName;
            });
            var series = stats.map(function(stat) {
                return stat.totalForegroundTime;
            });
            return [cats, series];
        };

        var mapStatToTimeline = function(stats) {
            return stats.map(function(stat) {
                var color = '#000000';
                if (stat.name === 'positive') {
                    color = '#73E639';
                } else if (stat.name === 'negative') {
                    color = '#E63939';
                }
                return {
                    name: stat.name,
                    data: stat.values.map(function(elem) {
                        return [(new Date(elem.date)).getTime(), elem.value];
                    }),
                    color: color
                };
            });
        };

        var mapAppInfoToTimeline = function (stats) {
            return stats.map(function(stat) {
                return {
                    name: stat.name,
                    data: stat.values.sort(function(a,b) {return a.date - b.date;}).map(function(elem) {
                        return [(new Date(elem.date * 86400000)).getTime(), elem.value];
                    }),
                    color: "#000000"
                };
            });
        };

        var mapNetStatToTimeline = function (stats) {
            return stats.map(function(stat) {
                var color = '#000000';
                if (stat.networkType.startsWith('wifi')) {
                    color = '#73E639';
                } else if (stat.networkType.startsWith('mobile')) {
                    color = '#E63939';
                }
                return {
                    name: stat.networkType,
                    data: stat.values.sort(function(a,b) {return a.date - b.date;}).map(function(elem) {
                        return [(new Date(elem.date * 86400000)).getTime(), elem.value];
                    }),
                    color: color
                };
            });
        };

        var setRxAndTxBytes = function (stats) {
            var newStats = [];
            for (var i = 0; i < stats.length; i++) {

                newStats.push({
                    networkType: stats[i].networkType + "-received",
                    values: stats[i].values.map(function(val) {
                        return {
                            date: val.date,
                            value: val.totalRxBytes
                        };
                    })
                });

                newStats.push({
                    networkType: stats[i].networkType + "-transmitted",
                    values: stats[i].values.map(function(val) {
                        return {
                            date: val.date,
                            value: val.totalTxBytes
                        };
                    })
                });
            }
            return newStats;
        };

        var mapStatToGpsMap = function(stats) {
            return stats.map(function(stat) {
                return {
                    latitude: stat.latitude,
                    longitude: stat.longitude
                };
            });
        };

        // CHART GENERATION HANDLERS

        var statWordCloud = function() {
            return getStatWords()
                .then(function(stats) {
                    return stats.map(function(stat) {
                        return {
                            text: stat.name,
                            weight: stat.value
                        };
                    });
                })
                .then(function(stats) {
                    vm.stat = stats;
                });
        };

        var statWordPie = function() {
            return getStatWords()
                .then(matStatToPie)
                .then(function(stats) {
                    vm.stat = buildPieChart('Occurrences', stats);
                });
        };

        var statWordBar = function() {
            return getStatWords()
                .then(mapStatToBar)
                .then(function(categoriesSeries) {
                    vm.stat = buildBarChart(vm.params.filterOn, categoriesSeries[0], 'Occurrences',
                        categoriesSeries[1]);
                });
        };

        var statSentimentPie = function() {
            return getStatSentiment()
                .then(matStatToPie)
                .then(function(stats) {
                    vm.stat = buildPieChartSentiment('Sentiments', stats);
                });
        };

        var statTopicPie = function() {
            return getStatTopic()
                .then(matStatToPie)
                .then(function(stats) {
                    vm.stat = buildPieChartTopic('Topics', stats);
                });
        };

        var statTopicBar = function() {
            return getStatTopic()
                .then(mapStatToBar)
                .then(function(categoriesSeries) {
                    vm.stat = buildBarChartTopic(vm.params.filterOn, categoriesSeries[0], 'Topics',
                        categoriesSeries[1]);
                });
        };

        var statClusterPie = function() {
            return getStatCluster()
                .then(matStatToPie)
                .then(function(stats) {
                    vm.stat = buildPieChartCluster('Clusters', stats);
                });
        };

        var statClusterBar = function() {
            return getStatCluster()
                .then(mapStatToBar)
                .then(function(categoriesSeries) {
                    vm.stat = buildBarChartCluster(vm.params.filterOn, categoriesSeries[0], 'Clusters',
                        categoriesSeries[1]);
                });
        };


        var statTopicMessages = function() {
            return getStatTopicMessages()
                .then(function(stats) {
                    vm.stat = stats;
                });
        };

        var statClusterMessages = function() {
            return getStatClusterMessages()
                .then(function(stats) {
                    vm.stat = stats;
                });
        };

        var statSentimentMessages = function() {
            return getStatSentimentMessages()
                .then(function(stats) {
                    vm.stat = stats;
                });
        };

        var statPersonalDataSource = function() {
            return getPersonalDataSource()
                .then(matStatToPie)
                .then(function (stats) {
                    vm.stat = buildPieChartPersonalData("Personal Data", stats);
                });
        };

        var statPersonalDataGPSMap = function () {
            return getPersonalDataGPSMap()
                .then(mapStatToGpsMap)
                .then(function (stats) {
                    vm.stat = buildPersonalDataGPSMap(stats);
                });
        };

        var statPersonalDataAppInfoBar = function () {
            return getStatPersonalDataAppInfoBar()
                .then(mapAppInfoToBar)
                .then(function (stats) {
                    vm.stat = buildPersonalDataAppInfoBar("Package Name", stats[0],
                        "Total Foreground Time", stats[1]);
                });
        };

        var statPersonalDataAppInfoTimeline = function () {
            return getStatPersonalDataAppInfoTimeline()
                .then(mapAppInfoToTimeline)
                .then(function (timeline) {
                    vm.stat = buildTimelineChart("App Usage Distribution", timeline);
                });
        };

        var statPersonalDataNetStatTimeline = function () {
            return getStatPersonalDataNetStatTimeline()
                .then(setRxAndTxBytes)
                .then(mapNetStatToTimeline)
                .then(function (timeline) {
                    vm.stat = buildTimelineChart("Network Statistics (Rx and Tx bytes)", timeline);
                });
        };

        var statMap = function() {
            return getStatMap()
                .then(function(stats) {
                    vm.stat = buildMapChart(stats);
                });
        };
        var statSentimentBar = function() {
            return getStatSentiment()
                .then(mapStatToBar)
                .then(function(categoriesSeries) {
                    vm.stat = buildBarChartSentiment(vm.params.filterOn, categoriesSeries[0], 'Sentiments',
                        categoriesSeries[1]);
                });
        };

        var statSentimentTimeline = function() {
            return getTimelineSentiment()
                .then(mapStatToTimeline)
                .then(function(timeline) {
                    vm.stat = buildTimelineChart('Sentiment Distribution', timeline);
                });
        };

        var statMessageTimeline = function() {
            return getTimelineMessage()
                .then(mapStatToTimeline)
                .then(function(timeline) {
                    vm.stat = buildTimelineChart('Message Distribution', timeline);
                });
        };

        var statProfileGraph = function() {
            return getProfileGraph()
                .then(function(graph) {
                    var N = graph.nodes.length;
                    // add label, size; infer position on circumference
                    for (var i = 0; i < graph.nodes.length; i++) {
                        graph.nodes[i].label = graph.nodes[i].id;
                        graph.nodes[i].size = 0.3;
                        graph.nodes[i].x = 100 * Math.cos(2 * i * Math.PI / N);
                        graph.nodes[i].y = 100 * Math.sin(2 * i * Math.PI / N);
                        // if the node is one of the currently searched users, highlight it
                        if (vm.params.users.indexOf(graph.nodes[i].id) >= 0) {
                            graph.nodes[i].size = 1;
                            graph.nodes[i].color = '#E91E63';
                        }
                    }
                    // set an edge id based on the "source-->target" template
                    for (var j = 0; j < graph.edges.length; j++) {
                        graph.edges[j].id = graph.edges[j].source + '-->' + graph.edges[j].target;
                    }
                    return graph;
                })
                .then(function(graph) {
                    vm.stat = graph;
                });
        };

        var indexSearch = function() {
            // if any of the needed parameters isn't available build nothing
            if (!(angular.isDefined(vm.params.engine) && angular.isDefined(vm.params.corpus) &&
                    angular.isDefined(vm.params.index) && angular.isDefined(vm.params.indexType))) {
                return;
            }
            var promises = vm.params.index.map(function(index) {
                return $http.get(config.index + 'ml/word2vec/' +
                    vm.params.engine + '/' + vm.params.corpus + '/' +
                    index + '/' + vm.params.indexType)
                    .then(function(res) {
                        res.data.term = index;
                        return res.data;
                    });
            });
            return $q.all(promises)
                .then(function(data) {
                    vm.stat = data;
                });
        };

        var handlers = {
            'word-cloud': statWordCloud,
            'word-pie': statWordPie,
            'word-bar': statWordBar,
            'sentiment-pie': statSentimentPie,
            'topic-pie': statTopicPie,
            'topic-bar': statTopicBar,
            'cluster-pie': statClusterPie,
            'cluster-bar': statClusterBar,
            'sentiment-bar': statSentimentBar,
            'sentiment-timeline': statSentimentTimeline,
            'message-timeline': statMessageTimeline,
            'profile-graph': statProfileGraph,
            'index-search': indexSearch,
            'topic-messages': statTopicMessages,
            'cluster-messages': statClusterMessages,
            'sentiment-messages': statSentimentMessages,
            'personaldatasource-pie': statPersonalDataSource,
            'personaldatagps-map': statPersonalDataGPSMap,
            'personaldataappinfo-bar': statPersonalDataAppInfoBar,
            'personaldatanetstat-bar': null, //TODO complete here
            'personaldatacontact-bar': null, //TODO complete here
            'personaldataappinfo-timeline': statPersonalDataAppInfoTimeline,
            'personaldatanetstat-timeline': statPersonalDataNetStatTimeline,
            'map': statMap
        };

        $scope.$watch('vm.params', function(newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }
            vm.stat = null;
            if (!handlers.hasOwnProperty(newValue.dataViz)) {
                return;
            }
            var handled = handlers[newValue.dataViz]();
            if (!handled) {
                return;
            }
            handled.then(function() {
                // forcefully dispatch a resize event to make the word cloud recalculate its dimensions
                $timeout(function() {
                    /* global Event:false */
                    $window.dispatchEvent(new Event('resize'));
                });
            });
        }, true);

        var showCookieText = function() {
            var val = $cookies.get('cookieView');
            if(val == null){
                $cookies.put('cookieView', 1);
                var confirm = $mdDialog.confirm()
                    .title('Cookie policy')
                    .content('We are using cookies to provide statistics that help us give you the best experience of our site. You can find out more or switch them off if you prefer. However, by continuing to use the site without changing settings, you are agreeing to our use of cookies.')
                    .targetEvent(event)
                    .ok('Ok, i agree');
                return $mdDialog.show(confirm)
            }
        };

        showCookieText();

    }

})();
