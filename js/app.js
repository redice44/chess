'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Board from './components/board/BoardComponent.js';

ReactDOM.render(
  <Board knightPosition={[3,0]} />
  , document.getElementById('react')
);
