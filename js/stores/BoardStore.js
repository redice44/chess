'use strict';

import assign from 'object-assign';
import { EventEmitter } from 'events';
import ChessDispatcher from './../dispatcher/ChessDispatcher.js';
import ChessConstants from './../constants/ChessConstants.js';

const ActionTypes = ChessConstants.ActionTypes;
const CHANGE_EVENT = 'change';

let _knightPos = [1, 0];

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
    return _knightPos;
  },
});

BoardStore.dispatchToken = ChessDispatcher.register((action) => {
  switch(action.type) {
    case ActionTypes.BOARD_UPDATE:
      // valid knight move
      _knightPos = action.pos;
      BoardStore.emitChange();
      break;
    default:
      // do nothing
  }
});

export default BoardStore;
