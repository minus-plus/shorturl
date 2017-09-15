angular.module('app')
	.controller('homeController', function($scope, $http, $location) {
        $scope.shortUrl = "";
        $scope.isOpen = false;
        $scope.redirect_link = "";
        $scope.statics_link = "";

		$scope.submit = function() {
			$http.post('api/v1/urls', {
				longUrl: $scope.longUrl
			})
            .then(
                function(response) {
                    // $location.path('/urls/' + response.data.shortUrl);
                    console.log('successfully submitted ..');
                    $scope.shortUrl = "https://sho-rt.herokuapp.com/" + response.data.shortUrl;
                    $scope.statics_link = $location.absUrl() + 'urls/' + response.data.shortUrl;
                    $scope.redirect_link = $location.absUrl().split('#')[0] +  response.data.shortUrl;
                    $scope.isOpen = true;
                }, function(error) {
                    console.log("L13 homeController: error when post to api/v1/urls");
                });
		};

		$scope.close_modal = function() {
            $scope.isOpen = false;
            $scope.shortUrl = "";
        }

	});