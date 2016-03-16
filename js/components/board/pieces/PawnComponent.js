'use strict';

import React, { Component } from 'react';
import classNames from 'classnames';
import { DragSource } from 'react-dnd';
import { PieceTypes, PieceColors } from './../../../constants/ChessConstants.js';
import { getPieceColor } from './../../../util/BoardUtility.js';

const pawnSource = {
  canDrag(props) {
    return props.myTurn;
  },

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

class Pawn extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { id, black, connectDragSource, isDragging } = this.props;
    const whitePiece = '♙';
    const blackPiece = '♟';
    return connectDragSource(
      <div 
        style={{
          opacity: isDragging ? 0.5 : 1
        }}>
        { black ? blackPiece : whitePiece }
      </div>
    );
  }
}

export default DragSource(PieceTypes.PIECE, pawnSource, collect)(Pawn);


