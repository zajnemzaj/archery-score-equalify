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
    cctx.fillRect(x,this.size-y,1,1);
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
   * Shooting 1 arrow and getting the score of it
   * @param {number} maxRadius
   * @param {number} targetfaceRadius
   * @return {number} diameter
   */
  getTFOneScore : function(maxRadius,targetfaceRadius) {
    var x = 0,
        y = 0,
        drawx = 0,
        drawy = 0,
        distanceFromCenter = 0,
        scoreRadius = targetfaceRadius/10, // starting with 10 ring which has 20mm radius (400/20) on 40cm targetface
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
          drawx = this.size/2-maxRadius+x;
          drawy = this.size/2-maxRadius+y;
          this.drawArrow(ctx1rst,drawx,drawy);
          this.arrowCount++;
          // document.getElementById("tmpOutput").innerHTML += "x: " + x + ", y: " + y + ", drawx: " + drawx + ", drawy: " + drawy + ", score: " + scoreValue + ", distanceFromCenter: " + distanceFromCenter + "<br>";
          // console.log("drawx:",drawx,"drawy:",drawy,"scoreValue:",scoreValue,"distanceFromCenter:",distanceFromCenter);
          return scoreValue;
        } else {
          scoreRadius += targetfaceRadius/10;
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
    var scoreOfRound = 0,
        scoreToTest = +document.getElementById("inputHighScore").value;
    do {
      scoreOfRound += parseInt(this.getTFOneScore(parseInt(maxRadius),this.size/2));
      // console.log("scoreOfRound: ",scoreOfRound, "maxRadius: ", maxRadius);
    } while(this.arrowCount % 30 !== 0);
    this.roundCount++;
    // console.log("roundCount:",this.roundCount,"arrowCount:",this.arrowCount,"radius: ",maxRadius,"scoreOfRound: ",scoreOfRound);
    if (scoreToTest-5 <= scoreOfRound && scoreOfRound <= scoreToTest+5) {
      ctx1rstChart.fillStyle="#007BFF";
    } else {
      ctx1rstChart.fillStyle="#000000";
    }
    ctx1rstChart.fillRect(parseInt(maxRadius),300-parseInt(scoreOfRound),1,1);
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
        roundsNr = 200;
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

  /**
   * Shooting runCount times 200 rounds to get diameter for given score
   * @return {number} finalDiam
   */
  getRoundDiamAverages : function() {
    this.clearCanvasChart(ctx1rst,ctx1rstChart);
    var runCount = 32,
        runSum = 0,
        finalDiam = 0;
    for (var i = 0; i < runCount; i++) {
      runSum += this.getXRoundsDiam();
    }
    finalDiam = Math.round(runSum/runCount);
    // document.getElementById("tmpOutput").innerHTML += "Optimal radius for higher score: " + finalDiam + "<br>";
    document.getElementById("inputGrouping").value = finalDiam;
    return finalDiam;
    //CanvasObject.GetComponent<Canvas>().enabled = false;
  },

  /**
   * Shooting 30 arrows and getting the score of it, drawing on the chart
   * @param {number} maxRadius
   * @param {number} targetfaceRadius
   * @return {number} diameter
   */
  getTFRoundScore : function(maxRadius,targetfaceRadius) {
    var roundScore = 0;
    for (var i = 0; i < 30; i++) {
      roundScore += this.getTFOneScore(maxRadius,targetfaceRadius);
    }
    // document.getElementById("tmpOutput").innerHTML += "Round score: " + roundScore + " at targetfaceRadius" + targetfaceRadius + "<br>";
    return roundScore;
  },

  /**
   * Simulating target ratio decreasing until we get the desired lower score
   * with grouping of higher score shooter
   * @return {number} diameter
   */
  getTargetSize : function() {
    this.clearCanvasChart(ctx1rst,ctx1rstChart);
    var scoreHigh = +document.getElementById("inputHighScore").value,
        scoreLow = +document.getElementById("inputLowScore").value,
        groupingSize = +document.getElementById("inputGrouping").value,
        roundCount = 200,
        targetfaceRadius = 200,
        targetSizeSum = 0,
        targetSizeNo = 0;
    do {
      for (var i = 0; i < 10; i++) {
        actualScore = this.getTFRoundScore(groupingSize,targetfaceRadius);
        if (scoreLow-5 <= actualScore && actualScore <= scoreLow+5) {
          targetSizeSum += targetfaceRadius;
          targetSizeNo++;
          ctx1rstChart.fillStyle="#007BFF";
          // document.getElementById("tmpOutput").innerHTML += "score: " + actualScore + " with targetSize: " + targetfaceRadius + "<br>";
        } else {
          ctx1rstChart.fillStyle="#000000";
        }
        ctx1rstChart.fillRect(targetfaceRadius,300-actualScore,1,1);
      }
      targetfaceRadius--;
    } while (targetfaceRadius >= groupingSize);
    // document.getElementById("tmpOutput").innerHTML += "Best targetface radius for high score shooter to shoot around " + scoreLow + ": " + parseInt(targetSizeSum/targetSizeNo) + "<br>";
    document.getElementById("inputFinalRadius").value = parseInt(targetSizeSum/targetSizeNo);
    return parseInt(targetSizeSum/targetSizeNo);
  }
};

targetFace.drawTF(ctx1rst,targetFace.size);
