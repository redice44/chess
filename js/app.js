(function() {
  'use strict';

  const React = require('react');
  const ReactDOM = require('react-dom');
  const Board = require('./components/board/BoardComponent.js');
  
  ReactDOM.render(
    <Board />,
    document.getElementById('react')
  );
})();
