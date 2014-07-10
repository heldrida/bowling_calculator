var calculator = {
  
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
    
  }
  
};