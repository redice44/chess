'use strict';

import ChessDispatcher from './../dispatcher/ChessDispatcher.js';
import { ActionTypes } from './../constants/ChessConstants.js';

export default {
  setupBoard: function(layout) {
    ChessDispatcher.dispatch({
      type: ActionTypes.BOARD_UPDATE,
      layout: layout
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
