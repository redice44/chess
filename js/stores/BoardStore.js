'use strict';

import assign from 'object-assign';
import { EventEmitter } from 'events';
import ChessDispatcher from './../dispatcher/ChessDispatcher.js';
import { ActionTypes, Pieces } from './../constants/ChessConstants.js';

const CHANGE_EVENT = 'change';

let blackPieces = Pieces;
blackPieces[Pieces.KNIGHT_1] = [1, 0];

let BoardStore = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getKnightPosition: function() {
    return blackPieces[Pieces.KNIGHT_1];
  },
});

BoardStore.dispatchToken = ChessDispatcher.register((action) => {
  switch(action.type) {
    case ActionTypes.BOARD_UPDATE:
      // valid knight move
      blackPieces[Pieces.KNIGHT_1] = action.pos;
      BoardStore.emitChange();
      break;
    default:
      // do nothing
  }
});

export default BoardStore;
