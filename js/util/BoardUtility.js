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
  board[Pieces.BLACK_ROOK_1] = convertPositionToIndex(0, 0);
  board[Pieces.BLACK_KNIGHT_1] = convertPositionToIndex(1, 0);
  board[Pieces.BLACK_BISHOP_1] = convertPositionToIndex(2, 0);
  board[Pieces.BLACK_QUEEN] = convertPositionToIndex(3, 0);
  board[Pieces.BLACK_KING] = convertPositionToIndex(4, 0);
  board[Pieces.BLACK_BISHOP_2] = convertPositionToIndex(5, 0);
  board[Pieces.BLACK_KNIGHT_2] = convertPositionToIndex(6, 0);
  board[Pieces.BLACK_ROOK_2] = convertPositionToIndex(7, 0);

  board[Pieces.BLACK_PAWN_1] = convertPositionToIndex(0, 1);
  board[Pieces.BLACK_PAWN_2] = convertPositionToIndex(1, 1);
  board[Pieces.BLACK_PAWN_3] = convertPositionToIndex(2, 1);
  board[Pieces.BLACK_PAWN_4] = convertPositionToIndex(3, 1);
  board[Pieces.BLACK_PAWN_5] = convertPositionToIndex(4, 1);
  board[Pieces.BLACK_PAWN_6] = convertPositionToIndex(5, 1);
  board[Pieces.BLACK_PAWN_7] = convertPositionToIndex(6, 1);
  board[Pieces.BLACK_PAWN_8] = convertPositionToIndex(7, 1);

  board[Pieces.WHITE_PAWN_1] = convertPositionToIndex(0, 6);
  board[Pieces.WHITE_PAWN_2] = convertPositionToIndex(1, 6);
  board[Pieces.WHITE_PAWN_3] = convertPositionToIndex(2, 6);
  board[Pieces.WHITE_PAWN_4] = convertPositionToIndex(3, 6);
  board[Pieces.WHITE_PAWN_5] = convertPositionToIndex(4, 6);
  board[Pieces.WHITE_PAWN_6] = convertPositionToIndex(5, 6);
  board[Pieces.WHITE_PAWN_7] = convertPositionToIndex(6, 6);
  board[Pieces.WHITE_PAWN_8] = convertPositionToIndex(7, 6);

  board[Pieces.WHITE_ROOK_1] = convertPositionToIndex(0, 7);
  board[Pieces.WHITE_KNIGHT_1] = convertPositionToIndex(1, 7);
  board[Pieces.WHITE_BISHOP_1] = convertPositionToIndex(2, 7);
  board[Pieces.WHITE_QUEEN] = convertPositionToIndex(3, 7);
  board[Pieces.WHITE_KING] = convertPositionToIndex(4, 7);
  board[Pieces.WHITE_BISHOP_2] = convertPositionToIndex(5, 7);
  board[Pieces.WHITE_KNIGHT_2] = convertPositionToIndex(6, 7);
  board[Pieces.WHITE_ROOK_2] = convertPositionToIndex(7, 7);
  return board;
};

export function getPieceType(id) {
  switch (id) {
    case Pieces.BLACK_KNIGHT_1:
    case Pieces.BLACK_KNIGHT_2:
    case Pieces.WHITE_KNIGHT_1:
    case Pieces.WHITE_KNIGHT_2:
      return PieceTypes.KNIGHT;
    case Pieces.BLACK_ROOK_1:
    case Pieces.BLACK_ROOK_2:
    case Pieces.WHITE_ROOK_1:
    case Pieces.WHITE_ROOK_2:
      return PieceTypes.ROOK;
    case Pieces.BLACK_BISHOP_1:
    case Pieces.BLACK_BISHOP_2:
    case Pieces.WHITE_BISHOP_1:
    case Pieces.WHITE_BISHOP_2:
      return PieceTypes.BISHOP;
    case Pieces.BLACK_QUEEN:
    case Pieces.WHITE_QUEEN:
      return PieceTypes.QUEEN;
    case Pieces.BLACK_KING:
    case Pieces.WHITE_KING:
      return PieceTypes.KING;
    case Pieces.BLACK_PAWN_1:
    case Pieces.BLACK_PAWN_2:
    case Pieces.BLACK_PAWN_3:
    case Pieces.BLACK_PAWN_4:
    case Pieces.BLACK_PAWN_5:
    case Pieces.BLACK_PAWN_6:
    case Pieces.BLACK_PAWN_7:
    case Pieces.BLACK_PAWN_8:
    case Pieces.WHITE_PAWN_1:
    case Pieces.WHITE_PAWN_2:
    case Pieces.WHITE_PAWN_3:
    case Pieces.WHITE_PAWN_4:
    case Pieces.WHITE_PAWN_5:
    case Pieces.WHITE_PAWN_6:
    case Pieces.WHITE_PAWN_7:
    case Pieces.WHITE_PAWN_8:
      return PieceTypes.PAWN;
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