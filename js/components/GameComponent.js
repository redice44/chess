'use strict';

import React, { Component } from 'react';
import Board from './board/BoardComponent.js';
import BoardStore from './../stores/BoardStore.js';

function getStateFromStore() {
  return {
    // store getters
    knightPosition: BoardStore.getKnightPosition()
  };
}

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = getStateFromStore();

    // Binding this
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    BoardStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    BoardStore.removeChangeListener(this._onChange);
  }

  render() {
    const pos = this.state.knightPosition; //[Math.floor(Math.random() * 8), Math.floor(Math.random() * 8)];
    return (
      <Board knightPosition={pos} />
    );
  }

  _onChange() {
    this.setState(getStateFromStore());
  }
}
