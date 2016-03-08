'use strict';

export function convertIndexToPosition(i) {
  return [ i % 8, Math.floor(i / 8) ];
}

export function convertPositionToIndex(x, y) {
  return y * 8 + x;
}

