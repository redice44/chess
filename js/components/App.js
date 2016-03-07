(function() {
  'use strict';

  const React = require('react');
  const ExampleStore = require('./../stores/ExampleStore.js');

  function getStateFromStore() {
    return {
      // store getters
    };
  }

  class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = getStateFromStore();

      // Binding this
      this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
      ExampleStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
      ExampleStore.removeChangeListener(this._onChange);
    }

    render() {
      return (
        <div>
          Hello World
        </div>
      );
    }

    _onChange() {
      this.setState(getStateFromStore());
    }
  }

  module.exports = App;
})();
