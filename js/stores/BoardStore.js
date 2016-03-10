'use strict';

import assign from 'object-assign';
import { EventEmitter } from 'events';
import ChessDispatcher from './../dispatcher/ChessDispatcher.js';
import { ActionTypes, Pieces, PieceTypes, PieceColors } from './../constants/ChessConstants.js';
import { getPieceType, getPieceColor, convertIndexToPosition, convertPositionToIndex } from './../util/BoardUtility.js';

const CHANGE_EVENT = 'change';

let pieces = {};
let turn = PieceColors.WHITE;
let whiteCanCastle = true;
let blackCanCastle = true;

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
    const [x, y] = convertIndexToPosition(pieces[item.id]);

    // Can't move to any space occupied by your own pieces.
    for (let piece in pieces) {
      if (pieces[piece] === toPos && getPieceColor(piece) === pieceColor) {
        return false;
      }
    }

    // Valid Piece Movement
    switch(pieceType) {
      case PieceTypes.KNIGHT:
        return knightMove(toPos, item);
      case PieceTypes.ROOK:
        return rookMove(toPos, item);
      case PieceTypes.BISHOP:
        return bishopMove(toPos, item);
      case PieceTypes.QUEEN:
        return queenMove(toPos, item);
      case PieceTypes.KING:
        return kingMove(toPos, item);
      case PieceTypes.PAWN:
        return pawnMove(toPos, item);
      default:
        return false;
    }

    return true;
  }
});

function kingMove(toPos, item) {
  const [x, y] = convertIndexToPosition(pieces[item.id]);
  const pieceColor = getPieceColor(item.id);
  const [toX, toY] = convertIndexToPosition(toPos);
  const dx = Math.abs(toX - x);
  const dy = Math.abs(toY - y);

  // Castling
  if (whiteCanCastle && pieceColor === PieceColors.WHITE && toX === 6 && toY === 7) {
    if (!_pieceAt(convertPositionToIndex(5, 7)) && !_pieceAt(convertPositionToIndex(6, 7))) {
      return true;
    }
  }

  if (dx <= 1 && dy <= 1) {
    console.log(toX, toY, x, y);
    for (let piece in pieces) {
      if (pieces[piece] === toPos) {
        return pieceColor !== getPieceColor(piece);
      }
    }
    return true;
  }
  return false;
}

function queenMove(toPos, item) {
  return bishopMove(toPos, item) || rookMove(toPos, item);
}

function bishopMove(toPos, item) {
  const [x, y] = convertIndexToPosition(pieces[item.id]);
  const pieceColor = getPieceColor(item.id);
  const [toX, toY] = convertIndexToPosition(toPos);
  const dx = toX - x;
  const dy = toY - y;

  if (dx === dy && dx > 0) {
    const delta = dx;
    // Down Right
    for (let i = 1; i < delta; i++) {
      let tempIndex = convertPositionToIndex(x + i, y + i);
      for (let piece in pieces) {
        if (pieces[piece] === tempIndex) {
          // Piece in the way
          return getPieceColor(piece) !== pieceColor && tempIndex === toPos;
        }
      }
    }
    return true;
  } else if (dx === dy && dx < 0) {
    const delta = Math.abs(dx);
    // Up Left
    for (let i = 1; i < delta; i++) {
      let tempIndex = convertPositionToIndex(x - i, y - i);
      for (let piece in pieces) {
        if (pieces[piece] === tempIndex) {
          // Piece in the way
          return getPieceColor(piece) !== pieceColor && tempIndex === toPos;
        }
      }
    }
    return true;
  } else if (dx === -dy && dx > 0) {
    const delta = dx;
    // Up Right
    for (let i = 1; i < delta; i++) {
      let tempIndex = convertPositionToIndex(x + i, y - i);
      for (let piece in pieces) {
        if (pieces[piece] === tempIndex) {
          // Piece in the way
          return getPieceColor(piece) !== pieceColor && tempIndex === toPos;
        }
      }
    }
    return true;
  } else if (dx === -dy && dx < 0) {
    const delta = Math.abs(dx);

    // Down Left
    for (let i = 1; i < delta; i++) {
      let tempIndex = convertPositionToIndex(x - i, y + i);
      for (let piece in pieces) {
        if (pieces[piece] === tempIndex) {
          // Piece in the way
          return getPieceColor(piece) !== pieceColor && tempIndex === toPos;
        }
      }
    }
    return true;
  }
  return false;
}

function pawnMove(toPos, item) {
  const [toX, toY] = convertIndexToPosition(toPos);
  const [x, y] = convertIndexToPosition(pieces[item.id]);
  const pieceColor = getPieceColor(item.id);

  if (pieceColor === PieceColors.WHITE) {
    // White
    // First Move
    if (y === 6 ) {
      return toX === x && (toY === 5 || toY === 4);
    } else {
      if (toY === y - 1) {
        // Moving forward
        if (toX === x) {
          for (let piece in pieces) {
            if (pieces[piece] === toPos) {
              // There is a piece in front of the pawn
              return false;
            }
          }
          // There is no piece in front of the pawn
          return true;
        } else if (Math.abs(toX - x) === 1) {
          // One to the left or right
          for (let piece in pieces) {
            if (pieces[piece] === toPos && pieceColor !== getPieceColor(piece)) {
              // Can Diagonally capture
              return true;
            }
          }
          return false;
        }
      }
      return false;
    }
  } else {
    // Black
    if (y === 1) {
      return toX === x && (toY === 2 || toY === 3);      
    } else {
      if (toY === y + 1) {
        // Moving forward
        if (toX === x) {
          for (let piece in pieces) {
            if (pieces[piece] === toPos) {
              // There is a piece in front of the pawn
              return false;
            }
          }
          // There is no piece in front of the pawn
          return true;
        } else if (Math.abs(toX - x) === 1) {
          // One to the left or right
          for (let piece in pieces) {
            if (pieces[piece] === toPos && pieceColor !== getPieceColor(piece)) {
              // Can Diagonally capture
              return true;
            }
          }
          return false;
        }
      }
      return false;
    }
  }
  return false;
}

function knightMove(toPos, item) {
  const [toX, toY] = convertIndexToPosition(toPos);
  const [x, y] = convertIndexToPosition(pieces[item.id]);
  const dx = Math.abs(toX - x);
  const dy = Math.abs(toY - y);
  return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
}

function rookMove(toPos, item) {
  const [x, y] = convertIndexToPosition(pieces[item.id]);
  const pieceColor = getPieceColor(item.id);
  const [toX, toY] = convertIndexToPosition(toPos);

  if (x === toX) {
    // y-axis
    if (y < toY) {
      // Go Down
      let tempY = y;
      while (tempY < toY) {
        tempY++;
        for (let piece in pieces) {
          let tempIndex = convertPositionToIndex(x, tempY);
          if (pieces[piece] === tempIndex) {
            // There is a piece in the way
            return getPieceColor(piece) !== pieceColor && tempIndex === toPos;
          }
        }
      }
    } else {
      // Go Up
      let tempY = y;
      while (tempY > toY ) {
        tempY--;
        let tempIndex = convertPositionToIndex(x, tempY);
        for (let piece in pieces) {
          if (pieces[piece] === tempIndex) {
            // There is a piece in the way
            return getPieceColor(piece) !== pieceColor && tempIndex === toPos;
          }
        }
      }
    }
    return true;
  } else if (y === toY) {
    // x-axis
    if (x < toX) {
      // Go Down
      let tempX = x;
      while (tempX < toX) {
        tempX++;
        for (let piece in pieces) {
          let tempIndex = convertPositionToIndex(tempX, y);
          if (pieces[piece] === tempIndex) {
            // There is a piece in the way
            return getPieceColor(piece) !== pieceColor && tempIndex === toPos;
          }
        }
      }
    } else {
      // Go Up
      let tempX = x;
      while (tempX > toX ) {
        tempX--;
        let tempIndex = convertPositionToIndex(tempX, y);
        for (let piece in pieces) {
          if (pieces[piece] === tempIndex) {
            // There is a piece in the way
            return getPieceColor(piece) !== pieceColor && tempIndex === toPos;
          }
        }
      }
    }
    return true;
  }

  return false;
}

function _pieceAt(pos) {
  for (let piece in pieces) {
    if (pieces[piece] === pos) {
      return true;
    }
  }
  return false;
}
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

      // Castling
      if (getPieceType(action.id) === PieceTypes.KING) {
        if (pieceColor === PieceColors.WHITE && action.pos === convertPositionToIndex(6, 7)) {
          pieces[Pieces.WHITE_ROOK_2] = convertPositionToIndex(5, 7);
          whiteCanCastle = false;
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
