var app = angular.module('tinyurlApp',['ngRoute', 'ngResource', 'chart.js']);
app.config(function($routeProvider) {
	//dependencies injection, call for routeProvider object
	$routeProvider
		.when('/', {
			// set template and controller
			templateUrl: '/public/views/home.html',
			controller: 'homeController'
		})
		.when('/urls/:shortUrl', {
			templateUrl: '/public/views/url.html',
			controller: 'urlController'
		})
		.otherwise({
    		redirectTo:'/'
		})
});
