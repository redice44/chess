'use strict';

import keyMirror from 'keymirror';

export let ActionTypes =  {
  ActionTypes: keyMirror({
    BOARD_UPDATE: null
  })
};

export let Pieces = {
  Pieces: keyMirror({
    ROOK_1: null,
    ROOK_2: null,
    KNIGHT_1: null,
    KNIGHT_2: null,
    BISHOP_1: null,
    BISHOP_2: null,
    QUEEN: null,
    KING: null,
    PAWN_1: null,
    PAWN_2: null,
    PAWN_3: null,
    PAWN_4: null,
    PAWN_5: null,
    PAWN_6: null,
    PAWN_7: null,
    PAWN_8: null
  })
};

export const ItemTypes = {
  KNIGHT: 'knight'
};
