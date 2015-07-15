var app = angular.module('nextPlay', [])

.config(['$compileProvider', function($compileProvider) {   
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|steam):/);
}])

.controller('IndexCtrl', function($scope, $http) {
	$scope.isLoading = false;
	$scope.isUser = false;
	$scope.game = {};
	$scope.generateGame = function() {
		$scope.isLoading = true;
		$http.get('/game/' + $scope.user)
		.success(function(data, status, headers, config){
			$scope.game = data;
			$scope.isLoading = false;
			$scope.isUser = true;
		})
		.error(function(data, status, headers, config){
			$scope.isLoading = false;
			$scope.isUser = false;
			$scope.game = null;
			
			if (status == 401) {
				$scope.error = "Invalid user."
			}
			else if (status == 400) {
				$scope.error = "You have no games."
			}
		});
	}
});