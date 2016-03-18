'use strict';

import { Pieces, PieceTypes, PieceColors } from './../constants/ChessConstants.js';

export function convertIndexToPosition(i) {
  return [ i % 8, Math.floor(i / 8) ];
}

export function convertPositionToIndex(x, y) {
  return y * 8 + x;
}

export function invertColor(color) {
  return color === PieceColors.BLACK ? PieceColors.WHITE : PieceColors.BLACK;
}

export function setupBoard() {
  let board = {};

  board[Pieces.BLACK_ROOK_1] = {
    type: PieceTypes.ROOK,
    pos: convertPositionToIndex(0, 0),
    color: PieceColors.BLACK
  };

  board[Pieces.BLACK_KNIGHT_1] = {
    type: PieceTypes.KNIGHT,
    pos: convertPositionToIndex(1, 0),
    color: PieceColors.BLACK
  };

  board[Pieces.BLACK_BISHOP_1] = {
    type: PieceTypes.BISHOP,
    pos: convertPositionToIndex(2, 0),
    color: PieceColors.BLACK
  };

  board[Pieces.BLACK_QUEEN] = {
    type: PieceTypes.QUEEN,
    pos: convertPositionToIndex(3, 0),
    color: PieceColors.BLACK
  };

  board[Pieces.BLACK_KING] = {
    type: PieceTypes.KING,
    pos: convertPositionToIndex(4, 0),
    color: PieceColors.BLACK
  };

  board[Pieces.BLACK_BISHOP_2] = {
    type: PieceTypes.BISHOP,
    pos: convertPositionToIndex(5, 0),
    color: PieceColors.BLACK
  };

  board[Pieces.BLACK_KNIGHT_2] = {
    type: PieceTypes.KNIGHT,
    pos: convertPositionToIndex(6, 0),
    color: PieceColors.BLACK
  };

  board[Pieces.BLACK_ROOK_2] = {
    type: PieceTypes.ROOK,
    pos: convertPositionToIndex(7, 0),
    color: PieceColors.BLACK
  };

  board[Pieces.BLACK_PAWN_1] = {
    type: PieceTypes.PAWN,
    pos: convertPositionToIndex(0, 1),
    color: PieceColors.BLACK
  };

  board[Pieces.BLACK_PAWN_2] = {
    type: PieceTypes.PAWN,
    pos: convertPositionToIndex(1, 1),
    color: PieceColors.BLACK
  };

  board[Pieces.BLACK_PAWN_3] = {
    type: PieceTypes.PAWN,
    pos: convertPositionToIndex(2, 1),
    color: PieceColors.BLACK
  };

  board[Pieces.BLACK_PAWN_4] = {
    type: PieceTypes.PAWN,
    pos: convertPositionToIndex(3, 1),
    color: PieceColors.BLACK
  };

  board[Pieces.BLACK_PAWN_5] = {
    type: PieceTypes.PAWN,
    pos: convertPositionToIndex(4, 1),
    color: PieceColors.BLACK
  };

  board[Pieces.BLACK_PAWN_6] = {
    type: PieceTypes.PAWN,
    pos: convertPositionToIndex(5, 1),
    color: PieceColors.BLACK
  };

  board[Pieces.BLACK_PAWN_7] = {
    type: PieceTypes.PAWN,
    pos: convertPositionToIndex(6, 1),
    color: PieceColors.BLACK
  };

  board[Pieces.BLACK_PAWN_8] = {
    type: PieceTypes.PAWN,
    pos: convertPositionToIndex(7, 1),
    color: PieceColors.BLACK
  };


  board[Pieces.WHITE_PAWN_1] = {
    type: PieceTypes.PAWN,
    pos: convertPositionToIndex(0, 6),
    color: PieceColors.WHITE
  };

  board[Pieces.WHITE_PAWN_2] = {
    type: PieceTypes.PAWN,
    pos: convertPositionToIndex(1, 6),
    color: PieceColors.WHITE
  };

  board[Pieces.WHITE_PAWN_3] = {
    type: PieceTypes.PAWN,
    pos: convertPositionToIndex(2, 6),
    color: PieceColors.WHITE
  };

  board[Pieces.WHITE_PAWN_4] = {
    type: PieceTypes.PAWN,
    pos: convertPositionToIndex(3, 6),
    color: PieceColors.WHITE
  };

  board[Pieces.WHITE_PAWN_5] = {
    type: PieceTypes.PAWN,
    pos: convertPositionToIndex(4, 6),
    color: PieceColors.WHITE
  };

  board[Pieces.WHITE_PAWN_6] = {
    type: PieceTypes.PAWN,
    pos: convertPositionToIndex(5, 6),
    color: PieceColors.WHITE
  };

  board[Pieces.WHITE_PAWN_7] = {
    type: PieceTypes.PAWN,
    pos: convertPositionToIndex(6, 6),
    color: PieceColors.WHITE
  };

  board[Pieces.WHITE_PAWN_8] = {
    type: PieceTypes.PAWN,
    pos: convertPositionToIndex(7, 6),
    color: PieceColors.WHITE
  };

  board[Pieces.WHITE_ROOK_1] = {
    type: PieceTypes.ROOK,
    pos: convertPositionToIndex(0, 7),
    color: PieceColors.WHITE
  };

  board[Pieces.WHITE_KNIGHT_1] = {
    type: PieceTypes.KNIGHT,
    pos: convertPositionToIndex(1, 7),
    color: PieceColors.WHITE
  };

  board[Pieces.WHITE_BISHOP_1] = {
    type: PieceTypes.BISHOP,
    pos: convertPositionToIndex(2, 7),
    color: PieceColors.WHITE
  };

  board[Pieces.WHITE_QUEEN] = {
    type: PieceTypes.QUEEN,
    pos: convertPositionToIndex(3, 7),
    color: PieceColors.WHITE
  };

  board[Pieces.WHITE_KING] = {
    type: PieceTypes.KING,
    pos: convertPositionToIndex(4, 7),
    color: PieceColors.WHITE
  };

  board[Pieces.WHITE_BISHOP_2] = {
    type: PieceTypes.BISHOP,
    pos: convertPositionToIndex(5, 7),
    color: PieceColors.WHITE
  };

  board[Pieces.WHITE_KNIGHT_2] = {
    type: PieceTypes.KNIGHT,
    pos: convertPositionToIndex(6, 7),
    color: PieceColors.WHITE
  };

  board[Pieces.WHITE_ROOK_2] = {
    type: PieceTypes.ROOK,
    pos: convertPositionToIndex(7, 7),
    color: PieceColors.WHITE
  };

  return board;
};

export function getPieceType(id) {
  console.log('getPieceType Called');
  /*
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
  */
}

export function getPieceColor(id) {
  console.log('getPieceColor called');
  /*
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
  */
}