'use strict';

import React, { Component, PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Tile from './TileComponent.js';
import Knight from './pieces/KnightComponent.js';
import { Pieces, PieceTypes } from './../../constants/ChessConstants.js';
import ChessActionCreator from './../../actions/ChessActionCreators.js';
import { getPieceType, convertIndexToPosition, convertPositionToIndex } from './../../util/BoardUtility.js';

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
      <div key={i}>
        <Tile x = {x} y = {y}>
        </Tile>
      </div>
    );
  }

  _renderPiece(i, id) {
    const [x, y] = convertIndexToPosition(i);
    let piece = null;
    const pieceType = getPieceType(id)

    switch(pieceType) {
      case PieceTypes.KNIGHT:
        piece = <Knight id = {id} />;
        break;
      default:
        // do nothing
    }

    return (
      <div key={i}
        onClick={() => this._handleSquareClick(x, y, id)}>
        <Tile x = {x} y = {y}>
          {piece}
        </Tile>
      </div>
    );
  }

  _handleSquareClick(x, y, id) {
    ChessActionCreator.move(convertPositionToIndex(x, y), id);
  }

  _onChange() {
    this.setState(getStateFromStore());
  }
}

export default DragDropContext(HTML5Backend)(Board);
