'use strict';

angular.module('bowlingCalculatorAppApp', [])

.controller('MainCtrl', function ($scope) {

	var frameModel = {
		firstAtt: 0,
		secondAtt: 0,
		score: 0
	};

	$scope.frames = [];
	$scope.total = 0;
	$scope.user = {};
	$scope.user.activeIndex = 0;

	for (var i = 0; i < 10; i++){
		$scope.frames.push(frameModel);
	};

	$scope.nextFrame = function(){
		
		if ($scope.user.activeIndex < $scope.frames.length - 1){
	
			$scope.user.activeIndex += 1;

		} else if ($scope.user.activeIndex === $scope.frames.length - 1) {

			$scope.user.activeIndex = 0;

		}

	};

})

.controller('frameCtrl', function ($scope) {


	$scope.shotNumbers = [];

	for (var i = 1; i < 11; i++){
		
		$scope.shotNumbers.push(i);

	};

});
