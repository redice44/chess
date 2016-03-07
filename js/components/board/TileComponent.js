(function() {
  'use strict';

  const classNames = require('classnames');

  const React = require('react');
  // const ExampleStore = require('./../stores/ExampleStore.js');

  function getStateFromStore() {
    return {
      // store getters
    };
  }

  class Tile extends React.Component {
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
        <div className = {classNames({
          'black': this.props.color === 'b'
        })}>{this.props.piece}
        </div>
      );
    }

    _onChange() {
      this.setState(getStateFromStore());
    }
  }

  module.exports = Tile;
})();
