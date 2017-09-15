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
        };

        $scope.modal_copy = function() {
            console.log('cp ing .... ');
            var t = document.createElement('textarea');
            t.id = 't_';
            // Optional step to make less noise in the page, if any!
            t.style.height = 0;
            document.body.appendChild(t);
            // Copy whatever is in your div to our new textarea
            t.value = document.querySelector("#shorturl-content").innerText;
            // Now copy whatever inside the textarea to clipboard
            document.querySelector('#t_').select();
            document.execCommand('copy');
            document.body.removeChild(t);
        };

	});