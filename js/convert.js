'use strict';

// Based on the methodology from here: http://ihaochi.com/2015/03/14/exporting-svg-to-pdf-in-javascript.html
// Libraries used:
// 		saveSvgAsPng - https://github.com/exupero/saveSvgAsPng
// 		jsPDF - https://github.com/MrRio/jsPDF
$(() => {
		let $svg = $('#svg'),
    		$save = $('#save-to-pdf'),
		    $saveOpen = $('#save-to-pdf-and-open'),
        $filenameInput = $('#filename');

  	$save.on('click', () => {
    		// Convert it to PDF first
    		pdflib.convertToPdf($svg[0], doc => {
        		// Get the file name and download the pdf
        		let filename = $filenameInput.val();

            pdflib.downloadPdf(filename, doc);
        });
    });

		$saveOpen.on('click', () => {
    		// Convert it to PDF first
    		pdflib.convertToPdf($svg[0], doc => {
        		// Get the file name and download the pdf
        		let filename = $filenameInput.val();
						// Opening on new tab
						doc.output('dataurlnewwindow');
            // pdflib.downloadPdf(filename, doc);
        });
    });
});

(function(global, $) {
		function convertToPdf(svg, callback) {
        // Call svgAsDataUri from saveSvgAsPng.js
        window.svgAsDataUri(svg, {}, svgUri => {
            // Create an anonymous image in memory to set
            // the png content to
            let $image = $('<img>'),
            		image = $image[0];

            // Set the image's src to the svg png's URI
            image.src = svgUri;
            $image
                .on('load', () => {
                    // Once the image is loaded, create a canvas and
                    // invoke the jsPDF library
                    let canvas = document.createElement('canvas'),
                        ctx = canvas.getContext('2d'),
                        doc = new jsPDF('portrait', 'mm'),
                        //  imgWidth = image.width,
                        //  imgHeight = image.height;
												// Setting the quality of the image
                        imgWidth = 2000,
                        imgHeight = 2000,
												// Two way of getting input value
												$score1Input = $('#score1'),
												score1Value = $score1Input.val(),
												score2Value = document.getElementById("score2").value,
												newDiameter = 40 / Math.sqrt((300-score1Value) / (300-score2Value)) - 1,
												// If it is 2, than it is going to be a 40cm targetface. In case of 1, than it is 20cm and it fits exatly to a A4 paper.
												scalingTmp = 2,
												scalingFactor = scalingTmp * (newDiameter / 40);
												console.log(newDiameter);
												// scalingFactor = 2;
                    // Set the canvas size to the size of the image
                    canvas.width = imgWidth;
                    canvas.height = imgHeight;
										// Fill the black background
                    ctx.fillStyle="#FFF";
										ctx.fillRect(0,0,2000,2000);
										// ctx.fill();
                    // Draw the image to the canvas element
										// zooming the image and positioning on the canvas
										ctx.drawImage(image, (imgWidth*scalingFactor-imgWidth)/-2, (imgHeight*scalingFactor-imgHeight)/-2, imgWidth*scalingFactor, imgHeight*scalingFactor);
                    // ctx.drawImage(image, 0, 0, imgWidth, imgWidth);

                    // Add the image to the pdf
                    let dataUrl = canvas.toDataURL('image/jpeg');

                    // Where and which size to display picture on pdf page
                    doc.addImage(dataUrl, 'JPEG', 5, 49, 200, 200);
                    callback(doc);
                });
        });
    }

    function downloadPdf(fileName, pdfDoc) {
    		// Dynamically create a link
        let $link = $('<a>'),
        		link = $link[0],
        		dataUriString = pdfDoc.output('dataurlstring');

        // On click of the link, set the HREF and download of it
        // so that it behaves as a link to a file
        $link.on('click', () => {
          link.href = dataUriString;
          link.download = fileName;
          $link.detach(); // Remove it from the DOM once the download starts
        });

				// Add it to the body and immediately click it
        $('body').append($link);
        $link[0].click();
    }

    // Export this mini-library to the global scope
    global.pdflib = global.pdflib || {};
    global.pdflib.convertToPdf = convertToPdf;
    global.pdflib.downloadPdf = downloadPdf;
})(window, window.jQuery);
