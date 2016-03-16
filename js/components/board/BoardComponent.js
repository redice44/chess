'use strict';

import React, { Component, PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Tile from './TileComponent.js';
import Knight from './pieces/KnightComponent.js';
import Rook from './pieces/RookComponent.js';
import Bishop from './pieces/BishopComponent.js';
import Queen from './pieces/QueenComponent.js';
import King from './pieces/KingComponent.js';
import Pawn from './pieces/PawnComponent.js';
import { Pieces, PieceTypes, PieceColors } from './../../constants/ChessConstants.js';
import ChessActionCreator from './../../actions/ChessActionCreators.js';
import { getPieceType, getPieceColor, convertIndexToPosition, convertPositionToIndex } from './../../util/BoardUtility.js';

class Board extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { pieces, turn } = this.props;

    let Squares = [];
    
    for (let i = 0; i < 64; i++) {
      Squares.push(this._renderSquare(i));
    }

    for (let id in pieces) {
      // Squares[pieces[piece]] = this._renderPiece(pieces[piece], piece, turn);
      Squares[pieces[id].pos] = this._renderPiece(id, pieces[id], turn);
    }

    return (
      <div id='board'>
        {Squares}
      </div>
    );
  }

  _renderSquare(i) {
    return (
      <div key={i}>
        <Tile pos={i}>
        </Tile>
      </div>
    );
  }

  _renderPiece(id, piece, turn) {
    const myTurn = piece.color === turn;

    let pieceComponent = null;

    switch(piece.type) {
      case PieceTypes.KNIGHT:
        pieceComponent = <Knight id = {id} myTurn={myTurn} black = {piece.color === PieceColors.BLACK} />;
        break;
      case PieceTypes.ROOK:
        pieceComponent = <Rook id = {id} myTurn={myTurn} black = {piece.color === PieceColors.BLACK} />;
        break;
      case PieceTypes.BISHOP:
        pieceComponent = <Bishop id = {id} myTurn = {myTurn} black = {piece.color === PieceColors.BLACK} />;
        break;
      case PieceTypes.QUEEN:
        pieceComponent = <Queen id = {id} myTurn = {myTurn} black = {piece.color === PieceColors.BLACK} />;
        break;
      case PieceTypes.KING:
        pieceComponent = <King id = {id} myTurn = {myTurn} black = {piece.color === PieceColors.BLACK} />;
        break;
      case PieceTypes.PAWN:
        pieceComponent = <Pawn id = {id} myTurn = {myTurn} black = {piece.color === PieceColors.BLACK} />;
        break;
      default:
        // do nothing
        console.log('Attempting to render unknown piece.');
    }

    return (
      <div key={piece.pos}>
        <Tile pos={piece.pos}>
          {pieceComponent}
        </Tile>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Board);
