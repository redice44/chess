'use strict';

import ChessDispatcher from './../dispatcher/ChessDispatcher.js';
import { ActionTypes } from './../constants/ChessConstants.js';

export default {
  setupBoard: function(pieces) {
    ChessDispatcher.dispatch({
      type: ActionTypes.BOARD_UPDATE,
      pieces: pieces
    });
  },

  move: function(pos, item) {
    ChessDispatcher.dispatch({
      type: ActionTypes.PIECE_UPDATE,
      pos: pos,
      id: item.id
    });
  }
};
