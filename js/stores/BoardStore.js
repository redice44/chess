'use strict';

import assign from 'object-assign';
import { EventEmitter } from 'events';
import ChessDispatcher from './../dispatcher/ChessDispatcher.js';
import { ActionTypes, Pieces, PieceTypes, PieceColors } from './../constants/ChessConstants.js';
import { invertColor, getPieceType, getPieceColor, convertIndexToPosition, convertPositionToIndex } from './../util/BoardUtility.js';

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
let inCheck = false;
let tempMove = false;

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

  // True: Valid move square
  // False: Invalid move square
  canMove: function(toPos, itemId) {
    let piece = pieces[itemId];
    let pieceAt = _pieceAt(toPos);
    const [x, y] = convertIndexToPosition(piece.pos);
    const [toX, toY] = convertIndexToPosition(toPos);
    let validMove = false;

    // Can't move to any space occupied by your own pieces.
    if (pieceAt && pieceAt.color === piece.color) {
      // Escape out. No need to run any other validation
      return false;
    }

    switch(piece.type) {
      case PieceTypes.ROOK:
        validMove = rookMove(x, y, toX, toY);
        break;
      case PieceTypes.KNIGHT:
        validMove = knightMove(x, y, toX, toY);
        break;
      case PieceTypes.BISHOP:
        validMove = bishopMove(x, y, toX, toY);
        break;
      case PieceTypes.QUEEN:
        validMove = queenMove(x, y, toX, toY);
        break;
      case PieceTypes.KING:
        validMove = kingMove(x, y, toX, toY, piece.color);
        break;
      case PieceTypes.PAWN:
        validMove = pawnMove(x, y, toX, toY, piece.color);
        break;
      default:
        // Do Nothing
        console.error('Unknown Piece Type: ' + piece.type);
    }





    if (validMove && !tempMove) {
      // Make a temp move to see if it will still be in check.
      let temp = piece.pos;
      let tempAt = -1;

      piece.pos = toPos;

      if (pieceAt) {
        tempAt = pieceAt.pos;
        pieceAt.pos = -1;
      }

      tempMove = true;

      // If the king remains in check it is not a valid move
      if(_isInCheck(turn)) {
        validMove = false;
      } 

      tempMove = false;

      piece.pos = temp;

      if (pieceAt) {
        pieceAt.pos = tempAt;
      }
    }

    return validMove;
  }
});

/*
  x, y: Position of the piece moving
  delta: How far along the line to validate
  xDir: Modifer for x. Determines which direction, if any, to go.
  yDir: Modifer for y. Determines which direction, if any, to go.
  target: The target position to move to
*/

function _checkLine(x, y, delta, xDir, yDir, target) {
  // Traverse the path to the move target
  for (let i = 1; i <= delta; i++) {
    let tempIndex = convertPositionToIndex(x + i * xDir, y + i * yDir);
    let pieceAt = _pieceAt(tempIndex);

    // If there is a piece
    // And it is in the way i.e. Not the move target
    // And if it's at the target, it must be an enemy
    if (pieceAt) {
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

  // On a diagonal
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
    if (toX === 6 && toY === 7 && 
      whiteCanCastleKings && !inCheck &&
      pieces[Pieces.WHITE_ROOK_2].pos === convertPositionToIndex(7, 7) &&
      !_pieceAt(convertPositionToIndex(5, 7)) && 
      !_pieceAt(convertPositionToIndex(6, 7)) &&
      !_canAttack(PieceColors.BLACK, convertPositionToIndex(5, 7)) &&
      !_canAttack(PieceColors.BLACK, convertPositionToIndex(6, 7))) {
        // King's Castle
        return true;
    } else if (toX === 2 && toY === 7 && 
      whiteCanCastleQueens && !inCheck &&
      pieces[Pieces.WHITE_ROOK_1].pos === convertPositionToIndex(0, 7) &&
      !_pieceAt(convertPositionToIndex(1, 7)) && 
      !_pieceAt(convertPositionToIndex(2, 7)) &&
      !_pieceAt(convertPositionToIndex(3, 7)) &&
      !_canAttack(PieceColors.BLACK, convertPositionToIndex(1, 7)) &&
      !_canAttack(PieceColors.BLACK, convertPositionToIndex(2, 7)) &&
      !_canAttack(PieceColors.BLACK, convertPositionToIndex(3, 7))) {
        // Queen's Castle
        return true;
    }
  } else if (pieceColor === PieceColors.BLACK) {
    // Black
    if (toX === 6 && toY === 0 && 
      blackCanCastleKings && !inCheck &&
      pieces[Pieces.BLACK_ROOK_2].pos === convertPositionToIndex(7, 0) &&
      !_pieceAt(convertPositionToIndex(5, 0)) &&
      !_pieceAt(convertPositionToIndex(6, 0)) &&
      !_canAttack(PieceColors.WHITE, convertPositionToIndex(5, 0)) &&
      !_canAttack(PieceColors.WHITE, convertPositionToIndex(6, 0))) {
        // King's Castle
        return true;
    } else if (toX === 2 && toY === 0 && 
      blackCanCastleQueens && !inCheck &&
      pieces[Pieces.BLACK_ROOK_1].pos === convertPositionToIndex(0, 0) &&
      !_pieceAt(convertPositionToIndex(1, 0)) &&
      !_pieceAt(convertPositionToIndex(2, 0)) &&
      !_pieceAt(convertPositionToIndex(3, 0)) &&
      !_canAttack(PieceColors.WHITE, convertPositionToIndex(2, 0)) &&
      !_canAttack(PieceColors.WHITE, convertPositionToIndex(3, 0))) {
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
    if (!_pieceAt(convertPositionToIndex(toX, toY)) && 
        !_pieceAt(convertPositionToIndex(toX, toY + 1)) &&
        y === 6 && (toX === x && (toY === 5 || toY === 4))) {
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
    if (!_pieceAt(convertPositionToIndex(toX, toY)) && 
        !_pieceAt(convertPositionToIndex(toX, toY - 1)) &&
        y === 1 && (toX === x && (toY === 2 || toY === 3))) {
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

// Can color attack the target
function _canAttack(color, target) {
  for (let p in pieces) {
    if (pieces[p].color === color) {
      if(BoardStore.canMove(target, p)) {
        return true;
      }
    }
  }
  return false;
}

// Checks to see if the color passed is in check
function _isInCheck(color) {
  const king = color === PieceColors.BLACK ? pieces[Pieces.BLACK_KING].pos : pieces[Pieces.WHITE_KING].pos;
  return _canAttack(invertColor(color), king);
}

BoardStore.dispatchToken = ChessDispatcher.register((action) => {
  switch(action.type) {
    case ActionTypes.BOARD_UPDATE:
      pieces = action.pieces;
      BoardStore.emitChange();
      break;
    case ActionTypes.PIECE_UPDATE:
      const piece = pieces[action.id];
      let pieceAt = _pieceAt(action.pos);

      // Valid moves only at this point, so check cannot continue to exist
      inCheck = false;

      if (pieceAt) {
        // Piece Capture
        pieceAt.pos = -1;
      }


      // Castling
      if (piece.type === PieceTypes.KING) {
        // White
        if (piece.color === PieceColors.WHITE) {
          // King's Castle
          if (action.pos === convertPositionToIndex(6, 7)) {
            pieces[Pieces.WHITE_ROOK_2].pos = convertPositionToIndex(5, 7);

          // Queen's Castle
          } else if (action.pos === convertPositionToIndex(2, 7)) {
            pieces[Pieces.WHITE_ROOK_1].pos = convertPositionToIndex(3, 7);
          }

          whiteCanCastleKings = false;
          whiteCanCastleQueens = false;

        // Black
        } else {
          // King's Castle
          if (action.pos === convertPositionToIndex(6, 0)) {
            pieces[Pieces.BLACK_ROOK_2].pos = convertPositionToIndex(5, 0);

          // Queen's Castle
          } else if (action.pos === convertPositionToIndex(2, 0)) {
            pieces[Pieces.BLACK_ROOK_1].pos = convertPositionToIndex(3, 0);
          }

          blackCanCastleKings = false;
          blackCanCastleQueens = false;
        }
      }

      // Remove Castling eligibility
      if (piece.type === PieceTypes.ROOK) {
        if (piece.color === PieceColors.WHITE) {
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



      if (piece.type === PieceTypes.PAWN) {
        const [x, y] = convertIndexToPosition(piece.pos);
        const [toX, toY] = convertIndexToPosition(action.pos);

        // White
        if (piece.color === PieceColors.WHITE) {
          // Promotion
          if (toY === 0) {
            // Auto Promote to Queen
            // Handle Dialog later
            piece.type = PieceTypes.QUEEN;


          // Capturing En Passant
          } else if (y === 3 && toX === whiteEnPassant) {
            _pieceAt(convertPositionToIndex(toX, y)).pos = -1;
            whiteEnPassant = -1;

          // Flagging En Passant
          } else if (y === 6 && toY === 4) {
            blackEnPassant = x;
          }

        // Black
        } else {
          // Promotion
          if (toY === 7) {
            piece.type = PieceTypes.QUEEN; 
          // Capturing En Passant
          } else if (y === 4 && toX === blackEnPassant) {
            _pieceAt(convertPositionToIndex(toX, y)).pos = -1;
            blackEnPassant = -1;
          }

          // Flagging En Passant
          if (y === 1 && toY === 3) {
            whiteEnPassant = x;
          }
        }
      }

      // Remove En Passant Flag
      if (piece.color === PieceColors.WHITE && whiteEnPassant !== -1) {
        whiteEnPassant = -1;
      } else if (piece.color === PieceColors.BLACK && blackEnPassant !== -1) {
        blackEnPassant = -1;
      }


      // Move Piece
      piece.pos = action.pos;
      turn = turn === PieceColors.WHITE ? PieceColors.BLACK : PieceColors.WHITE;

      if (_isInCheck(turn)) {
        inCheck = true;
        let hasMoves = false;
        // Check for Checkmate
        for (let p in pieces) {
          // Get opponent pieces to check for valid moves
          if (pieces[p].color === turn && !hasMoves) {
            // Check every damn square...
            for (let i = 0; i < 64 && !hasMoves; i++) {
              if(BoardStore.canMove(i, p)) {
                hasMoves = true;
              }
            }
          }
        }

        if (!hasMoves) {
          console.log('Checkmate!');
        }

        console.log(turn + ' in Check');
      }



      BoardStore.emitChange();
      break;
    default:
      // do nothing
  }
});

export default BoardStore;
