'use strict';

import React, { Component, PropTypes } from 'react';
import Square from './SquareComponent.js';
import Knight from './pieces/KnightComponent.js';

function getStateFromStore() {
  return {
    // store getters
  };
}

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.state = getStateFromStore();

    // Binding this
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
    const x = i % 8;
    const y = Math.floor(i / 8);
    const black = (x + y) % 2 === 1;

    const [knightX, knightY] = this.props.knightPosition;
    const piece = (x === knightX && y === knightY) ? <Knight /> : null;

    return (
      <div key={i}
        onClick={() => this._handleSquareClick(x, y)}>
        <Square black = {black}>
          {piece}
        </Square>
      </div>
    );
  }

  _handleSquareClick(x, y) {
    
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