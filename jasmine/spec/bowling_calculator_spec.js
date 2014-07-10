describe("Bowling Score Calculator", function() {

    beforeEach(function() {

		var data = [{
		  0: 10,
		  1: 0
		}, {
		  0: 10,
		  1: 0
		}, {
		  0: 10,
		  1: 0
		}, {
		  0: 10,
		  1: 0
		}, {
		  0: 10,
		  1: 0
		}, {
		  0: 10,
		  1: 0
		}, {
		  0: 10,
		  1: 0
		}, {
		  0: 10,
		  1: 0
		}, {
		  0: 10,
		  1: 0
		}, {
		  0: 10,
		  1: 10,
		  2: 10
		}];

		calculator.manualScoreData = data;

		calculator.manualScoreData.forEach(function(v, index){
		  
		  calculator.throwBall(index);
		  
		});

    });

    it('All attemps were strikes', function() {
        expect(calculator.calculateScore()).toBe(300);
    });

});

describe("Bowling Score Calculator", function() {

    beforeEach(function() {

		var data = [{
		  0: 2,
		  1: 4
		}, {
		  0: 6,
		  1: 4
		}, {
		  0: 2,
		  1: 5
		}, {
		  0: 9,
		  1: 1
		}, {
		  0: 4,
		  1: 6
		}, {
		  0: 1,
		  1: 8
		}, {
		  0: 10,
		  1: 0
		}, {
		  0: 2,
		  1: 7
		}, {
		  0: 3,
		  1: 7
		}, {
		  0: 4,
		  1: 2,
		  2: 0
		}]; 

		calculator.manualScoreData = data;

		calculator.manualScoreData.forEach(function(v, index){
		  
		  calculator.throwBall(index);
		  
		});

    });

    it('Different scores each frame', function() {
        expect(calculator.calculateScore()).toBe(107);
    });

});