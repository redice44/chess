'use strict';

import assign from 'object-assign';
import { EventEmitter } from 'events';
import ChessDispatcher from './../dispatcher/ChessDispatcher.js';
import { ActionTypes, Pieces, PieceTypes, PieceColors } from './../constants/ChessConstants.js';
import { getPieceType, getPieceColor, convertIndexToPosition, convertPositionToIndex } from './../util/BoardUtility.js';

const CHANGE_EVENT = 'change';

let pieces = {};
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
      if (toX === x && (toY === 5 || toY === 4)) {
        return true;
      }
    }

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
        // En Passant
        if (y === 3 && toX === whiteEnPassant) {
          return true;
        }

        return false;
      }
    }
    return false;
    
  } else {
    // Black
    if (y === 1) {
      if (toX === x && (toY === 2 || toY === 3)) {
        return true;
      }
    }

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

        // En Passant
        if (y === 4 && toX === blackEnPassant) {
          return true;
        }

        return false;
      }
    }
    return false;
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

        if (pieceColor === PieceColors.WHITE) {
          // Capturing En Passant
          if (y === 3 && toX === whiteEnPassant) {
            const tempIndex = convertPositionToIndex(toX, y);
            for (let piece in pieces) {
              if (pieces[piece] === tempIndex) {
                pieces[piece] = -1;
              }
            }
            whiteEnPassant = -1;
          }

          // Flagging En Passant
          if (y === 6 && toY === 4) {
            blackEnPassant = x;
          }
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


      pieces[action.id] = action.pos;
      turn = turn === PieceColors.WHITE ? PieceColors.BLACK : PieceColors.WHITE;
      BoardStore.emitChange();
      break;
    default:
      // do nothing
  }
});

export default BoardStore;
