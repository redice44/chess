'use strict';

import ChessDispatcher from './../dispatcher/ChessDispatcher.js';
import { ActionTypes } from './../constants/ChessConstants.js';

export default {
  moveKnight: function(payload) {
    ChessDispatcher.dispatch({
      type: ActionTypes.BOARD_UPDATE,
      pos: payload
    });
  }
};
