'use strict';

import assign from 'object-assign';
import { EventEmitter } from 'events';
import ChessDispatcher from './../dispatcher/ChessDispatcher.js';
import { ActionTypes, Pieces, PieceTypes, PieceColors } from './../constants/ChessConstants.js';
import { getPieceType, getPieceColor, convertIndexToPosition, convertPositionToIndex } from './../util/BoardUtility.js';

const CHANGE_EVENT = 'change';

let pieces = {};
let turn = PieceColors.WHITE;

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

  getPieces: function() {
    return pieces;
  },

  getTurn: function() {
    return turn;
  },

  canMove: function(toPos, item) {
    const pieceType = getPieceType(item.id);
    const pieceColor = getPieceColor(item.id);
    const [toX, toY] = convertIndexToPosition(toPos);

    for (let piece in pieces) {
      // If there is a piece collision and it's the same color
      if (pieces[piece] === toPos && getPieceColor(piece) === pieceColor) {
        return false;
      }
    }

    // Valid Piece Movement
    switch(pieceType) {
      case PieceTypes.KNIGHT:
        const [x, y] = convertIndexToPosition(pieces[item.id]);
        let dx = Math.abs(toX - x);
        let dy = Math.abs(toY - y);
        return (dx === 2 && dy === 1) ||
               (dx === 1 && dy === 2);
      default:
        return false;
    }

    return true;
  }
});

BoardStore.dispatchToken = ChessDispatcher.register((action) => {
  switch(action.type) {
    case ActionTypes.BOARD_UPDATE:
      pieces = action.pieces;
      BoardStore.emitChange();
      break;
    case ActionTypes.PIECE_UPDATE:
      const pieceColor = getPieceColor(action.id);

      for (let piece in pieces) {
        // If there is a piece collision and it's not the same color
        if (pieces[piece] === action.pos && getPieceColor(piece) !== pieceColor) {
          // Piece Capture
          pieces[piece] = -1;
        }
      }
      pieces[action.id] = action.pos;
      turn = turn === PieceColors.WHITE ? PieceColors.BLACK : PieceColors.WHITE;
      BoardStore.emitChange();
      break;
    default:
      // do nothing
  }
});

export default BoardStore;
