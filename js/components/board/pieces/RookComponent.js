'use strict';

import React, { Component } from 'react';
import classNames from 'classnames';
import { DragSource } from 'react-dnd';
import { PieceTypes, PieceColors } from './../../../constants/ChessConstants.js';
import { getPieceColor } from './../../../util/BoardUtility.js';

const rookSource = {
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

class Rook extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { id, connectDragSource, isDragging } = this.props;
    const white = '♖';
    const black = '♜';
    return connectDragSource(
      <div 
        style={{
          opacity: isDragging ? 0.5 : 1
        }}>
        { getPieceColor(id) === PieceColors.BLACK ? black : white }
      </div>
    );
  }
}

export default DragSource(PieceTypes.PIECE, rookSource, collect)(Rook);


