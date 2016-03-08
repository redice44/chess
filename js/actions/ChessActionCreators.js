'use strict';

import ChessDispatcher from './../dispatcher/ChessDispatcher.js';
import ChessConstants from './../constants/ChessConstants.js';

const ActionTypes = ChessConstants.ActionTypes;

export default {
  moveKnight: function(payload) {
    ChessDispatcher.dispatch({
      type: ActionTypes.BOARD_UPDATE,
      pos: payload
    });
  }
};
