
var app = angular.module("tinyurlApp", ["ngRoute", "ngResource", 'chart.js']);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "./public/views/home.html",
            controller: "homeController"
        })
        .when("/urls/:shortUrl", {
            templateUrl: "./public/views/url.html",
            controller: "urlController"
        });
});

angular.module("tinyurlApp")
    .controller("homeController", ["$scope", "$http", "$location", function ($scope, $http, $location) {
        $scope.submit = function () {
            $http.post("/api/v1/urls", {
                longUrl: $scope.longUrl
            }).success(function (data) {
                $location.path("/urls/" + data.shortUrl);
            });
        }
    }]);

angular.module("tinyurlApp")
    .controller("urlController", ["$scope", "$http", "$routeParams", function ($scope, $http, $routeParams) {
        $http.get("/api/v1/urls/" + $routeParams.shortUrl)
            .success(function (data) {
                $scope.longUrl = data.longUrl;
                $scope.shortUrl = data.shortUrl;
                $scope.shortUrlToShow = "http://localhost:3000/" + data.shortUrl;
            });
 		$http.get("/api/v1/urls/" + $routeParams.shortUrl + "/totalClicks")
            .success(function (data) {
                $scope.totalClicks = data;
            });

        var renderChart = function (chart, infos) {
            $scope[chart + "Labels"] = [];
            $scope[chart + "Data"] = [];
            $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/" + infos)
                .success(function (data) {
                    data.forEach(function (info) {
                        $scope[chart + "Labels"].push(info._id);
                        $scope[chart + "Data"].push(info.count);
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
                .success(function (data) {
                    data.forEach(function (item) {
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
                    });
                });
        };

        $scope.getTime($scope.time);
    }]);