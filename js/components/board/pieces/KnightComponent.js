'use strict';

import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { PieceTypes } from './../../../constants/ChessConstants.js';

const knightSource = {
  beginDrag(props) {
    return { id: props.id };
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

function getStateFromStore() {
  return {
    // store getters
  };
}

class Knight extends Component {
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
    const { connectDragSource, isDragging } = this.props;
    return connectDragSource(
      <div style={{
        opacity: isDragging ? 0.5 : 1
      }}>
      &#9816;
      </div>
    );
  }

  _onChange() {
    this.setState(getStateFromStore());
  }
}

export default DragSource(PieceTypes.KNIGHT, knightSource, collect)(Knight);


