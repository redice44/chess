'use strict';

import React, { Component } from 'react';
import Board from './board/BoardComponent.js';
import BoardStore from './../stores/BoardStore.js';

function getStateFromStore() {
  return {
    // store getters
    layout: BoardStore.getLayout()
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
    const layout = this.state.layout;
    return (
      <Board layout={layout} />
    );
  }

  _onChange() {
    this.setState(getStateFromStore());
  }
}
