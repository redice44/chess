'use strict';

import keyMirror from 'keymirror';

export let ActionTypes = keyMirror({
  BOARD_UPDATE: null,
  PIECE_UPDATE: null
});

export let Pieces = keyMirror({
  BLACK_ROOK_1: null,
  BLACK_ROOK_2: null,
  BLACK_KNIGHT_1: null,
  BLACK_KNIGHT_2: null,
  BLACK_BISHOP_1: null,
  BLACK_BISHOP_2: null,
  BLACK_QUEEN: null,
  BLACK_KING: null,
  BLACK_PAWN_1: null,
  BLACK_PAWN_2: null,
  BLACK_PAWN_3: null,
  BLACK_PAWN_4: null,
  BLACK_PAWN_5: null,
  BLACK_PAWN_6: null,
  BLACK_PAWN_7: null,
  BLACK_PAWN_8: null,
  WHITE_ROOK_1: null,
  WHITE_ROOK_2: null,
  WHITE_KNIGHT_1: null,
  WHITE_KNIGHT_2: null,
  WHITE_BISHOP_1: null,
  WHITE_BISHOP_2: null,
  WHITE_QUEEN: null,
  WHITE_KING: null,
  WHITE_PAWN_1: null,
  WHITE_PAWN_2: null,
  WHITE_PAWN_3: null,
  WHITE_PAWN_4: null,
  WHITE_PAWN_5: null,
  WHITE_PAWN_6: null,
  WHITE_PAWN_7: null,
  WHITE_PAWN_8: null
});

export const PieceTypes = keyMirror({
  PIECE: null,
  ROOK: null,
  KNIGHT: null,
  BISHOP: null,
  QUEEN: null,
  KING: null,
  PAWN: null
});

export const PieceColors = keyMirror({
  BLACK: null,
  WHITE: null
});
