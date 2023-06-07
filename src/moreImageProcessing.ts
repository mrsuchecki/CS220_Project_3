import type { Color, Image } from "../include/image.js";

function weightedPixel(
  img: Image,
  x: number,
  y: number,
  neighborOffsets: number[],
  neighborWeight: number,
  centerWeight: number
): number[] {
  let r = 0;
  let g = 0;
  let b = 0;

  for (const dx of neighborOffsets) {
    const nx = x + dx;
    const ny = y;
    if (nx >= 0 && nx < img.width && ny >= 0 && ny < img.height) {
      const neighborPixel = img.getPixel(nx, ny);
      r += neighborWeight * neighborPixel[0];
      g += neighborWeight * neighborPixel[1];
      b += neighborWeight * neighborPixel[2];
    }
  }

  const centerPixel = img.getPixel(x, y);
  r += centerWeight * centerPixel[0];
  g += centerWeight * centerPixel[1];
  b += centerWeight * centerPixel[2];

  return [Math.trunc(r), Math.trunc(g), Math.trunc(b)];
}

function computeCenterWeight(neighborOffsets: number[], neighborWeight: number): number {
  return 1 - (neighborOffsets.length - 1) * neighborWeight;
}

export function lineBlur3p(img: Image, lineNo: number): void {
  const neighborOffsets: number[] = [-1, 0, 1];
  const neighborWeight = 1 / 3;
  const centerWeight = computeCenterWeight(neighborOffsets, neighborWeight);

  if (lineNo < 0 || lineNo >= img.height) {
    return;
  }

  for (let x = 0; x < img.width; ++x) {
    const pixel = weightedPixel(img, x, lineNo, neighborOffsets, neighborWeight, centerWeight);
    img.setPixel(x, lineNo, pixel);
  }
}

export function lineBlur5p(img: Image, lineNo: number): void {
  const neighborOffsets: number[] = [-2, -1, 0, 1, 2];
  const neighborWeight = 1 / 5;
  const centerWeight = computeCenterWeight(neighborOffsets, neighborWeight);

  if (lineNo < 0 || lineNo >= img.height) {
    return;
  }

  for (let x = 0; x < img.width; ++x) {
    const pixel = weightedPixel(img, x, lineNo, neighborOffsets, neighborWeight, centerWeight);
    img.setPixel(x, lineNo, pixel);
  }
}

export function blurLines(img: Image, blurLine: (img: Image, lineNo: number) => void): Image {
  //   const newImg = img.copy();
  //   for (let y = 0; y < img.height; y++) {
  //     // Create a copy of the line
  //     const lineCopy = new Image(img.width, 1);
  //     for (let x = 0; x < img.width; x++) {
  //       lineCopy.setPixel(x, 0, img.getPixel(x, y));
  //     }
  //     // Apply the blurLine function to the line copy
  //     blurLine(lineCopy, y);
  //     // Copy the blurred line back to the new image
  //     for (let x = 0; x < img.width; x++) {
  //       newImg.setPixel(x, y, lineCopy.getPixel(x, 0));
  //     }
  //   }
  //   return newImg;
  return img;
}

export function pixelBlur(img: Image, x: number, y: number): Color {
  const neighbors: Color[] = [];
  for (let i = -1; i <= 1; ++i) {
    for (let j = -1; j <= 1; ++j) {
      const nx = x + i;
      const ny = y + j;
      if (nx >= 0 && nx < img.width && ny >= 0 && ny < img.height) {
        neighbors.push(img.getPixel(nx, ny));
      }
    }
  }
  const red = Math.trunc(neighbors.reduce((sum, pixel) => sum + pixel[0], 0) / neighbors.length);
  const green = Math.trunc(neighbors.reduce((sum, pixel) => sum + pixel[1], 0) / neighbors.length);
  const blue = Math.trunc(neighbors.reduce((sum, pixel) => sum + pixel[2], 0) / neighbors.length);
  return [red, green, blue];
}

function imageMapCoord(img: Image, func: (img: Image, x: number, y: number) => Color): Image {
  const newImg = img.copy();
  for (let i = 0; i < newImg.width; ++i) {
    for (let j = 0; j < newImg.height; ++j) {
      newImg.setPixel(i, j, func(img, i, j));
    }
  }
  return newImg;
}

export function imageBlur(img: Image): Image {
  const blurFunc = (img: Image, x: number, y: number) => pixelBlur(img, x, y);
  return imageMapCoord(img, blurFunc);
}

export function composeFunctions(fa: ((p: Color) => Color)[]): (x: Color) => Color {
  return fa.reduce(
    (acc, f) => x => f(acc(x)),
    x => x
  );
}

export function imageMap(img: Image, func: (c: Color) => Color): Image {
  let newImg = img.copy();
  for (let i = 0; i < newImg.width; ++i) {
    for (let j = 0; j < newImg.height; ++j) {
      let pixel = newImg.getPixel(i, j);
      newImg.setPixel(i, j, func(pixel));
    }
  }
  return newImg;
}

export function removeRed(color: Color): Color {
  return [0, color[1], color[2]];
}

export function flipColors(color: Color): Color {
  const flipRed = Math.floor((color[1] + color[2]) / 2);
  const flipGreen = Math.floor((color[0] + color[2]) / 2);
  const flipBlue = Math.floor((color[0] + color[1]) / 2);
  return [flipRed, flipGreen, flipBlue];
}

export function combineThree(img: Image): Image {
  const transform = composeFunctions([removeRed, flipColors, flipColors]);
  return imageMap(img, transform);
}
