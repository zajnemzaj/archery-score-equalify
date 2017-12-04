// Set canvas for targetface
var canvasName = document.getElementById("canvasTargetFace");
var ctx = canvasName.getContext("2d");
// Set the chart
var canvasChart = document.getElementById("canvasStats");
var ctxChart = canvasChart.getContext("2d");

function getRandomNumber(maxSzam) {
  var randomNumberBetween0and300 = Math.floor(Math.random() * maxSzam+1);
  return randomNumberBetween0and300;
}

// Our targetFace object
var targetFace = {
  // size : 400,
  size : document.getElementById("inputBigTF").value,
  smallSize : document.getElementById("inputSmallTF").value,
  // smallSize : 200,
  arrowCount : 0,
  sumOfBigTarget : 0,
  sumOfSmallTarget : 0,
  scoreOfBigTarget : 0,
  scoreOfSmallTarget : 0,
  shootingRounds : 0,
  // Drawing the targets on targetFace
  drawTF : function(cctx,bigTFSize,smallTFSize) {
    for (let i = 0; i <= 10; i++) {
        cctx.beginPath();
        if ((i*bigTFSize/20 <= this.smallSize/2) && ((i+1)*bigTFSize/20 > this.smallSize/2)){
          if (i*bigTFSize/20 === this.smallSize/2) {
            cctx.arc(bigTFSize/2, bigTFSize/2, smallTFSize/2, 0, 2 * Math.PI, false);
            cctx.strokeStyle = '#ff7f7f';
          } else {
            cctx.arc(bigTFSize/2, bigTFSize/2, smallTFSize/2, 0, 2 * Math.PI, false);
            cctx.strokeStyle = '#ff7f7f';
            cctx.stroke();
            cctx.beginPath();
            cctx.arc(bigTFSize/2, bigTFSize/2, i*bigTFSize/20, 0, 2 * Math.PI, false);
            cctx.strokeStyle = '#d8d8d8';
          }
        } else {
          cctx.arc(bigTFSize/2, bigTFSize/2, i*bigTFSize/20, 0, 2 * Math.PI, false);
          cctx.strokeStyle = '#d8d8d8';
        }
        cctx.lineWidth = 1;
        cctx.stroke();
    }
  },
  // Drawing an arrow on targetFace with paramteres
  drawArrow : function(cctx,x,y) {
    cctx.fillRect(x,this.size-y,2,2);
  },
  // Drawing one random arrow on targetFace
  draw1Arrow : function() {
    this.drawArrow(ctx,getRandomNumber(400),getRandomNumber(400));
    this.arrowCount++;
  },
  // Get both scores
  getSingleScore : function() {
    this.size = document.getElementById("inputBigTF").value;
    this.smallSize = document.getElementById("inputSmallTF").value;
    let x = getRandomNumber(this.size),
      y = getRandomNumber(this.size),
      scoreDiameter = this.size/20,
      scoreValue = 10,
      maxRadius = 0;
    //console.log(this.shootingRounds);
    if (this.shootingRounds === 0) {
      maxRadius = document.getElementById("inputMaxRadius").value/2;
    } else {
      maxRadius = this.shootingRounds;
      //console.log(this.shootingRounds);
    }
    // Getting distance from center
    // Only when both x and y equal or smaller than TARGET_SIZE/2
    let distanceFromCenter = Math.sqrt(Math.pow((this.size/2-x),2) + Math.pow((this.size/2-y),2));
    if (distanceFromCenter <= maxRadius) {
      this.drawArrow(ctx,x,y);
      while (scoreDiameter <= this.size/2) {
        if (distanceFromCenter <= scoreDiameter) {
          this.arrowCount++;
          this.sumOfBigTarget += scoreValue;
          //console.log("x=",x,"y=",y,"Dist:",distanceFromCenter.toFixed(0),"SCORE:",scoreValue,"ArrowCount:",this.arrowCount,"Sum:",this.sumOfBigTarget);
          //console.log("ArrowCount:",this.arrowCount,"Sum:",this.sumOfBigTarget);
          this.scoreOfBigTarget = scoreValue;
          // Getting score for small targetFace
          scoreValue = 10;
          scoreDiameter = this.smallSize/20;
          if (distanceFromCenter <= this.smallSize/2) {
            while (distanceFromCenter > scoreDiameter) {
              scoreDiameter += this.smallSize/20;
              scoreValue--;
            }
            this.scoreOfSmallTarget = scoreValue;
            this.sumOfSmallTarget += scoreValue;
          } else {
            this.scoreOfSmallTarget = 0;
          }
          // console.log("dia:",distanceFromCenter,"smallSCORE:",this.scoreOfSmallTarget,"sum:",this.sumOfSmallTarget);
          return this.scoreOfBigTarget;
        } else {
          scoreDiameter += this.size/20;
          scoreValue--;
        }
      }
    } else {
      //console.log("x=",x,"y=",y,"Distance:",distanceFromCenter.toFixed(2),"Missed shot, reshooting!");
      this.getSingleScore();
    }
  },

  shoot30Arrows : function() {
    do {
      this.getSingleScore();
    } while (this.arrowCount % 30 !== 0);
    let highScore = +document.getElementById("inputHighScore").value;
    //console.log(this.sumOfSmallTarget,"/",this.sumOfBigTarget);
    if (this.sumOfBigTarget == highScore) {
      ctxChart.fillStyle = 'red';
    } else {
      ctxChart.fillStyle = 'black';
    }
    ctxChart.fillRect(this.sumOfBigTarget,300-this.sumOfSmallTarget,2,2);
    // The + sign convert the value to number

    if (this.sumOfBigTarget == highScore) {
      //console.log(highScore+5);
      console.log(this.sumOfBigTarget, this.sumOfSmallTarget, this.shootingRounds);
    }
    this.sumOfBigTarget = 0;
    this.sumOfSmallTarget = 0;
  },

  clearCanvas : function() {
    this.size = document.getElementById("inputBigTF").value;
    this.smallSize = document.getElementById("inputSmallTF").value;
    document.getElementById("canvasTargetFace").width = this.size;
    document.getElementById("canvasTargetFace").height = this.size;
    ctx.clearRect(0, 0, this.size, this.size);
    this.drawTF(ctx,this.size,this.smallSize);
  },

  shootRounds : function() {
    let roundNo = document.getElementById("rounds").value;
    let radiusOrig = document.getElementById("inputMaxRadius").value/2;
    this.shootingRounds = radiusOrig;
    for (let i = 0; i < roundNo; i++) {
      this.shoot30Arrows();
      this.shootingRounds -= radiusOrig/roundNo;
    }
    this.shootingRounds = 0;
  },

  clearCanvasChart : function() {
    ctxChart.clearRect(0, 0, 300, 300);
  },

  /**
   * Shoots a random arrow to the given target size and returns its score
   * @param {number} diamTF
   * @return {number} scoreOfArrow
   */
  getOneScore : function(diamTF) {
    let scoreOfArrow = 0;

    return scoreOfArrow;
  },

  /**
   * Shoots a round of arrows to the given target size and returns the score
   * @param {number} diamTF
   * @return {number} scoreOfRound
   */
  getRoundScore : function(diamTF) {
    let scoreOfRound = 0;

    return scoreOfRound;
  },

  /**
   * Shoots a No of rounds to the target and returns the diameter of shooting
   * to get the given score
   * @param {number} roundsNr
   * @param {number} scoreToTest
   * @return {number} diameter
   */
  getXRoundsDiam : function(roundsNr,scoreToTest) {
    let diameter = 0;

    return diameter;
  },

  getGrouping : function() {

    document.getElementById("inputGrouping").value = 15;
  },

  getTFDiam : function() {
    document.getElementById("inputTFBig").value = 27;
  }
};

targetFace.drawTF(ctx,targetFace.size,targetFace.smallSize);
