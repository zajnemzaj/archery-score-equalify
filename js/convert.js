'use strict';

// Based on the methodology from here: http://ihaochi.com/2015/03/14/exporting-svg-to-pdf-in-javascript.html
// Libraries used:
// 		saveSvgAsPng - https://github.com/exupero/saveSvgAsPng
// 		jsPDF - https://github.com/MrRio/jsPDF
$(() => {
		let $svg = $('#svg'),
    		$save = $('#save-to-pdf'),
        $filenameInput = $('#filename');
        
  	$save.on('click', () => {
    		// Convert it to PDF first
    		pdflib.convertToPdf($svg[0], doc => {
        		// Get the file name and download the pdf
        		let filename = $filenameInput.val();
            pdflib.downloadPdf(filename, doc);
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
                        doc = new jsPDF('portrait', 'pt'),
                        //imgWidth = image.width,
                        //imgHeight = image.height;
                        imgWidth = 4096,
                        imgHeight = 4096;
                    // Set the canvas size to the size of the image
                    canvas.width = imgWidth;
                    canvas.height = imgHeight;

                    ctx.fillStyle="#FFFFFF";
                    // Draw the image to the canvas element
                    ctx.drawImage(image, 0, 0, 4096, 4096);

                    // Add the image to the pdf
                    let dataUrl = canvas.toDataURL('image/jpeg');
                    // Where and which size to display picture on pdf page
                    doc.addImage(dataUrl, 'JPEG', 10, 100, 570, 580);

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
