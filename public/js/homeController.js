angular.module('tinyurlApp')
	.controller('homeController', function($scope, $http, $location) {
		$scope.submit = function() {
			$http.post('api/v1/urls', {
				longUrl: $scope.longUrl,
			}).success(function(data) {
				$location.path('/urls/' + data.shortUrl);
				console.log('success');
			});
		};
	});