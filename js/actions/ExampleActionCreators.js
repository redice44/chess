(function() {
  'use strict';

  const ExampleDispatcher = require('./../dispatcher/ExampleDispatcher.js');
  const ExampleConstants = require('./../constants/ExampleConstants.js');

  const ActionTypes = ExampleConstants.ActionTypes;

  module.exports = {

    changeValue: function(payload) {
      ExampleDispatcher.dispatch({
        type: ActionTypes.EXAMPLE,
        payload: payload
      });
    }
  };
})();
