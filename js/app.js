'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Game from './components/GameComponent.js';
import { setupBoard } from './util/BoardUtility.js';
import ChessActionCreators from './actions/ChessActionCreators.js';

ChessActionCreators.setupBoard(setupBoard());


ReactDOM.render(<Game />, document.getElementById('react'));
