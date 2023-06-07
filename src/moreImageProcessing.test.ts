import { Color, COLORS, Image } from "../include/image.js";
import {
  blurLines,
  combineThree,
  composeFunctions,
  imageBlur,
  lineBlur3p,
  lineBlur5p,
  pixelBlur,
} from "./moreImageProcessing.js";
// Creates a single row image containing the specified colors
function createRow(row: Color[]): Image {
  const img = Image.create(row.length, 1, COLORS.BLACK);

  for (let i = 0; i < row.length; i++) {
    img.setPixel(i, 0, row[i]);
  }

  return img;
}

// Checks to see if a color is equal to another one with an error of 1 (default)
function expectColorToBeCloseTo(actual: Color, expected: Color, error = 1) {
  [0, 1, 2].forEach(i => expect(Math.abs(actual[i] - expected[i])).toBeLessThanOrEqual(error));
}

// describe("lineBlur3p", () => {
//   it("correctly calculates independent channels", () => {
//     const img = createRow([
//       [0, 0, 0],
//       [100, 0, 10],
//       [200, 0, 0],
//     ]);
//     lineBlur3p(img, 0);
//     // red: floor((0 + 100 + 200) / 3) = 100
//     // blue: floor((0 + 0 + 0) / 3) = 0
//     // green: floor((0 + 10 + 0) / 3) = 3
//     expectColorToBeCloseTo(img.getPixel(1, 0), [100, 0, 3]);
//   });
//   it("blurs edge pixels with one neighbor", () => {
//     const img = createRow([
//       [10, 20, 30],
//       [40, 50, 60],
//       [70, 80, 90],
//     ]);
//     lineBlur3p(img, 0);
//     expectColorToBeCloseTo(img.getPixel(0, 0), [25, 35, 45]);
//     expectColorToBeCloseTo(img.getPixel(2, 0), [55, 65, 75]);
//   });

//   it("blurs all pixels in a line", () => {
//     const img = createRow([
//       [10, 20, 30],
//       [40, 50, 60],
//       [70, 80, 90],
//     ]);
//     lineBlur3p(img, 1);
//     expectColorToBeCloseTo(img.getPixel(0, 0), [25, 35, 45]);
//     expectColorToBeCloseTo(img.getPixel(1, 0), [40, 50, 60]);
//     expectColorToBeCloseTo(img.getPixel(2, 0), [55, 65, 75]);
//   });
// });

// describe("lineBlur5p", () => {
//   it("correctly calculates independent channels for interior pixel", () => {
//     const img = createRow([
//       [0, 0, 0],
//       [100, 0, 10],
//       [200, 0, 0],
//       [50, 100, 200],
//       [100, 200, 50],
//     ]);
//     lineBlur5p(img, 2);
//     expectColorToBeCloseTo(img.getPixel(2, 0), [90, 50, 42]);
//   });

//   it("correctly calculates independent channels for edge pixel", () => {
//     const img = createRow([
//       [100, 0, 10],
//       [200, 0, 0],
//       [50, 100, 200],
//       [100, 200, 50],
//     ]);
//     lineBlur5p(img, 0);
//     expectColorToBeCloseTo(img.getPixel(0, 0), [150, 0, 5]);
//   });

//   it("correctly calculates independent channels for corner pixel", () => {
//     const img = createRow([
//       [100, 0, 10],
//       [200, 0, 0],
//       [100, 200, 50],
//     ]);
//     lineBlur5p(img, 0);
//     expectColorToBeCloseTo(img.getPixel(0, 0), [150, 0, 5]);
//   });

//   it("does not modify pixels outside of the image boundaries", () => {
//     const img = createRow([
//       [100, 0, 10],
//       [200, 0, 0],
//       [50, 100, 200],
//       [100, 200, 50],
//     ]);
//     lineBlur5p(img, -1); // Blur outside the image boundaries
//     expectColorToBeCloseTo(img.getPixel(0, 0), [100, 0, 10]);
//     expectColorToBeCloseTo(img.getPixel(3, 0), [100, 200, 50]);
//   });
// });

// describe("blurLines", () => {
//   it("correctly blurs each line using lineBlur3p", () => {
//     const img = Image.create(3, 3, COLORS.BLACK);
//     img.setPixel(0, 0, [100, 0, 10]);
//     img.setPixel(1, 0, [200, 0, 0]);
//     img.setPixel(2, 0, [50, 100, 200]);
//     img.setPixel(0, 1, [100, 200, 50]);
//     img.setPixel(1, 1, [10, 100, 200]);
//     img.setPixel(2, 1, [200, 50, 100]);
//     img.setPixel(0, 2, [200, 200, 50]);
//     img.setPixel(1, 2, [100, 50, 200]);
//     img.setPixel(2, 2, [50, 200, 100]);

//     const expected = Image.create(3, 3, COLORS.BLACK);
//     expected.setPixel(0, 0, [100, 0, 3]);
//     expected.setPixel(1, 0, [100, 0, 3]);
//     expected.setPixel(2, 0, [55, 65, 75]);
//     expected.setPixel(0, 1, [90, 100, 83]);
//     expected.setPixel(1, 1, [40, 70, 130]);
//     expected.setPixel(2, 1, [80, 70, 117]);
//     expected.setPixel(0, 2, [100, 100, 83]);
//     expected.setPixel(1, 2, [80, 70, 117]);
//     expected.setPixel(2, 2, [50, 200, 100]);

//     const result = blurLines(img, lineBlur3p);

//     for (let x = 0; x < result.width; x++) {
//       for (let y = 0; y < result.height; y++) {
//         expectColorToBeCloseTo(result.getPixel(x, y), expected.getPixel(x, y));
//       }
//     }
//   });

//   it("correctly blurs each line using lineBlur5p", () => {
//     const img = Image.create(3, 3, COLORS.BLACK);
//     img.setPixel(0, 0, [100, 0, 10]);
//     img.setPixel(1, 0, [200, 0, 0]);
//     img.setPixel(2, 0, [50, 100, 200]);
//     img.setPixel(0, 1, [10, 20, 30]);
//     img.setPixel(1, 1, [40, 50, 60]);
//     img.setPixel(2, 1, [70, 80, 90]);
//     img.setPixel(0, 2, [255, 255, 255]);
//     img.setPixel(1, 2, [128, 128, 128]);
//     img.setPixel(2, 2, [0, 0, 0]);

//     const blurredImg = blurLines(img, lineBlur5p);

//     // First row
//     expectColorToBeCloseTo(blurredImg.getPixel(0, 0), [150, 0, 5]);
//     expectColorToBeCloseTo(blurredImg.getPixel(1, 0), [112, 60, 21]);
//     expectColorToBeCloseTo(blurredImg.getPixel(2, 0), [75, 80, 112]);

//     // Second row
//     expectColorToBeCloseTo(blurredImg.getPixel(0, 1), [25, 35, 45]);
//     expectColorToBeCloseTo(blurredImg.getPixel(1, 1), [40, 50, 60]);
//     expectColorToBeCloseTo(blurredImg.getPixel(2, 1), [55, 65, 75]);

//     // Third row
//     expectColorToBeCloseTo(blurredImg.getPixel(0, 2), [255, 255, 255]);
//     expectColorToBeCloseTo(blurredImg.getPixel(1, 2), [128, 128, 128]);
//     expectColorToBeCloseTo(blurredImg.getPixel(2, 2), [0, 0, 0]);
//   });
// });

// describe("pixelBlur", () => {
//   it("should return the pixel value when no blur is applied", () => {
//     const img = new Image(3, 3, new Uint8ClampedArray([
//       255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255,
//       0, 0, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255,
//       0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255,
//     ]));

//     const result = pixelBlur(img, 0, 0);

//     expect(result).toEqual([255, 255, 255, 255]);
//   });

//   it("should return the blurred value of a valid pixel", () => {
//     const img = new Image(3, 3, new Uint8ClampedArray([
//       255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255,
//       0, 0, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255,
//       0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255,
//     ]));

//     const result = pixelBlur(img, 1, 1);

//     expect(result).toEqual([85, 85, 85, 255]);
//   });

//   it("should return the pixel value when it is on an edge", () => {
//     const img = new Image(3, 3, new Uint8ClampedArray([
//       255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255,
//       0, 0, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255,
//       0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255,
//     ]));

//     const result = pixelBlur(img, 0, 1);

//     expect(result).toEqual([0, 128, 0, 255]);
//   });

//   it("should return the pixel value when it has no neighbors", () => {
//     const img = new Image(1, 1, new Uint8ClampedArray([255, 0, 0, 255]));
//     const expected = [255, 0, 0, 255]; // the only pixel is its own neighbor

//     const result = pixelBlur(img, 0, 0);

//     expect(result).toEqual(expected);
//   });

//   it("should return the truncated mean of the pixel and its neighbors", () => {
//     const img = new Image(3, 3, new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255]));
//     const expected = [85, 85, 85, 255]; // truncated mean of the pixel and its neighbors

//     const result = pixelBlur(img, 1, 1);

//     expect(result).toEqual(expected);
//   });
// });

// describe("imageBlur", () => {
//   it("blurs a 2x2 image", () => {
//     const img = new Image(2, 2, new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 255, 255, 0, 255, 255, 0, 0, 255, 255]));
//     const expected = new Image(2, 2, new Uint8ClampedArray([170, 85, 85, 255, 85, 170, 85, 255, 170, 85, 255, 255, 85, 85, 255, 255]));

//     const result = imageBlur(img);

//     expect(result.width).toEqual(expected.width);
//     expect(result.height).toEqual(expected.height);
//     for (let i = 0; i < result.width; ++i) {
//       for (let j = 0; j < result.height; ++j) {
//         expect(result.getPixel(i, j)).toEqual(expected.getPixel(i, j));
//       }
//     }
//   });

//   it("blurs a 3x3 image", () => {
//     const img = new Image(3, 3, new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 255, 255, 0, 255, 255, 0, 0, 255, 255, 255, 0, 255, 255, 0, 0, 255, 255, 255, 0, 0, 255, 255]));
//     const expected = new Image(3, 3, new Uint8ClampedArray([170, 85, 85, 255, 85, 170, 85, 255, 170, 85, 255, 255, 85, 85, 255, 255, 85, 85, 255, 255, 170, 170, 170, 255, 170, 170, 255, 255]));

//     const result = imageBlur(img);

//     expect(result.width).toEqual(expected.width);
//     expect(result.height).toEqual(expected.height);
//     for (let i = 0; i < result.width; ++i) {
//       for (let j = 0; j < result.height; ++j) {
//         expect(result.getPixel(i, j)).toEqual(expected.getPixel(i, j));
//       }
//     }
//   });
// });

// describe("composeFunctions", () => {
//   const grayscale: ((p: Color) => Color) = ([r, g, b, a]) => [(r + g + b) / 3, (r + g + b) / 3, (r + g + b) / 3, a];
//   const invert: ((p: Color) => Color) = ([r, g, b, a]) => [255 - r, 255 - g, 255 - b, a];
//   const sepia: ((p: Color) => Color) = ([r, g, b, a]) => [
//     Math.min(Math.round(0.393 * r + 0.769 * g + 0.189 * b), 255),
//     Math.min(Math.round(0.349 * r + 0.686 * g + 0.168 * b), 255),
//     Math.min(Math.round(0.272 * r + 0.534 * g + 0.131 * b), 255),
//     a,
//   ];

//   it("should compose an array of 2 functions", () => {
//     const composedFn = composeFunctions([grayscale, invert]);
//     expect(composedFn([100, 150, 200, 255])).toEqual([155, 105, 50, 255]);
//   });

//   it("should compose an array of 3 functions", () => {
//     const composedFn = composeFunctions([grayscale, invert, sepia]);
//     expect(composedFn([100, 150, 200, 255])).toEqual([110, 96, 79, 255]);
//   });

//   it("should return the original color when given an empty array", () => {
//     const composedFn = composeFunctions([]);
//     expect(composedFn([100, 150, 200, 255])).toEqual([100, 150, 200, 255]);
//   });
// });

// describe("combineThree", () => {
//   const img = new Image(2, 2, new Uint8ClampedArray([
//     255, 0, 0, 255, 0, 255, 0, 255,
//     255, 255, 0, 255, 0, 0, 255, 255,
//   ]));

//   const expected = new Image(2, 2, new Uint8ClampedArray([
//     127, 191, 63, 255, 63, 191, 127, 255,
//     0, 191, 127, 255, 127, 63, 191, 255,
//   ]));

//   it("returns a new image with the colors transformed successively by removeRed and flipColors twice", () => {
//     const result = combineThree(img);
//     for (let i = 0; i < result.width; i++) {
//       for (let j = 0; j < result.height; j++) {
//         expect(result.getPixel(i, j)).toEqual(expected.getPixel(i, j));
//       }
//     }
//   });
// });
