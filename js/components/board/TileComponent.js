'use strict';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Square from './SquareComponent.js';
import { PieceTypes } from './../../constants/ChessConstants.js';
import { DropTarget } from 'react-dnd';
import ChessActionCreator from './../../actions/ChessActionCreators.js';
import BoardStore from './../../stores/BoardStore.js';
import { convertPositionToIndex, convertIndexToPosition } from './../../util/BoardUtility.js';

const squareTarget = {
  canDrop(props, monitor) {
    return BoardStore.canMove(props.pos, monitor.getItem().id);
  },

  drop(props, monitor) {
    ChessActionCreator.move(props.pos, monitor.getItem());
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

class Tile extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { pos, connectDropTarget, isOver, canDrop } = this.props;
    const [x, y] = convertIndexToPosition(pos);
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
}

Tile.propTypes = {
};

export default DropTarget(PieceTypes.PIECE, squareTarget, collect)(Tile);
