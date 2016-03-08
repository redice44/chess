'use strict';

import React, { Component } from 'react';

function getStateFromStore() {
  return {
    // store getters
  };
}

export default class KnightPiece extends Component {
  constructor(props) {
    super(props);
    this.state = getStateFromStore();

    // Binding this
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    // ExampleStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    // ExampleStore.removeChangeListener(this._onChange);
  }

  render() {
    return (
      <span>&#9816;</span>
    );
  }

  _onChange() {
    this.setState(getStateFromStore());
  }
}
