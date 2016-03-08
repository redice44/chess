'use strict';

import { Pieces } from './../constants/ChessConstants.js';
import { convertPositionToIndex } from './PositionUtility.js';

export function setupBoard() {
  let board = {};

  board[Pieces.BLACK_KNIGHT_1] = convertPositionToIndex(1, 0);
  board[Pieces.BLACK_KNIGHT_2] = convertPositionToIndex(6, 0);

  board[Pieces.WHITE_KNIGHT_1] = convertPositionToIndex(1, 7);
  board[Pieces.WHITE_KNIGHT_2] = convertPositionToIndex(6, 7);
  return board;
};
