function formatDate(dateString) {
    var d = new Date(dateString);
    var newStr = (1 + d.getMonth())  + "/" + d.getDate() + ", " + d.getFullYear();
    return d.toLocaleDateString();
}

angular.module('app')
	.controller('urlController', function($scope, $http, $routeParams, $location) {
        $scope.isOpen = false;
        $http.get('/api/v1/urls/' + $routeParams.shortUrl).then(function(res) {
            var data = res.data;
            $scope.longUrl = data.longUrl;
            $scope.shortUrl = "sho-rt.herokuapp.com/" + data.shortUrl;
            $scope.create_at = formatDate(data.create_at);
        }, function(err) {

        });

        $http.get('/api/v1/urls/' + $routeParams.shortUrl + '/totalClicks').success(function(data) {
            $scope.totalClicks = data;
            if ($scope.totalClicks) {
                $scope.isOpen = true;
            }
            console.log($scope.totalClicks, $scope.isOpen);
        });
        var renderChart = function (chart, infos) {

            $scope[chart + "Labels"] = [];
            $scope[chart + "Data"] = [];
            $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/" + infos)
                .then(function (res) {
                    res.data.forEach(function (info) {
                        $scope[chart + "Labels"].push(info._id);
                        $scope[chart + "Data"].push(info.count);
                    }, function(err) {

                    });
                });
        };
        renderChart("doughnut", "referer");
        renderChart("pie", "country");
        renderChart("base", "platform");
        renderChart("bar", "browser");

        $scope.hour = "hour";
        $scope.day = "day";
        $scope.month = "month";
        $scope.time = $scope.hour;

        $scope.getTime = function (time) {
            $scope.lineLabels = [];
            $scope.lineData = [];

            $scope.time = time;

            $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/" + time)
                .then(function (res) {
                    res.data.forEach(function (item) {
                        var legend = "";
                        if (time === "hour") {
                            if (item._id.minutes < 10) {
                                item._id.minutes = "0" + item._id.minutes;
                            }
                            legend = item._id.hour + ":" + item._id.minutes;
                        }
                        if (time === "day") {
                            legend = item._id.hour + ":00";
                        }
                        if (time === "month") {
                            legend = item._id.month + "/" + item._id.day;
                        }
                        $scope.lineLabels.push(legend);
                        $scope.lineData.push(item.count);
                        $scope.lineOptions = {
                            scales: {
                                yAxes: [
                                    {
                                        id: 'y-axis-1',
                                        type: 'linear',
                                        display: true,
                                        position: 'left'
                                    }
                                ]
                            }
                        };

                        $scope.barOptions = {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            }
                        };

                        $scope.horibarOptions = {
                            scales: {
                                xAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            }
                        }







                    });

                }, function(err) {

                });
        };

        $scope.getTime($scope.time);

    });

