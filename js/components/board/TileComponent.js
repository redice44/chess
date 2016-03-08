'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Square from './SquareComponent.js';
import { PieceTypes } from './../../constants/ChessConstants.js';
import { DropTarget } from 'react-dnd';
import ChessActionCreator from './../../actions/ChessActionCreators.js';
import BoardStore from './../../stores/BoardStore.js';
import { convertPositionToIndex } from './../../util/PositionUtility.js';

const squareTarget = {
  canDrop(props, monitor) {
    return BoardStore.canMove(props.x, props.y, monitor.getItem());
  },

  drop(props, monitor) {
    ChessActionCreator.move(convertPositionToIndex(props.x, props.y), monitor.getItem());
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

function getStateFromStore() {
  return {
    // store getters
  };
}

class Tile extends Component {
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
    const { x, y, connectDropTarget, isOver, canDrop } = this.props;
    const black  = ( x + y ) % 2 == 1;

    return connectDropTarget (
      <div style={{ position: 'relative' }}>
        <Square black={black}>
          {this.props.children}
        </Square>
        {isOver && !canDrop && this._renderOverlay('red')}
        {!isOver && canDrop && this._renderOverlay('yellow')}
        {isOver && canDrop && this._renderOverlay('green')}
      </div>
    );
  }

  _renderOverlay(color) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        zIndex: 1,
        opacity: 0.5,
        backgroundColor: color,
      }} />
    );
  }

  _onChange() {
    this.setState(getStateFromStore());
  }
}

Tile.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
};

export default DropTarget(PieceTypes.PIECE, squareTarget, collect)(Tile);
