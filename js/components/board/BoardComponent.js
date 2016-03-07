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

  function getTileColor(v) {
    return v === 'b' ? true : false;
  }

  function generateBoard(row) {
    return row.map(generateTile);
  }

  function generateTile(tile) {
    return (
        <Tile color = {tile} />
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
      let boardColorGrid = 'bwbwbwbw,wbwbwbwb,'.repeat(4).split('').reverse().join('').substring(1).split('').reverse().join('').split(',').map((v) => v.split(''));
      console.log(boardColorGrid);
      let boardGrid = boardColorGrid.map(generateBoard);
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
