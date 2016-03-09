'use strict';

import { Pieces, PieceTypes, PieceColors } from './../constants/ChessConstants.js';

export function convertIndexToPosition(i) {
  return [ i % 8, Math.floor(i / 8) ];
}

export function convertPositionToIndex(x, y) {
  return y * 8 + x;
}

export function setupBoard() {
  let board = {};

  board[Pieces.BLACK_KNIGHT_1] = convertPositionToIndex(1, 0);
  board[Pieces.BLACK_KNIGHT_2] = convertPositionToIndex(6, 0);

  board[Pieces.WHITE_KNIGHT_1] = convertPositionToIndex(1, 7);
  board[Pieces.WHITE_KNIGHT_2] = convertPositionToIndex(6, 7);
  return board;
};

export function getPieceType(id) {
  switch (id) {
    case Pieces.BLACK_KNIGHT_1:
    case Pieces.BLACK_KNIGHT_2:
    case Pieces.WHITE_KNIGHT_1:
    case Pieces.WHITE_KNIGHT_2:
      return PieceTypes.KNIGHT;
    default:
      // Do Nothing
  }
}

export function getPieceColor(id) {
  switch(id) {
    case Pieces.BLACK_ROOK_1:
    case Pieces.BLACK_ROOK_2:
    case Pieces.BLACK_KNIGHT_1:
    case Pieces.BLACK_KNIGHT_2:
    case Pieces.BLACK_BISHOP_1:
    case Pieces.BLACK_BISHOP_2:
    case Pieces.BLACK_QUEEN:
    case Pieces.BLACK_KING:
    case Pieces.BLACK_PAWN_1:
    case Pieces.BLACK_PAWN_2:
    case Pieces.BLACK_PAWN_3:
    case Pieces.BLACK_PAWN_4:
    case Pieces.BLACK_PAWN_5:
    case Pieces.BLACK_PAWN_6:
    case Pieces.BLACK_PAWN_7:
    case Pieces.BLACK_PAWN_8:
      return PieceColors.BLACK;
    case Pieces.WHITE_ROOK_1:
    case Pieces.WHITE_ROOK_2:
    case Pieces.WHITE_KNIGHT_1:
    case Pieces.WHITE_KNIGHT_2:
    case Pieces.WHITE_BISHOP_1:
    case Pieces.WHITE_BISHOP_2:
    case Pieces.WHITE_QUEEN:
    case Pieces.WHITE_KING:
    case Pieces.WHITE_PAWN_1:
    case Pieces.WHITE_PAWN_2:
    case Pieces.WHITE_PAWN_3:
    case Pieces.WHITE_PAWN_4:
    case Pieces.WHITE_PAWN_5:
    case Pieces.WHITE_PAWN_6:
    case Pieces.WHITE_PAWN_7:
    case Pieces.WHITE_PAWN_8:
      return PieceColors.WHITE;
    default:
      // Do Nothing
  }
}