'use strict';

import assign from 'object-assign';
import { EventEmitter } from 'events';
import ChessDispatcher from './../dispatcher/ChessDispatcher.js';
import { ActionTypes, Pieces, PieceTypes } from './../constants/ChessConstants.js';
import { getPieceType, getPieceColor, convertIndexToPosition, convertPositionToIndex } from './../util/BoardUtility.js';

const CHANGE_EVENT = 'change';

let boardLayout = {};

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

  getLayout: function() {
    return boardLayout;
  },

  canMove: function(toX, toY, item) {
    const pieceType = getPieceType(item.id);
    const pieceColor = getPieceColor(item.id);

    let toIndex = convertPositionToIndex(toX, toY);

    for (let prop in boardLayout) {
      // If there is a piece collision and it's the same color
      if (boardLayout[prop] === toIndex && getPieceColor(prop) === pieceColor) {
        return false;
      }
    }

    switch(pieceType) {
      case PieceTypes.KNIGHT:
        const [x, y] = convertIndexToPosition(boardLayout[item.id]);
        let dx = Math.abs(toX - x);
        let dy = Math.abs(toY - y);
        return (dx === 2 && dy === 1) ||
               (dx === 1 && dy === 2);
      default:
        return false;
    }
  }
});

BoardStore.dispatchToken = ChessDispatcher.register((action) => {
  switch(action.type) {
    case ActionTypes.BOARD_UPDATE:
      console.log(action);
      boardLayout = action.layout;
      BoardStore.emitChange();
      break;
    case ActionTypes.PIECE_UPDATE:
      boardLayout[action.id] = action.pos;
      BoardStore.emitChange();
      break;
    default:
      // do nothing
  }
});

export default BoardStore;