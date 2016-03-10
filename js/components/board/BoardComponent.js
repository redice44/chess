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

    for (let piece in pieces) {
      Squares[pieces[piece]] = this._renderPiece(pieces[piece], piece, turn);
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

  _renderPiece(i, id, turn) {
    const [x, y] = convertIndexToPosition(i);
    const pieceType = getPieceType(id);
    const myTurn = getPieceColor(id) === turn;

    let piece = null;

    switch(pieceType) {
      case PieceTypes.KNIGHT:
        piece = <Knight id = {id} myTurn={myTurn} />;
        break;
      case PieceTypes.ROOK:
        piece = <Rook id = {id} myTurn={myTurn} />;
        break;
      case PieceTypes.BISHOP:
        piece = <Bishop id = {id} myTurn = {myTurn} />;
        break;
      case PieceTypes.QUEEN:
        piece = <Queen id = {id} myTurn = {myTurn} />;
        break;
      case PieceTypes.KING:
        piece = <King id = {id} myTurn = {myTurn} />;
        break;
      case PieceTypes.PAWN:
        piece = <Pawn id = {id} myTurn = {myTurn} />;
        break;
      default:
        // do nothing
    }

    return (
      <div key={i}>
        <Tile pos={i}>
          {piece}
        </Tile>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Board);
