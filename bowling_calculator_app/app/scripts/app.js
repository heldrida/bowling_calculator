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
	$scope.user.activeIndex = 2;

	for (var i = 0; i < 10; i++){
		$scope.frames.push(frameModel);
	};

});
