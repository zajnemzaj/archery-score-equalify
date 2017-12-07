// Set canvas for 1rst targetface
var canvas1rstName = window.document.getElementById("canvas1rstTargetFace");
var ctx1rst = canvas1rstName.getContext("2d");
// Set the chart
var canvas1rstChart = window.document.getElementById("canvas1rstStats");
var ctx1rstChart = canvas1rstChart.getContext("2d");

/**
 * Generating random number
 * @param {number} maxNo
 * @return {number} randomNumber
 */
function getRandomNumber(maxNo) {
  var randomNumber = Math.floor(Math.random() * maxNo+1);
  return randomNumber;
}

// Our targetFace object
var targetFace = {
  size : 400, // size of targetface in mm
  arrowCount : 0, // No of arrows shot
  sumOfBigTarget : 0,
  roundCount : 0,

  /**
   * Drawing the score circles on targetFace
   * @param {context} cctx
   * @param {number} targetSize
   */
  drawTF : function(cctx,targetSize) {
    for (var i = 0; i <= 10; i++) {
        cctx.beginPath();
        cctx.arc(targetSize/2, targetSize/2, i*targetSize/20, 0, 2 * Math.PI, false);
        cctx.strokeStyle = '#d8d8d8';
        cctx.lineWidth = 1;
        cctx.stroke();
    }
  },

  /**
   * Drawing an arrow on targetFace with paramteres
   * @param {context} cctx
   * @param {number} x
   * @param {number} y
   */
  drawArrow : function(cctx,x,y) {
    cctx.fillRect(x,this.size-y,2,2);
  },

  /**
   * Clearing canvas and chart, redraw targetface canvas
   * @param {context} ctx
   * @param {context} ctxChart
   */
  clearCanvasChart : function(ctx,ctxChart) {
    ctx.clearRect(0, 0, this.size, this.size);
    ctxChart.clearRect(0, 0, this.size, 300);
    this.drawTF(ctx,this.size);
    document.getElementById("tmpOutput").innerHTML = "";
  },

  /**
   * Shoots a random arrow in the given gruping size and returns its score
   * @param {number} maxRadius
   * @return {number} scoreValue
   */
  getOneScore : function(maxRadius) {
    var x = 0,
        y = 0,
        distanceFromCenter = 0,
        scoreRadius = this.size/20, // starting with 10 ring which has 20mm radius (400/20) on 40cm targetface
        scoreValue = 10; // starting score value
    do {
      if (scoreRadius > maxRadius) {
        scoreRadius = maxRadius;
      }
      x = getRandomNumber(maxRadius*2);
      y = getRandomNumber(maxRadius*2);
      // Getting distance from center
      distanceFromCenter = Math.sqrt(Math.pow((maxRadius-x),2) + Math.pow((maxRadius-y),2));
      while (parseFloat(distanceFromCenter) <= parseFloat(maxRadius)) {
          // console.log("scoreRadius:" ,scoreRadius, "scoreValue:",scoreValue);
        if (parseFloat(distanceFromCenter) <= parseFloat(scoreRadius)) {
          this.drawArrow(ctx1rst,this.size/2-maxRadius+x,this.size/2-maxRadius+y);
          this.arrowCount++;
          // console.log("scoreValue:",scoreValue,"distanceFromCenter:",distanceFromCenter);
          return scoreValue;
        } else {
          scoreRadius += this.size/20;
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
    var scoreOfRound = 0;
    do {
      scoreOfRound += parseInt(this.getOneScore(parseInt(maxRadius)));
      // console.log("scoreOfRound: ",scoreOfRound, "maxRadius: ", maxRadius);
    } while(this.arrowCount % 30 !== 0);
    this.roundCount++;
    // console.log("roundCount:",this.roundCount,"arrowCount:",this.arrowCount,"radius: ",maxRadius,"scoreOfRound: ",scoreOfRound);
    ctx1rstChart.fillRect(parseInt(maxRadius),300-parseInt(scoreOfRound),2,2);
    return scoreOfRound;
  },

  /**
   * Shoots a No of rounds to the target and returns the diameter of shooting
   * to get the given score
   * @return {number} diameter
   */
  getXRoundsDiam : function() {
    var radius = this.size/2,
        scoreToTest = +document.getElementById("inputHighScore").value,
        i = 0,
        radiusSum = 0,
        radiusNo = 0,
        actualScore = 0,
        helper = 0,
        roundsNr = +document.getElementById("inputRounds").value;
    for (i = roundsNr; i > 0; i--) {
      actualScore = this.getRoundScore(parseInt(radius));
      if (scoreToTest-5 <= actualScore && actualScore <= scoreToTest+5) {
        radiusSum += radius;
        radiusNo++;
        // document.getElementById("tmpOutput").innerHTML += "score: " + actualScore + " with radius: " + radius + "<br>";
      }
      radius -= this.size/2/roundsNr;
    }
    if (radiusSum !== 0 && radiusNo !== 0)
      // document.getElementById("tmpOutput").innerHTML += "Average radius for higher score: " + Math.round(radiusSum/radiusNo) + "<br>";
    return parseInt(radiusSum/radiusNo);
  },

  getRoundDiamAverages : function() {
    var runCount = 20,
        runSum = 0;
    for (var i = 0; i < runCount; i++) {
      runSum += this.getXRoundsDiam();
    }
    document.getElementById("tmpOutput").innerHTML += "Optimal radius for higher score: " + Math.round(runSum/runCount) + "<br>";
  }
};

targetFace.drawTF(ctx1rst,targetFace.size);
