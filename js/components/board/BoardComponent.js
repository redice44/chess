'use strict';

import React, { Component, PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Tile from './TileComponent.js';
import Knight from './pieces/KnightComponent.js';
import { Pieces } from './../../constants/ChessConstants.js';
import ChessActionCreator from './../../actions/ChessActionCreators.js';
import { convertIndexToPosition } from './../../util/PositionUtility.js';

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
    let Squares = [];
    let pieces = this.props.layout;
    
    for (let i = 0; i < 64; i++) {
      Squares.push(this._renderSquare(i));
    }

    for (let prop in pieces) {
      console.log(prop, pieces[prop]);
      Squares[pieces[prop]] = this._renderPiece(pieces[prop], prop);
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
      <div key={i}
        onClick={() => this._handleSquareClick(x, y)}>
        <Tile x = {x} y = {y}>
        </Tile>
      </div>
    );
  }

  _renderPiece(i, pieceType) {
    const [x, y] = convertIndexToPosition(i);
    let piece = null;

    switch(pieceType) {
      case Pieces.BLACK_KNIGHT_1:
      case Pieces.BLACK_KNIGHT_2:
      case Pieces.WHITE_KNIGHT_1:
      case Pieces.WHITE_KNIGHT_2:
        piece = <Knight id = {pieceType} />;
        break;
      default:
        // do nothing
    }

    return (
      <div key={i}
        onClick={() => this._handleSquareClick(x, y)}>
        <Tile x = {x} y = {y}>
          {piece}
        </Tile>
      </div>
    );
  }

  _handleSquareClick(x, y) {
    ChessActionCreator.moveKnight([x, y]);
  }

  _onChange() {
    this.setState(getStateFromStore());
  }
}

export default DragDropContext(HTML5Backend)(Board);
