var calculator = {
  
  pinTotal: 10,
  frames: [],
  attempts: 10,
  
  calculateScore: function(){
    
    var self = this;
    var firstShot = 0;
    var secondShot = 0;
    var nextShot = 0;
    var score = 0;
    
    self.frames.forEach(function(f, k){

      if (k === self.frames.length){
        
          if (self.frames[k].isSpare){
            
            score += 10 + self.getPinsKnockDown(10);
            
          } else if (self.frames[k].isStrike) {
            
            score += 10; // automatically gets 10, plus 2 extra shots
            
            [0, 1].forEach(function(){
              
              score += self.getPinsKnockDown(10);
              
            });
            
          } else {
            
            score += self.frames[k][0] + self.frames[k][1];
            
          }
        
      } else {

        if (f.isSpare){
          
          firstShot = self.frames[k][0];
          secondShot = self.frames[k][1];
          nextShot = k < self.frames.length - 1 ? self.frames[k + 1][0] : 0;
          score += (firstShot + secondShot) + nextShot;
          
        } else if (f.isStrike){
          
          score += (k > 0 ? self.frames[k - 1] : 0) + 10; // automatically wins 10 points
          
          if (self.frames[k + 1] !== undefined && self.frames[k + 1].isStrike){
            
            score += self.frames[k + 1] + ( self.frames[k + 2] !== undefined ? self.frames[k + 2] : 0);
            
          } else if (self.frames[k + 1] !== undefined) {
            
             score += self.frames[k + 1][0] + self.frames[k + 1][1];
            
          }
          
        } else {
          
            score += self.frames[k][0] + self.frames[k][1];
          
        }
        
      }
      
      self.frames[k].score = score;
      
    });
    
    console.log(self.frames);
    
  },
  
  getPinsKnockDown: function(totalLeft){
    
     var x = totalLeft || self.pinTotal;
     return Math.floor(Math.random() * x) + 1;
    
  },
  
  setScore: function(x){
    
    var self = this;
    var pins = self.pinTotal;
    var score = 0;
    
    // create frame
    self.frames[x] = {
      0: 0,
      1: 0,
      score: 0,
      isStrike: false,
      isSpare: false
    };
    
    for (var i = 0; i < 2; i++){
      
      score = self.getPinsKnockDown(pins); 
      
      // on 1st attempt
      if (i < 1){
      
        // check if strike, set strike
        if (Math.abs(pins - score) === 0) {

            self.frames[x][i] = 10;
            self.frames[x][i + 1] = 0;
            self.frames[x].isStrike = true;
            
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
    
  }
  
};

[0, 1, 2, 3, 5, 6, 7, 8, 9].forEach(function(index){
  
  calculator.throwBall(index);
  
});

calculator.calculateScore();

