'use strict';

angular.module('bowlingCalculatorAppApp', [])

.controller('MainCtrl', function ($scope) {

	var frameModel = [{
		firstAtt: 0,
		secondAtt: 0,
		score: 0
	}];

	$scope.frames = [];
	$scope.total = 0;
	$scope.user = {};
	$scope.user.activeIndex = 0;

	for (var i = 0; i < 10; i++){
		$scope.frames.push(frameModel.slice(0));
	};

	console.log($scope.frames);

	$scope.nextFrame = function(){
		
		if ($scope.user.activeIndex < $scope.frames.length - 1){
	
			$scope.user.activeIndex += 1;

		} else if ($scope.user.activeIndex === $scope.frames.length - 1) {

			$scope.user.activeIndex = 0;

		}

	};

})

.controller('frameCtrl', function ($scope) {


	$scope.totalPins = [];

	$scope.pins = function(total){

		$scope.totalPins = []; // reset
		var total = total;

		for (var i = 1; i <= total; i++){

			$scope.totalPins.push(i);

		};

	};
	
	$scope.pins(10);


	var lock = false;
	$scope.setScore = function(obj, $event){

		var el = $event.target;
		var score = angular.element(el).attr('score');

		if (!lock){
		
			$scope.frames[$scope.user.activeIndex].firstAtt = score;
			lock = true;
			$scope.pins(10 - score);

			if ((10 - score) === 0){

				lock = false;
				$scope.user.activeIndex += 1;
				$scope.pins(10);
				
			}

		} else {

			$scope.frames[$scope.user.activeIndex].secondAtt = score;
			lock = false;
			$scope.user.activeIndex += 1;
			$scope.pins(10);
			
		}

	};

});
