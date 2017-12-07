'use strict';
// Set canvas for 1rst targetface
var canvas1rstName = document.getElementById("canvas1rstTargetFace");
var ctx1rst = canvas1rstName.getContext("2d");
// Set the chart
var canvas1rstChart = document.getElementById("canvas1rstStats");
var ctx1rstChart = canvas1rstChart.getContext("2d");
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
  size : document.getElementById("inputBigTF").value,
  smallSize : document.getElementById("inputSmallTF").value,
  arrowCount : 0,
  sumOfBigTarget : 0,
  sumOfSmallTarget : 0,
  scoreOfBigTarget : 0,
  scoreOfSmallTarget : 0,
  shootingRounds : 0,
  roundCount : 0,
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
    // document.getElementById("tmpOutput").innerHTML = "bla";

    if (this.sumOfBigTarget == highScore) {
      //console.log(highScore+5);
      console.log(this.sumOfBigTarget, this.sumOfSmallTarget, this.shootingRounds);
      document.getElementById("tmpOutput").innerHTML = "this.sumOfBigTarget";
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

  clearCanvasChart : function(ctxChart) {
    ctxChart.clearRect(0, 0, 300, 300);
  },

  /**
   * Shoots a random arrow to the given target size and returns its score
   * @param {number} diamTF
   * @return {number} scoreOfArrow
   */
  getOneScore : function(maxRadius) {
    this.size = document.getElementById("inputBigTF").value;
    // this.size = diamTF;
    let x = 0,
        y = 0,
        distanceFromCenter = 0,
        scoreDiameter = this.size/20,
        scoreValue = 10;
    /*if (this.shootingRounds === 0) {
          // maxRadius = document.getElementById("inputMaxRadius").value/2;
        } else {
          maxRadius = this.shootingRounds;
          //console.log(this.shootingRounds);
        }*/
    // Getting distance from center
    // Only when both x and y equal or smaller than TARGET_SIZE/2
       do {
      x = getRandomNumber(maxRadius*2);
      y = getRandomNumber(maxRadius*2);
      distanceFromCenter = Math.sqrt(Math.pow((maxRadius-x),2) + Math.pow((maxRadius-y),2));
      // console.log("x=",x,"y=",y,"Dist:",distanceFromCenter.toFixed(0),"scored:",scoreDiameter);
      while (scoreDiameter <= maxRadius && distanceFromCenter <= maxRadius) {
        if (distanceFromCenter <= scoreDiameter) {
          this.drawArrow(ctx1rst,this.size/2-maxRadius+x,this.size/2-maxRadius+y);
          this.arrowCount++;
          this.sumOfBigTarget += scoreValue;
          //console.log("x=",x,"y=",y,"Dist:",distanceFromCenter.toFixed(0),"SCORE:",scoreValue,"ArrowCount:",this.arrowCount,"Sum:",this.sumOfBigTarget);
          //console.log("ArrowCount:",this.arrowCount,"Sum:",this.sumOfBigTarget);
          this.scoreOfBigTarget = scoreValue;
          //document.getElementById("tmpOutput").innerHTML += "akt scr: " + this.scoreOfBigTarget + "<br>";
          //document.getElementById("inputGrouping").value = this.scoreOfBigTarget;
          // return this.scoreOfBigTarget;
          return Number(scoreValue);
        } else {
          scoreDiameter += this.size/20;
          scoreValue--;
        }
      }
    } while (distanceFromCenter > maxRadius);
  },

  /**
   * Shoots a round of arrows to the given target size and returns the score
   * @param {number} maxRadius
   * @return {number} scoreOfRound
   */
  getRoundScore : function(maxRadius) {
    let scoreOfRound = 0;
    do {
      scoreOfRound += this.getOneScore(maxRadius);
      // scoreOfRound += 2;
    } while(this.arrowCount % 30 !== 0);
    this.roundCount++;
    console.log("roundCount:",this.roundCount,"arrowCount:",this.arrowCount,"radius: ",maxRadius.toFixed(0),'scoreOfRound: ',scoreOfRound);
    ctx1rstChart.fillRect(maxRadius,300-scoreOfRound,2,2);
    // document.getElementById("tmpOutput").innerHTML = "Score of actual round: " + scoreOfRound + "<br>";
    return scoreOfRound;
  },

  /**
   * Shoots a No of rounds to the target and returns the diameter of shooting
   * to get the given score
   * @param {number} roundsNr
   * @param {number} scoreToTest
   * @return {number} diameter
   */
  getXRoundsDiam : function(scoreToTest) { //10,140
    const radOrig = 200;
    let radius = 200,
        i = 0,
        radiusSum = 0,
        radiusNo = 0,
        actualScore = 0,
        roundsNr = document.getElementById("inputRounds").value;
    // alert("blah");
    for (i=roundsNr ; i>0; i--) {
      actualScore = this.getRoundScore(parseInt(radius));
      // console.log(actualScore);
      if (scoreToTest-10 <= actualScore && actualScore <= scoreToTest+10) {
        // console.log("SIKER, radius: " + radius);
        radiusSum += radius;
        radiusNo++;
        document.getElementById("tmpOutput").innerHTML += "pont: " + actualScore + ", radius: " + radius + "<br>";
      }
      radius -= Number(radOrig/roundsNr);
    }
    document.getElementById("tmpOutput").innerHTML += "SIKER, sugárátlag: " + parseInt(radiusSum/radiusNo) + "<br>";
    return radius*2;
  },

  getGrouping : function() {

    document.getElementById("inputGrouping").value = 15;
  },

  getTFDiam : function() {
    document.getElementById("inputTFBig").value = 27;
  }
};

targetFace.drawTF(ctx1rst,targetFace.size);
targetFace.drawTF(ctx,targetFace.size,targetFace.smallSize);
