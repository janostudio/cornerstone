import now from './now.js';

/**
 * Converts stored color pixel values to display pixel values using a LUT.
 *
 * Note: Skips alpha value for any input image pixel data.
 *
 * @param {Image} image A Cornerstone Image Object
 * @param {Array} lut Lookup table array
 * @param {Uint8ClampedArray} canvasImageDataData canvasImageData.data buffer filled with white pixels
 *
 * @returns {void}
 * @memberof Internal
 */
export default function (image, lut, canvasImageDataData, colorSpaceChanged) {

  let start = now();
  const pixelData = image.getPixelData();

  image.stats.lastGetPixelDataTime = now() - start;

  let minPixelValue = image.minPixelValue;
  let canvasImageDataIndex = 0;
  let storedPixelDataIndex = 0;
  const numPixels = pixelData.length;

  // NOTE: As of Nov 2014, most javascript engines have lower performance when indexing negative indexes.
  // We have a special code path for this case that improves performance.  Thanks to @jpambrun for this enhancement
  start = now();

  if (minPixelValue >= 0) {
    minPixelValue = 0;
  }

  while (storedPixelDataIndex < numPixels) {
    canvasImageDataData[canvasImageDataIndex++] = lut[pixelData[storedPixelDataIndex++] + (-minPixelValue)]; // Red
    canvasImageDataData[canvasImageDataIndex++] = lut[pixelData[storedPixelDataIndex++] + (-minPixelValue)]; // Green
    canvasImageDataData[canvasImageDataIndex++] = lut[pixelData[storedPixelDataIndex++] + (-minPixelValue)]; // Blue
    if (colorSpaceChanged) {
      canvasImageDataData[canvasImageDataIndex] = 255;
    }
    storedPixelDataIndex += 1;
    canvasImageDataIndex += 1;
  }

  image.stats.lastStoredPixelDataToCanvasImageDataTime = now() - start;
}
