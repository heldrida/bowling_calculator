'use strict';

angular.module('bowlingCalculatorAppApp', [])

.controller('MainCtrl', function ($scope, BowlingScoreCalculator) {

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

	BowlingScoreCalculator.init();

	$scope.nextFrame = function(){
		
		if ($scope.user.activeIndex < $scope.frames.length - 1){
	
			$scope.user.activeIndex += 1;

		} else if ($scope.user.activeIndex === $scope.frames.length - 1) {

			$scope.user.activeIndex = 0;

		}

	};

})

.controller('frameCtrl', function ($scope, BowlingScoreCalculator) {

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
			
			BowlingScoreCalculator.manualScoreData[$scope.user.activeIndex][0] = parseInt(score);
			BowlingScoreCalculator.setScore($scope.user.activeIndex);			

			lock = true;

			$scope.pins(10 - score);

			if ((10 - score) === 0){

				BowlingScoreCalculator.setScore($scope.user.activeIndex);
				BowlingScoreCalculator.calculateScore();
				$scope.frames[$scope.user.activeIndex].score = BowlingScoreCalculator.frames[$scope.user.activeIndex].score;
				lock = false;
				$scope.user.activeIndex += 1;
				$scope.pins(10);
			}

		} else {

			$scope.frames[$scope.user.activeIndex].secondAtt = score;

			BowlingScoreCalculator.manualScoreData[$scope.user.activeIndex][1] = parseInt(score);
			BowlingScoreCalculator.setScore($scope.user.activeIndex);
			BowlingScoreCalculator.calculateScore();
			$scope.frames[$scope.user.activeIndex].score = BowlingScoreCalculator.frames[$scope.user.activeIndex].score;

			lock = false;
			$scope.user.activeIndex += 1;
			$scope.pins(10);

		}

	};

})

.factory('BowlingScoreCalculator', function(){

	return {
	  
	  pinTotal: 10,
	  frames: [],
	  attempts: 10,
	  manualScoreData: [],
	  finalScore: 0,
	  
	  calculateScore: function(){
	    
	    var self = this;
	    var firstShot = 0;
	    var secondShot = 0;
	    var nextShot = 0;
	    var score = 0;
	    
	    self.frames.forEach(function(f, k){

	      if (k === self.frames.length - 1){

	          if (self.frames[k].isSpare){
	            
	            if (Array.isArray(self.manualScoreData) && self.manualScoreData.length > 0){
	                
	              score += self.manualScoreData[k][2];
	        
	            } else {

	              score += 10 + self.getPinsKnockDown(10);
	      
	            }            
	            
	            
	          } else if (self.frames[k].isStrike) {
	            
	            score += 10; // automatically gets 10, plus 2 extra shots
	            
	            if (Array.isArray(self.manualScoreData) && self.manualScoreData.length > 0){

	                score += self.manualScoreData[k][1];
	                score += self.manualScoreData[k][2];
	              
	            } else {

	              [0, 1].forEach(function(){
	              
	                score += self.getPinsKnockDown(10);
	              
	              });
	      
	            }
	            
	          } else {
	            
	            score += self.frames[k][0] + self.frames[k][1];
	            
	          }
	  
	        
	      } else {

	        if (f.isSpare){
	          
	          firstShot = self.frames[k][0];
	          secondShot = self.frames[k][1];
	          nextShot = k < self.frames.length - 1 && self.frames[k + 1] !== undefined ? self.frames[k + 1][0] : 0;
	          score += (firstShot + secondShot) + nextShot;
	          
	        } else if (f.isStrike){
	          
	          score += 10; // automatically wins 10 points
	          
	          // sum next two first frame shots, if next is strike
	          if (self.frames[k + 1] !== undefined && self.frames[k + 1].isStrike){
	              
	              // exception for 9th, that get scores differently
	              if (k === 8){
	                
	                  score += self.frames[k + 1][0] + ( self.frames[k + 1] !== undefined ? self.frames[k + 1][0] : 0);
	                
	              } else {
	           
	                  score += self.frames[k + 1][0] + ( self.frames[k + 2] !== undefined ? self.frames[k + 2][0] : 0);
	              
	              }
	            
	          } 
	          // sum next two shots from same frame
	          else if (self.frames[k + 1] !== undefined) {
	            
	             score += self.frames[k + 1][0] + self.frames[k + 1][1];
	            
	          }
	          
	        } else {
	          
	            score += self.frames[k][0] + self.frames[k][1];
	          
	        }
	        
	      }
	      
	      self.frames[k].score = score;
	      
	    });

	    self.finalScore = self.frames[9].score;
	    
	    console.log(self.frames);

	    return self.finalScore;
	    
	  },
	  
	  getPinsKnockDown: function(totalLeft){
	    
	     var x = totalLeft || self.pinTotal;
	     return Math.floor(Math.random() * x) + 1;
	    
	  },
	  
	  setScore: function(x){

	    var self = this;
	    var pins = self.pinTotal;
	    var score = 0;

	    console.log(x);
	    console.log(self.manualScoreData[x]);

	    // create frame
	    self.frames[x] = {
	      0: 0,
	      1: 0,
	      score: 0,
	      isStrike: false,
	      isSpare: false
	    };
	    
	    for (var i = 0; i < 2; i++){
	      
	      if (Array.isArray(self.manualScoreData) && self.manualScoreData.length > 0){
	          score = self.manualScoreData[x][i];
	        
	      } else {

	          score = self.getPinsKnockDown(pins);
	      
	      }
	      
	      // on 1st attempt
	      if (i < 1){
	      
	        // check if strike, set strike
	        if (Math.abs(pins - score) === 0) {

	            self.frames[x][i] = 10;
	            self.frames[x][i + 1] = 0;
	            self.frames[x].isStrike = true;
	          
	            // except that, 
	            if (x === 9){
	            
	              // create 2 indexes, each new strike shot 10 pins, otherwise remain pins
	              self.frames[x][i + 1] = Array.isArray(self.manualScoreData) && self.manualScoreData.length > 0 ? self.manualScoreData[9][0] : self.getPinsKnockDown(10);
	              
	              if (self.frames[x][i + 1] < 10){
	  
	                self.frames[x][i + 2] = Array.isArray(self.manualScoreData) && self.manualScoreData.length > 0 ? self.manualScoreData[9][1] : self.getPinsKnockDown(10 - self.frames[x][i + 1]);
	                
	              } else {
	                
	                self.frames[x][i + 2] = Array.isArray(self.manualScoreData) && self.manualScoreData.length > 0 ? self.manualScoreData[9][2] : self.getPinsKnockDown(10);
	                
	              }
	              
	            }
	            
	          break; // go to next frame          
	        
	        } 
	        // if less then 10, append score
	        else if (Math.abs(pins - score) < 10){
	          
	            self.frames[x][i] = score;
	          
	        }
	        
	      } 
	      // on 2nd attempt
	      else if (i > 0) {
	        
	        // if sum of prev plus current eq 10, set spare
	        if (self.frames[x][0] + score === 10){
	        
	          self.frames[x][i] = score;
	          self.frames[x].isSpare = true;
	        
	        } else if (self.frames[x][0] + score < 10) {
	          
	          self.frames[x][i] = score;
	          
	        }
	        
	      }
	      
	      pins = pins - score; // remove knocked down pins from playground 
	       
	    }
	    
	  },
	  
	  throwBall: function(x){
	    
	    var self = this;
	    
	    self.setScore(x);
	    
	  },

	  init: function(){

	  	var self = this;

		for (var i = 0; i < 10; i++){
		  
			self.manualScoreData.push({
				0: 0,
				1: 0,
				2: 0
			});

		}

		self.manualScoreData.forEach(function(v, index){
		  
		  self.throwBall(index);
		  
		});

	  }
	  
	};

});
