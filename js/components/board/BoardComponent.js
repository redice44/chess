'use strict';

import React, { Component, PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Tile from './TileComponent.js';
import Knight from './pieces/KnightComponent.js';
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
    
    for (let i = 0; i < 64; i++) {
      Squares.push(this._renderSquare(i));
    }

    return (
      <div id='board'>
        {Squares}
      </div>
    );
  }

  _renderSquare(i) {
    const [x, y] = convertIndexToPosition(i);
    const black = (x + y) % 2 === 1;

    const [knightX, knightY] = this.props.knightPosition;
    const piece = (x === knightX && y === knightY) ? <Knight /> : null;

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

Board.propTypes = {
  knightPosition: PropTypes.arrayOf(
    PropTypes.number.isRequired
  ).isRequired
};

export default DragDropContext(HTML5Backend)(Board);
