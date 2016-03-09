'use strict';

import React, { Component, PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Tile from './TileComponent.js';
import Knight from './pieces/KnightComponent.js';
import { Pieces, PieceTypes, PieceColors } from './../../constants/ChessConstants.js';
import ChessActionCreator from './../../actions/ChessActionCreators.js';
import { getPieceType, getPieceColor, convertIndexToPosition, convertPositionToIndex } from './../../util/BoardUtility.js';

function getStateFromStore() {
  return {
    // store getters
  };
}

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = getStateFromStore();

    // Binding this
    this._renderSquare = this._renderSquare.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    //ExampleStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    //ExampleStore.removeChangeListener(this._onChange);
  }

  render() {
    const pieces = this.props.layout;
    const turn = this.props.turn;

    let Squares = [];

    
    for (let i = 0; i < 64; i++) {
      Squares.push(this._renderSquare(i));
    }

    for (let prop in pieces) {
      Squares[pieces[prop]] = this._renderPiece(pieces[prop], prop, turn);
    }

    return (
      <div id='board'>
        {Squares}
      </div>
    );
  }

  _renderSquare(i) {
    const [x, y] = convertIndexToPosition(i);

    return (
      <div key={i}>
        <Tile x = {x} y = {y}>
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
      default:
        // do nothing
    }

    return (
      <div key={i}>
        <Tile x = {x} y = {y}>
          {piece}
        </Tile>
      </div>
    );
  }

  _onChange() {
    this.setState(getStateFromStore());
  }
}

export default DragDropContext(HTML5Backend)(Board);
