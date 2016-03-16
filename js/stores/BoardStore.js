'use strict';

import assign from 'object-assign';
import { EventEmitter } from 'events';
import ChessDispatcher from './../dispatcher/ChessDispatcher.js';
import { ActionTypes, Pieces, PieceTypes, PieceColors } from './../constants/ChessConstants.js';
import { getPieceType, getPieceColor, convertIndexToPosition, convertPositionToIndex } from './../util/BoardUtility.js';

const CHANGE_EVENT = 'change';

let pieces = {};
let promotions = {};
let turn = PieceColors.WHITE;
let whiteCanCastleKings = true;
let whiteCanCastleQueens = true;
let blackCanCastleKings = true;
let blackCanCastleQueens = true;
let whiteEnPassant = -1;  // Holds the column of the black pawn that moved two spaces last turn
let blackEnPassant = -1;

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

  // Called once per square
  // True: Valid move square
  // False: Invalid move square
  canMove: function(toPos, item) {
    const piece = pieces[item.id];
    const pieceAt = _pieceAt(toPos);
    const [x, y] = convertIndexToPosition(piece.pos);
    const [toX, toY] = convertIndexToPosition(toPos);

    // Can't move to any space occupied by your own pieces.
    if (pieceAt && _pieceAt(toPos).color === piece.color) {
      return false;
    }

    // Valid Piece Movement
    switch(piece.type) {
      case PieceTypes.ROOK:
        return rookMove(x, y, toX, toY);
      case PieceTypes.KNIGHT:
        return knightMove(x, y, toX, toY);
      case PieceTypes.BISHOP:
        return bishopMove(x, y, toX, toY);
      case PieceTypes.QUEEN:
        return queenMove(x, y, toX, toY);
      case PieceTypes.KING:
        return kingMove(x, y, toX, toY, piece.color);
      case PieceTypes.PAWN:
        return pawnMove(x, y, toX, toY, piece.color);
      default:
        // Do Nothing
    }
  }
});

function _checkLine(x, y, delta, xDir, yDir, target) {
  // Traverse the path to the move target
  for (let i = 1; i < delta; i++) {
    let tempIndex = convertPositionToIndex(x + i * xDir, y + i * yDir);
    let piece = _pieceAt(tempIndex);

    // If there is a piece
    if (piece) {
      // And it is in the way i.e. Not the move target
      // If it's at the target, it must be an enemy
      return tempIndex === target;
    }
  }

  // Traverses with no issues
  return true;
}

function rookMove(x, y, toX, toY) {
  let xDir, yDir, delta;

  if (x === toX) {
    // y-axis

    xDir = 0;
    yDir = y < toY ? 1 : -1;
    delta = Math.abs(toY - y);
  } else if (y === toY) {
    // x-axis

    xDir = x < toX ? 1 : -1;
    yDir = 0;
    delta = Math.abs(toX - x);
  } else {
    return false;
  }

  return _checkLine(x, y, delta, xDir, yDir, convertPositionToIndex(toX, toY));
}

function knightMove(x, y, toX, toY) {
  const dx = Math.abs(toX - x);
  const dy = Math.abs(toY - y);
  return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
}

function bishopMove(x, y, toX, toY) {
  const dx = toX - x;
  const dy = toY - y;

  let xDir, yDir, delta;

  if (Math.abs(dx) === Math.abs(dy)) {
    dx > 0 ? xDir = 1 : xDir = -1;
    dy > 0 ? yDir = 1 : yDir = -1;
    delta = Math.abs(dx);
  } else {
    return false;
  }
  return _checkLine(x, y, delta, xDir, yDir, convertPositionToIndex(toX, toY));
  
}

function queenMove(x, y, toX, toY) {
  return bishopMove(x, y, toX, toY) || rookMove(x, y, toX, toY);
}

function kingMove(x, y, toX, toY, pieceColor) {
  const dx = Math.abs(toX - x);
  const dy = Math.abs(toY - y);

  // Castling

  if (pieceColor === PieceColors.WHITE) {
    // White
    if (toX === 6 && toY === 7 && whiteCanCastleKings && 
      pieces[Pieces.WHITE_ROOK_2] === convertPositionToIndex(7, 7) &&
      !_pieceAt(convertPositionToIndex(5, 7)) && 
      !_pieceAt(convertPositionToIndex(6, 7))) {
        // King's Castle
        return true;
    } else if (toX === 2 && toY === 7 && whiteCanCastleQueens &&
      pieces[Pieces.WHITE_ROOK_1] === convertPositionToIndex(0, 7) &&
      !_pieceAt(convertPositionToIndex(1, 7)) && 
      !_pieceAt(convertPositionToIndex(2, 7)) &&
      !_pieceAt(convertPositionToIndex(3, 7))) {
        // Queen's Castle
        return true;
    }
  } else if (pieceColor === PieceColors.BLACK) {
    // Black
    if (toX === 6 && toY === 0 && blackCanCastleKings &&
      pieces[Pieces.BLACK_ROOK_2] === convertPositionToIndex(7, 0) &&
      !_pieceAt(convertPositionToIndex(5, 0)) &&
      !_pieceAt(convertPositionToIndex(6, 0))) {
        // King's Castle
        return true;
    } else if (toX === 2 && toY === 0 && blackCanCastleQueens &&
      pieces[Pieces.BLACK_ROOK_1] === convertPositionToIndex(0, 0) &&
      !_pieceAt(convertPositionToIndex(1, 0)) &&
      !_pieceAt(convertPositionToIndex(2, 0)) &&
      !_pieceAt(convertPositionToIndex(3, 0))) {
        // Queen's Castle
        return true;
    }
  }

  if (dx <= 1 && dy <= 1) {
    return true;
  }
  return false;
}

function pawnMove(x, y, toX, toY, pieceColor) {
  if (pieceColor === PieceColors.WHITE) {
    // White
    // First Move
    if (y === 6 && (toX === x && (toY === 5 || toY === 4))) {
      return true;
    }

    if (toY === y - 1) {
      // Moving forward
      if (toX === x) {
        return !_pieceAt(convertPositionToIndex(toX, toY));
      } else if (Math.abs(toX - x) === 1) {
        // One to the left or right
        if (_pieceAt(convertPositionToIndex(toX, toY))) {
          return true;
        }
        // En Passant
        return y === 3 && toX === whiteEnPassant;
      }
    }    
  } else {
    // Black
    if (y === 1 && (toX === x && (toY === 2 || toY === 3))) {
      return true;
    }

    if (toY === y + 1) {
      // Moving forward
      if (toX === x) {
        return !_pieceAt(convertPositionToIndex(toX, toY));
      } else if (Math.abs(toX - x) === 1) {
        // One to the left or right
        if (_pieceAt(convertPositionToIndex(toX, toY))) {
          return true;
        }

        // En Passant
        return y === 4 && toX === blackEnPassant;
      }
    }
  }
  
  return false;
}


function _pieceAt(pos) {
  for (let piece in pieces) {
    if (pieces[piece].pos === pos) {
      return pieces[piece];
    }
  }
}

BoardStore.dispatchToken = ChessDispatcher.register((action) => {
  switch(action.type) {
    case ActionTypes.BOARD_UPDATE:
      pieces = action.pieces;
      BoardStore.emitChange();
      break;
    case ActionTypes.PIECE_UPDATE:
      const pieceColor = getPieceColor(action.id);

      // Move Piece
      pieces[action.id] = action.pos;

      let temp = _pieceAt(action.pos);
      if (temp && getPieceColor(temp) !== pieceColor) {
        // Piece Capture
        pieces[temp] = -1;
      }

      // Castling
      if (getPieceType(action.id) === PieceTypes.KING) {
        if (pieceColor === PieceColors.WHITE) {
          // White
          if (action.pos === convertPositionToIndex(6, 7)) {
            // King's Castle
            pieces[Pieces.WHITE_ROOK_2] = convertPositionToIndex(5, 7);
          } else if (action.pos === convertPositionToIndex(2, 7)) {
            // Queen's Castle
            pieces[Pieces.WHITE_ROOK_1] = convertPositionToIndex(3, 7);
          }
          whiteCanCastleKings = false;
          whiteCanCastleQueens = false;
        } else {
          // Black
          if (action.pos === convertPositionToIndex(6, 0)) {
            // King's Castle
            pieces[Pieces.BLACK_ROOK_2] = convertPositionToIndex(5, 0);
          } else if (action.pos === convertPositionToIndex(2, 0)) {
            pieces[Pieces.BLACK_ROOK_1] = convertPositionToIndex(3, 0);
          }
          blackCanCastleKings = false;
          blackCanCastleQueens = false;
        }
      }

      // Remove Castling eligibility
      if (getPieceType(action.id) === PieceTypes.ROOK) {
        if (pieceColor === PieceColors.WHITE) {
          if (action.id === Pieces.WHITE_ROOK_2) {
            whiteCanCastleKings = false;
          } else if (action.id === Pieces.WHITE_ROOK_1) {
            whiteCanCastleQueens = false;
          }
        } else {
          if (action.id === Pieces.BLACK_ROOK_2) {
            blackCanCastleKings = false;
          } else if (action.id === Pieces.BLACK_ROOK_1) {
            blackCanCastleQueens = false;
          }
        }
      }



      if (getPieceType(action.id) === PieceTypes.PAWN) {
        const [x, y] = convertIndexToPosition(pieces[action.id]);
        const [toX, toY] = convertIndexToPosition(action.pos);

        // White
        if (pieceColor === PieceColors.WHITE) {
          // Promotion
          if (toY === 0) {
            // Auto Promote to Queen
            // Handle Dialog later
            pieces[action.id] = -1;
            pieces[Pieces.WHITE_QUEEN] = action.pos;


          // Capturing En Passant
          } else if (y === 3 && toX === whiteEnPassant) {
            const tempIndex = convertPositionToIndex(toX, y);
            for (let piece in pieces) {
              if (pieces[piece] === tempIndex) {
                pieces[piece] = -1;
              }
            }
            whiteEnPassant = -1;

          // Flagging En Passant
          } else if (y === 6 && toY === 4) {
            blackEnPassant = x;
          }

        // Black
        } else {
          // Capturing En Passant
          if (y === 4 && toX === blackEnPassant) {
            const tempIndex = convertPositionToIndex(toX, y);
            for (let piece in pieces) {
              if (pieces[piece] === tempIndex) {
                pieces[piece] = -1;
              }
            }
            blackEnPassant = -1;
          }

          // Flagging En Passant
          if (y === 1 && toY === 3) {
            whiteEnPassant = x;
          }
        }
      }

      // Remove En Passant Flag
      if (pieceColor === PieceColors.WHITE && whiteEnPassant !== -1) {
        whiteEnPassant = -1;
      } else if (pieceColor === PieceColors.BLACK && blackEnPassant !== -1) {
        blackEnPassant = -1;
      }


      turn = turn === PieceColors.WHITE ? PieceColors.BLACK : PieceColors.WHITE;
      BoardStore.emitChange();
      break;
    default:
      // do nothing
  }
});

export default BoardStore;
