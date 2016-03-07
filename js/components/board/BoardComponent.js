(function() {
  'use strict';

  const React = require('react');
  const Tile = require('./TileComponent.js');
  //const ExampleStore = require('./../stores/ExampleStore.js');


  function getStateFromStore() {
    return {
      // store getters
    };
  }

  function generateBoard(colors, pieces) {
    let board = [];
    colors.forEach((v, i) => {
      board.push({color: v, piece: pieces[i]});
    });

    return board.map(generateTile);
  }

  function generateTile(tile) {
    return (
        <Tile color = {tile.color} piece = {tile.piece} />
      );
  }

  class Board extends React.Component {
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
      let boardColorGrid = 'bwbwbwbwwbwbwbwb'.repeat(4);
      boardColorGrid = boardColorGrid.split('');

      let boardPieceGrid = 'RNBKQBNRPPPPPPPP' + '        '.repeat(4) + 'PPPPPPPPRNBQKBNR';
      boardPieceGrid.split('');

      let boardGrid = generateBoard(boardColorGrid, boardPieceGrid);
      return (
        <div id='board'>
          {boardGrid}
        </div>
      );
    }

    _onChange() {
      this.setState(getStateFromStore());
    }
  }

  module.exports = Board;
})();
